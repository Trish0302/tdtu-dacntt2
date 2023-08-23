<?php

namespace App\Http\Controllers;

use App\Http\Requests\RatingRequest;
use App\Models\Rating;
use Exception;

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
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        $ratings = Rating::create($request->all());

        return $ratings;
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
