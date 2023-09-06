<?php

namespace App\Http\Controllers\API\payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function respond(Request $request)
    {
        if ($request->exists('resultCode')) {
            $resultCode = $request->resultCode;
            $orderId = $request->orderId;
        } else if ($request->exists('vnp_ResponseCode')) {
            $resultCode = $request->vnp_ResponseCode;
            $orderId = $request->vnp_TxnRef;
        }

        $order = Order::where('transaction_code', $orderId)->firstOrFail();

        switch ($resultCode) {
            case 0:
                $order->histories()->create([
                    'history_id' => 2,
                ]);

                Mail::send('emails.makeOrderSuccessfully', [
                    'order' => $order,
                ], function ($email) use ($order) {
                    $email->to($order->customer->email)->subject('Xác nhận Đặt Đơn Hàng Thành công!');
                });

                break;
            default:
                $order->histories()->create([
                    'history_id' => 3,
                ]);
                break;
        }

        $current_history = $order->histories()->latest()->first()->history()->first();

        return redirect()->away(
            "http://localhost:5173/payment-success?order_id={$order->id}&status={$current_history->id}"
        );
    }
}
