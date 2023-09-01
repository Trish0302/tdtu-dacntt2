<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\payment\MOMOController;
use App\Http\Controllers\API\payment\PayPalController;
use App\Http\Controllers\API\payment\VNPAYController;
use App\Http\Requests\OrdersRequest;
use App\Models\History;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderHistory;
use App\Models\Voucher;
use Exception;
use Illuminate\Http\Request;
use stdClass;
use Barryvdh\DomPDF\Facade\Pdf;

class OrdersController extends Controller
{
    private $fields = [
        'order' => [
            'id',
            'name',
            'address',
            'phone',
            'total',
            'customer_id',
            'store_id',
            'voucher_id',
            'payment_type',
            'created_at',
            'updated_at',
        ],
        'detail' => [
            'id',
            'quantity',
            'food_id',
            'order_id',
            'unit_price',
        ],
        'detail.food' => [
            'id',
            'name',
            'slug',
            'avatar',
        ],
        'history' => [
            'order_id',
            'history_id',
            'created_at',
        ],
        'customer' => [
            'id',
            'name',
            'email',
            'phone',
            'avatar',
            'address',
        ],
        'store' => [
            'id',
            'name',
            'address',
            'description',
        ],
        'voucher' => [
            'id',
            'code',
            'discount',
        ],
    ];

    public function multiple_eager_load($association_list, $result = [])
    {
        foreach ($association_list as $association_name) {
            $result[] = $association_name . ':' . join(',', $this->fields[$association_name]);
        }
        return $result;
    }

    public function getOrderProgresses($order_id)
    {
        $customer_history = OrderHistory::select($this->fields['history'])
            ->where('order_id', $order_id)->get();

        $progress_result = [];
        foreach ($customer_history as $history_item) {
            $progresses = (object) [
                'order_progress' => History::find($history_item->history_id)->message,
                'timestamp' => $history_item->created_at->toDateTimeString(),
            ];

            $progress_result[] = $progresses;
        }

        $order_info = new stdClass;
        $order_info->order_id = $history_item->order_id;

        $histories = new stdClass;
        $histories->order_info = $order_info;
        $histories->progresses = $progress_result;

        return $histories;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = $request->q;

        if ($request->exists('customer_id')) {
            $orders = Order::where('customer_id', $request->customer_id);
        } else if ($request->exists('store_id')) {
            $orders = Order::where('store_id', $request->store_id);
        } else {
            $orders = Order::select($this->fields['order']);
        }

        $orders = $orders->with($this->multiple_eager_load(['customer', 'store']));

        if ($query) {
            $orders = $orders->where(function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                    ->orWhere('address', 'like', '%' . $query . '%')
                    ->orWhereHas('customer', function ($sub_query) use ($query) {
                        return $sub_query->where('name', 'like', '%' . $query . '%');
                    })->orWhereHas('store', function ($sub_query) use ($query) {
                        return $sub_query->where('name', 'like', '%' . $query . '%');
                    });
            });
        }

        $orders = $orders->orderBy('updated_at', 'desc')
            ->paginate($request->page_size ?? 10, $this->fields['order']);

        $orders->map(function ($order) {
            $order->lastest_order_progress = OrderHistory::where('order_id', $order->id)
                ->orderBy('updated_at', 'desc')
                ->first()->history()->first()->message;
            return $order;
        });

        $result = response()->json([
            'data' => $orders->items(),
            'paging' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage(),
            ],
            'status' => 200,
        ], 200);

        return $result;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(OrdersRequest $request)
    {
        $sub_total = 0;
        foreach ($request->items as $food) {
            $sub_total += $food['quantity'] * $food['price'];
        }

        $total = $sub_total;
        $voucher_id = $request->voucher_id;
        if (empty($voucher_id)) {
            $voucher_id = 0;
        } else {
            $voucher = Voucher::find($voucher_id);
            $total = (100 - $voucher->discount) * $sub_total / 100;
        }

        $payment_type = $request->payment_type;
        $transaction_code = time() . '_dacntt2';

        if ($payment_type == 1) {
            $momo_payment = new MOMOController;
            $confirmation_url = $momo_payment->handle($total, $transaction_code);
        } else if ($payment_type == 2) {
            $vnp_payment = new VNPAYController;
            $confirmation_url = $vnp_payment->payment($total * 100, $transaction_code)['data'];
        } else if ($payment_type == 3) {
            $payPal_payment = new PayPalController;
            $confirmation_url = $payPal_payment->processTransaction($total);
            $transaction_code = explode("=", $confirmation_url)[1];
        }

        $order = Order::create([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'total' => $total,
            'store_id' => $request->store_id,
            'voucher_id' => $voucher_id,
            'customer_id' => $request->customer_id,
            'payment_type' => $payment_type,
            'transaction_code' => $transaction_code,
        ]);

        $order_id = $order->id;
        foreach ($request->items as $food) {
            OrderDetail::create([
                'order_id' => $order_id,
                'food_id' => $food['id'],
                'quantity' => $food['quantity'],
                'unit_price' => $food['price'],
            ]);
        }

        $order->histories()->create([
            'history_id' => 1,
        ]);

        return response()->json([
            'message' => 'Create new order successfully!',
            'data' => $order,
            'confirmation_url' => $confirmation_url,
            'status' => 200,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $order = Order::select($this->fields['order'])
                ->with($this->multiple_eager_load([
                    'customer', 'store', 'detail', 'detail.food', 'voucher'
                ]))
                ->findOrFail($id)
                ->setAttribute('history', $this->getOrderProgresses($id));

            return response()->json([
                'message' => 'Get order detail successfully!',
                'data' => $order,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid order detail. Please try again!',
                'data' => $id,
                'status' => 400,
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(OrdersRequest $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            $order_detail = $order->detail;
            $sub_total = 0;

            $voucher_id = $request->voucher_id;
            $voucher = Voucher::find($voucher_id);

            foreach ($order_detail as $index => $order_item) {
                $food_item = $request->items[$index];
                $item_total = $food_item['price'] * $food_item['quantity'];

                $order_item->update([
                    'food_id' => $food_item['id'],
                    'quantity' => $food_item['quantity'],
                    'unit_price' => $food_item['price'],
                ]);

                $sub_total += $item_total;
            }

            $total = (100 - $voucher->discount) * $sub_total / 100;

            $order->update([
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'total' => $total,
                'store_id' => $request->store_id,
                'voucher_id' => $request->voucher_id,
                'customer_id' => $request->customer_id,
                'payment_type' => $request->payment_type,
            ]);

            return response()->json([
                'message' => 'Edit order successfully!',
                'data' => true,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid order. Please try again!',
                'data' => $id,
                'status' => 400,
            ], 400);
        }

        return $order;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->detail()->delete();
            $order->histories()->delete();
            $order->delete();

            return response()->json([
                'message' => 'Delete order successfully!',
                'data' => true,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid order. Please try again!',
                'data' => $id,
                'status' => 400,
            ], 400);
        }
    }

    public function printPDF($id)
    {
        $order_detail_object = $this->show($id)->getData();

        if ($order_detail_object->status == 200) {
            $order_detail = $order_detail_object->data;

            $file_name = 'order' . $order_detail->id . '_' . time() . '.pdf';

            $pdf = PDF::loadView('pdfs.printOrder', [
                'order_detail' => $order_detail,
            ])
                ->setPaper('a4', 'portrait')
                ->save('storage/' . $file_name);

            return asset('storage/' . $file_name);
        } else {
            return $order_detail_object;
        }
    }
}
