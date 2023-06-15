<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\payment\MOMOController;
use App\Http\Requests\OrdersRequest;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
            'customer_id' => 3, // missing
            'payment_type' => $payment_type, // missing
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
}
