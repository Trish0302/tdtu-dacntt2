<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\payment\MOMOController;
use App\Http\Requests\OrdersRequest;
use App\Models\History;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use stdClass;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
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
            'total' => $sub_total, // missing
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

        History::create([
            'order_id' => $order_id,
            'status_id' => 0,
            'transaction_id' => 0,
            'delivery_id' => 0,
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
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function viewHistory(Request $request)
    {
        $customer_id = $request->customer_id;
        $order_ids = Order::where('customer_id', $customer_id)->pluck('id');

        $order_progresses = [
            '000' => 'Order was placed successfully.',
            '030' => 'Order was paid successfully.',
            '020' => 'Order was paid unsuccessfully.',
        ];
        $histories = [];
        foreach ($order_ids as $order_id) {
            $customer_history = History::select('order_id', 'status_id', 'transaction_id', 'delivery_id', 'created_at')
                ->where('order_id', $order_id)->get();

            $history = new stdClass;
            $order_info = new stdClass;
            $progresses = [];
            foreach ($customer_history as $history_item) {
                $order_progress = $history_item->status_id . $history_item->transaction_id . $history_item->delivery_id;

                $progress_object = (object) [
                    'order_progress' => $order_progresses[$order_progress],
                    'timestamp' => $history_item->created_at->toDateTimeString(),
                ];
                $progresses[] = $progress_object;

                $order_info->order_id = $history_item->order_id;
            }
            $history->order_info = $order_info;
            $history->progresses = $progresses;

            $histories[] = $history;
        }

        return $histories;
    }
}
