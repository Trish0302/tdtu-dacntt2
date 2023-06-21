<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\payment\MOMOController;
use App\Http\Requests\OrdersRequest;
use App\Models\History;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderHistory;
use Exception;
use Illuminate\Http\Request;
use stdClass;

class OrdersController extends Controller
{
    private $fields = [
        'order' => [
            'id',
            'name',
            'address',
            'phone',
            'total',
        ],
        'order_detail' => [
            'id',
            'quantity',
            'total',
            'food_id',
            'order_id',
        ],
        'history' => [
            'order_id',
            'history_id',
            'created_at',
        ],
    ];

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
        $orders = Order::orderBy('updated_at', 'desc')->paginate($request->page_size ?? 10, $this->fields['order']);
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
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        $sub_total = 0;
        foreach ($request->items as $food) {
            $sub_total += $food['quantity'] * $food['price'];
        }

        $payment_type = $request->payment_type;
        $transaction_code = time() . '_dacntt2';
        $order = Order::create([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'total' => $sub_total,                  // missing
            'store_id' => $request->store_id,
            'voucher_id' => $request->voucher_id,
            'customer_id' => $request->customer_id, // missing
            'payment_type' => $payment_type,        // missing
            'transaction_code' => $transaction_code,
        ]);

        $order_id = $order->id;
        foreach ($request->items as $food) {
            OrderDetail::create([
                'order_id' => $order_id,
                'food_id' => $food['id'],
                'quantity' => $food['quantity'],
                'total' => $food['price'] * $food['quantity'],
            ]);
        }

        $momoPayment = new MOMOController;

        $order->histories()->create([
            'history_id' => 1,
        ]);

        return response()->json([
            'message' => 'Create new order successfully!',
            'data' => $order,
            'confirmation_url' => $momoPayment->handle($sub_total, $transaction_code),
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
            $order = Order::select($this->fields['order'])->with(['detail' => function ($query) {
                $query->select($this->fields['order_detail']);
            }])->findOrFail($id)->setAttribute('history', $this->getOrderProgresses($id));

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

            foreach ($order_detail as $index => $order_item) {
                $food_item = $request->items[$index];
                $item_total = $food_item['price'] * $food_item['quantity'];

                $order_item->update([
                    'food_id' => $food_item['id'],
                    'quantity' => $food_item['quantity'],
                    'total' => $item_total,
                ]);

                $sub_total += $item_total;
            }

            $order->update([
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'total' => $sub_total,                      // missing
                'store_id' => $request->store_id,
                'voucher_id' => $request->voucher_id,
                'customer_id' => $request->customer_id,     // missing
                'payment_type' => $request->payment_type,   // missing
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
            $order->history()->delete();
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

    public function viewHistory(Request $request)
    {
        $customer_id = $request->customer_id;
        $order_ids = Order::where('customer_id', $customer_id)->pluck('id');

        if (count($order_ids) > 0) {
            $histories = [];
            foreach ($order_ids as $order_id) {
                $histories[] = $this->getOrderProgresses($order_id);
            }

            return response()->json([
                'message' => 'Get order histories successfully!',
                'data' => $histories,
                'status' => 200,
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid customer. Please try again!',
            'data' => $customer_id,
            'status' => 400,
        ], 400);
    }
}
