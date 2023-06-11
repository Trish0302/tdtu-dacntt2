<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\FoodRequest;
use App\Models\Food;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    private $fields = [
        'food' => [
            'food.id',
            'food.name',
            'food.slug',
            'food.description',
            'food.price',
            'food.food_group_id',
        ],
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($store_id, $food_group_id, Request $request)
    {
        try {
            $food = Store::findOrFail($store_id)
                ->food_groups()
                ->findOrFail($food_group_id)
                ->food()
                ->select($this->fields['food'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->page_size ?? 10);

            return response()->json([
                'message' => 'Get food list successfully!',
                'data' => $food->items(),
                'paging' => [
                    'current_page' => $food->currentPage(),
                    'per_page' => $food->perPage(),
                    'total' => $food->total(),
                    'last_page' => $food->lastPage(),
                ],
                'status' => 200,
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'status' => 400,
                'data' => false,
                'message' => $err->getMessage(),
            ], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($store_id, $food_group_id, FoodRequest $request)
    {
        $food_list = $this->index($store_id, $food_group_id, $request)->getData();

        if ($food_list->status == 200) {

            $food = Food::create([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'price' => $request->price,
                'food_group_id' => $request->food_group_id,
            ]);

            return response()->json([
                'message' => 'Create new food successfully!',
                'data' => $food,
                'status' => 200,
            ], 200);
        } else {
            return $food_list;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($store_id, $food_group_id, $food_id)
    {
        try {
            $food = Store::findOrFail($store_id)
                ->food()
                ->where('food_group_id', '=', $food_group_id)
                ->findOrFail($food_id, $this->fields['food']);

            return response()->json([
                'message' => 'Get food detail successfully!',
                'data' => $food,
                'status' => 200,
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'status' => 400,
                'data' => false,
                'message' => $err->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(FoodRequest $request, $store_id, $food_group_id, $food_id)
    {
        try {
            $food = Store::findOrFail($store_id)
                ->food()
                ->where('food_group_id', '=', $food_group_id)
                ->findOrFail($food_id, $this->fields['food']);

            $food->update($request->all());

            return response()->json([
                'message' => 'Edit food detail successfully!',
                'data' => $food,
                'status' => 200,
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'status' => 400,
                'data' => false,
                'message' => $err->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($store_id, $food_group_id, $food_id)
    {
        try {
            return response()->json([
                'message' => 'Delete food successfully!',
                'data' => Store::findOrFail($store_id)
                    ->food()
                    ->where('food_group_id', '=', $food_group_id)
                    ->findOrFail($food_id, $this->fields['food'])
                    ->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid food group. Please try again!',
                'status' => 400,
            ], 400);
        }
    }
}
