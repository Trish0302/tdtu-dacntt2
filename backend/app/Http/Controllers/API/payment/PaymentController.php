<?php

namespace App\Http\Controllers\API\payment;

use App\Http\Controllers\Controller;
use App\Http\Controllers\OrdersController;
use App\Models\Order;
use Illuminate\Http\Request;

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
        $orderController = new OrdersController;

        switch ($resultCode) {
            case 0:
                $order->histories()->create([
                    'history_id' => 2,
                ]);
                break;
            default:
                $order->histories()->create([
                    'history_id' => 3,
                ]);
                break;
        }

        $current_history = $order->histories()->latest()->first()->history()->first();

        return response()->json(
            [
                'message' => $current_history->message,
                'data' => $orderController->show($order->id)->original['data'],
                'status' => 200,
            ],
            200
        );
    }
}
