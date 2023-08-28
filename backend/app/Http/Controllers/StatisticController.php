<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Models\Store;
use App\Models\User;

class StatisticController extends Controller
{
    public function getTotal($type)
    {
        if ($type == 'user') {
            return User::count();
        } else if ($type == 'store') {
            return Store::count();
        } else if ($type == 'order') {
            return Order::count();
        } else if ($type == 'profit') {
            return Order::sum('total');
        }
    }

    public function getTotalOrders()
    {
    }

    public function getRecentOrderProgresses()
    {
        $order_histories = OrderHistory::latest()->with([
            'order:id,name,address,total',
            'history:id,message',
        ])->limit(5)->get([
            'id', 'order_id', 'history_id', 'updated_at'
        ]);

        return $order_histories;
    }
}
