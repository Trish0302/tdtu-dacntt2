<?php

namespace App\Http\Controllers;

use App\Http\Requests\RatingRequest;
use App\Models\Order;
use App\Models\Rating;
use Exception;
use stdClass;

class RatingController extends Controller
{
    private $fields = [
        'rating' => [
            'id',
            'food_id',
            'rating',
        ],
        'food' => [
            'id',
            'name',
        ],
    ];

    public function addRatingForCustomer(RatingRequest $request)
    {
        $this->authorize('create', [Rating::class, $request->customer_id]);

        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        $orders = Order::where('customer_id', $request->customer_id)->with('detail.food')->get()->pluck('detail')->flatten();

        $food_list = [];
        foreach ($orders as $orders) {
            $food_list[] = $orders->food->id;
        }

        $object = new stdClass;
        $object->food_id = ['User did not make any order with this order!'];
        if (in_array($request->food_id, $food_list) == false) {
            return response()->json([
                'message' => $object,
                'status' => 400,
            ], 400);
        }

        $rating = Rating::create($request->all());

        return response()->json([
            'message' => 'Add new rating for customer successfully!',
            'data' => $rating,
            'status' => 200,
        ], 200);
    }

    public function getRatingsForCustomer($customer_id)
    {
        try {
            $ratings = Rating::select($this->fields['rating'])
                ->with([
                    'food' => function ($query) {
                        $query->select($this->fields['food']);
                    }
                ])
                ->where('customer_id', $customer_id)
                ->get();

            return response()->json([
                'message' => 'Get rating list successfully!',
                'data' => $ratings,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid customer. Please try again!',
                'status' => 400,
            ], 400);
        }
    }
}
