<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderHistory;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
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
        ],
        'food' => [
            'id',
            'name',
            'avatar',
        ],
        'history' => [
            'id',
            'message',
        ],
        'store' => [
            'id',
            'name',
            'avatar',
            'address',
            'description',
        ],
        'order_history' => [
            'id',
            'order_id',
            'history_id',
            'updated_at',
        ]
    ];

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
        return OrderDetail::select(
            'food_id',
            DB::raw('count(id) as total_food_item'),
            DB::raw('sum(quantity) as count_food'),
        )
            ->with($this->multiple_eager_load(['food']))
            ->groupBy('food_id')
            ->orderBy('total_food_item', 'desc')
            ->limit(5)
            ->get();
    }

    public function getTopStores()
    {
        return Order::select(
            'store_id',
            DB::raw('count(id) as total_orders'),
            DB::raw('count(DISTINCT customer_id) as total_customers'),
            DB::raw('sum(total) as total_profits'),
        )
            ->with($this->multiple_eager_load(['store']))
            ->groupBy('store_id')
            ->orderBy('total_profits', 'desc')
            ->limit(5)
            ->get();
    }

    public function getRecentOrders()
    {
        $order_histories = OrderHistory::latest()
            ->with($this->multiple_eager_load(['order', 'history']))
            ->limit(5)
            ->get($this->fields['order_history']);

        return $order_histories;
    }

    public function multiple_eager_load($association_list, $result = [])
    {
        foreach ($association_list as $association_name) {
            $result[] = $association_name . ':' . join(',', $this->fields[$association_name]);
        }
        return $result;
    }
}
