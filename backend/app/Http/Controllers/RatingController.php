<?php

namespace App\Http\Controllers;

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
                'message' => 'Get voucher successfully!',
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
