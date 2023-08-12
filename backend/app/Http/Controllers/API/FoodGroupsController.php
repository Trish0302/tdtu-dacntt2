<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\FoodGroupRequest;
use App\Models\FoodGroup;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;

class FoodGroupsController extends Controller
{
    private $fields = [
        'food_group' => [
            'id',
            'name',
            'slug',
            'description',
            'store_id',
            'created_at',
            'updated_at',
        ],
        'store' => [
            'id',
            'name',
            'address',
            'description',
            'user_id',
        ],
        'user' => [
            'id',
            'name',
            'email',
            'avatar',
        ],
    ];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($store_id, Request $request)
    {
        try {
            $query = $request->q;
            $food_groups = Store::find($store_id)->food_groups();

            if (isset($query)) {
                $food_groups = $food_groups
                    ->where('id', $query)
                    ->orWhere('name', 'like', '%' . $query . '%')
                    ->orWhere('slug', 'like', '%' . $query . '%');
            }

            $food_groups = $food_groups
                ->orderBy('created_at', 'desc')
                ->paginate($request->page_size ?? 5);

            return response()->json([
                'message' => 'Get food group successfully!',
                'data' => $food_groups->items(),
                'paging' => [
                    'current_page' => $food_groups->currentPage(),
                    'per_page' => $food_groups->perPage(),
                    'total' => $food_groups->total(),
                    'last_page' => $food_groups->lastPage(),
                ],
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid food group. Please try again!',
                'status' => 400,
            ], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FoodGroupRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        $food_group = FoodGroup::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'store_id' => $request->store_id,
        ]);

        return response()->json([
            'message' => 'Create new user successfully!',
            'data' => $food_group,
            'status' => 200,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($store_id, $food_group_id)
    {
        try {
            return response()->json([
                'message' => 'Get food group detail successfully!',
                'data' => FoodGroup::select($this->fields['food_group'])->where([
                    ['store_id', '=', $store_id],
                    ['id', '=', $food_group_id],
                ])->with(['store' => function ($query) {
                    $query->select($this->fields['store']);
                }])->firstOrFail(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid food group detail. Please try again!',
                'status' => 400,
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
    public function update(FoodGroupRequest $request, $store_id, $food_group_id)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        try {
            $food_group = FoodGroup::where([
                ['store_id', '=', $store_id],
                ['id', '=', $food_group_id],
            ])->firstOrFail();

            $food_group->name = $request->name;
            $food_group->slug = $request->slug;
            $food_group->description = $request->description;
            $food_group->store_id = $request->store_id;

            $food_group->save();

            return response()->json([
                'message' => 'Update food group detail successfully!',
                'data' => $food_group,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid food group detail. Please try again!',
                'status' => 400,
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($store_id, $food_group_id)
    {
        try {
            return response()->json([
                'message' => 'Delete food group successfully!',
                'data' => FoodGroup::where([
                    ['store_id', '=', $store_id],
                    ['id', '=', $food_group_id],
                ])->firstOrFail()->delete(),
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
        $food_groups = FoodGroup::select($this->fields['food_group'])->with(['store' => function ($query) {
            $query->select($this->fields['store'])->with(['user' => function ($query) {
                $query->select($this->fields['user']);
            }]);
        }])->orderBy('updated_at', 'desc')->paginate($request->page_size ?? 10);

        return response()->json([
            'message' => 'Get food group successfully!',
            'data' => $food_groups->items(),
            'paging' => [
                'current_page' => $food_groups->currentPage(),
                'per_page' => $food_groups->perPage(),
                'total' => $food_groups->total(),
                'last_page' => $food_groups->lastPage(),
            ],
            'status' => 200,
        ], 200);
    }
}
