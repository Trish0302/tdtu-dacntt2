<?php

namespace App\Http\Controllers\API\payment;

use App\Http\Controllers\Controller;
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

        switch ($resultCode) {
            case 0:
                $order->histories()->create([
                    'history_id' => 2,
                ]);
                break;
            case 1006:
            case 1002:
            case 1005:
            default:
                $order->histories()->create([
                    'history_id' => 3,
                ]);
                break;
        }

        return redirect()->to('http://localhost:8000/');
    }
}
