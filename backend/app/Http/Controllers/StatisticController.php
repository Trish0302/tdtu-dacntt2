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
                $result = User::count();
                break;
            case 'store':
                $result = Store::count();
                break;
            case 'order':
                $result = Order::count();
                break;
            case 'profit':
                $result = Order::sum('total');
                break;
            case 'momo':
                $result = Order::where('payment_type', 1)->count();
                break;
            case 'vnpay':
                $result = Order::where('payment_type', 2)->count();
                break;
            case 'paypal':
                $result = Order::where('payment_type', 3)->count();
                break;
            default:
                $result = null;
        }

        return response()->json([
            'message' => "Get total {$type} successfully!",
            'data' => $result,
            'status' => 200,
        ], 200);
    }

    public function getTotalOrders(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        $startDate = Carbon::createFromFormat('Y-m-d', $from)->startOfDay();
        $endDate = Carbon::createFromFormat('Y-m-d', $to)->endOfDay();

        $orders = Order::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as date"),
            DB::raw('count(id) as total_orders'),
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->get();

        return response()->json([
            'message' => "Get total orders successfully!",
            'data' => $orders,
            'status' => 200,
        ], 200);
    }

    public function getTopProducts()
    {
        $products = OrderDetail::select(
            'food_id',
            DB::raw('count(id) as total_food_item'),
            DB::raw('sum(quantity) as count_food'),
        )
            ->with($this->multiple_eager_load(['food']))
            ->groupBy('food_id')
            ->orderBy('total_food_item', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'message' => "Get top products successfully!",
            'data' => $products,
            'status' => 200,
        ], 200);
    }

    public function getTopStores()
    {
        $stores = Order::select(
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

        return response()->json([
            'message' => "Get top stores successfully!",
            'data' => $stores,
            'status' => 200,
        ], 200);
    }

    public function getRecentOrders()
    {
        $order_histories = OrderHistory::latest()
            ->with($this->multiple_eager_load(['order', 'history']))
            ->limit(5)
            ->get($this->fields['order_history']);

        return response()->json([
            'message' => "Get top stores successfully!",
            'data' => $order_histories,
            'status' => 200,
        ], 200);
    }

    private function multiple_eager_load($association_list, $result = [])
    {
        foreach ($association_list as $association_name) {
            $result[] = $association_name . ':' . join(',', $this->fields[$association_name]);
        }
        return $result;
    }
}
