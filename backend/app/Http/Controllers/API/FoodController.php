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
            'food.avatar',
            'food.description',
            'food.price',
            'food.discount',
            'food.food_group_id',
        ],
        'food_group' => [
            'id',
            'name',
            'slug',
            'description',
            'store_id',
        ],
        'store' => [
            'id',
            'name',
            'address',
            'description',
        ]
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($store_id, $food_group_id, Request $request)
    {
        try {
            $food = $this->get_food_list()
                ->where('food_group_id', $food_group_id)
                ->orderBy('created_at', 'desc')
                ->paginate($request->page_size ?? 10);

            $this->get_discounted_price($food);

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
            if ($request->hasFile('avatar')) {
                $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
                $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

                $result = $request->file('avatar')->storeOnCloudinaryAs('food', $avatar_name);
                $avatar = $result->getSecurePath();
            } else {
                $avatar = 'https://res.cloudinary.com/ddusqwv7k/image/upload/v1688648527/users/default-avatar_1688648526.png';
            }

            $food = Food::create([
                'name' => $request->name,
                'slug' => $request->slug,
                'avatar' => $avatar,
                'description' => $request->description,
                'price' => $request->price,
                'discount' => $request->discount,
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

            $food->setAttribute('discounted_price', $food->price * (100 - $food->discount) / 100);

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

            if ($request->hasFile('avatar')) {
                $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
                $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

                $result = $request->file('avatar')->storeOnCloudinaryAs('food', $avatar_name);
                $avatar = $result->getSecurePath();
            } else {
                $avatar = $food->avatar;
            }

            $food->update([
                'name' => $request->name,
                'slug' => $request->slug,
                'avatar' => $avatar,
                'description' => $request->description,
                'price' => $request->price,
                'discount' => $request->discount,
                'food_group_id' => $request->food_group_id,
            ]);

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

    public function getAll(Request $request)
    {
        if (isset($request->store_id)) {
            $food = Store::find($request->store_id)->food();
        } else {
            $food = $this->get_food_list();
        }

        $results = $food->orderBy('food.updated_at', 'desc')->paginate(
            $request->page_size ?? 10,
            $this->fields['food']
        );

        $this->get_discounted_price($results);

        return response()->json([
            'message' => 'Get food list successfully!',
            'data' => $results->items(),
            'paging' => [
                'current_page' => $results->currentPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
                'last_page' => $results->lastPage(),
            ],
            'status' => 200,
        ], 200);
    }

    public function getDetail(Request $request)
    {
        try {
            $id = $request->id;

            $food = Food::select($this->fields['food'])
                ->with([
                    'food_group' => function ($query) {
                        $query->select($this->fields['food_group']);
                    },
                    'food_group.store' => function ($query) {
                        $query->select($this->fields['store']);
                    },
                ])
                ->findOrFail($id);

            $food->setAttribute('discounted_price', $food->price * (100 - $food->discount) / 100);

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

    private function get_food_list()
    {
        return Food::select($this->fields['food'])->with(['food_group' => function ($query) {
            $query->select($this->fields['food_group'])->with(['store' => function ($query) {
                $query->select($this->fields['store']);
            }]);
        }]);
    }

    private function get_discounted_price($input_arr)
    {
        $input_arr->map(function ($food) {
            $food->discounted_price = $food->price * (100 - $food->discount) / 100;
            return $food;
        });
    }
}
