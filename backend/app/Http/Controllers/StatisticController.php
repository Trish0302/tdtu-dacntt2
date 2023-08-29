<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderHistory;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function getTotal(Request $request)
    {
        $type = $request->type;

        switch ($type) {
            case 'user':
                return User::count();
            case 'store':
                return Store::count();
            case 'order':
                return Order::count();
            case 'profit':
                return Order::sum('total');
            case 'momo':
                return Order::where('payment_type', 1)->count();
            case 'vnpay':
                return Order::where('payment_type', 2)->count();
            case 'paypal':
                return Order::where('payment_type', 3)->count();
        }
    }

    public function getTotalOrders(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        $startDate = Carbon::createFromFormat('Y-m-d', $from)->startOfDay();
        $endDate = Carbon::createFromFormat('Y-m-d', $to)->endOfDay();

        return Order::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as date"),
            DB::raw('count(id) as total_orders'),
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->get();
    }

    public function getTopProducts()
    {
    }

    public function getTopStores()
    {
    }

    public function getRecentOrders()
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
