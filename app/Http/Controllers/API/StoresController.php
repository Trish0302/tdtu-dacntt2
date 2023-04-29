<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequest;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;

class StoresController extends Controller
{
    private $user_fields = [
        'id',
        'name',
        'email',
        'phone',
        'avatar',
        'created_at',
        'updated_at',
    ];

    private $store_fields = [
        'id',
        'name',
        'address',
        'description',
        'user_id',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $stores = Store::select($this->store_fields)->with(['user' => function ($query) {
            $query->select($this->user_fields);
        }])->orderBy('created_at', 'desc')->paginate($request->page_size ?? 10);

        return $stores;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        Store::create([
            'name' => $request->name,
            'address' => $request->address,
            'description' => $request->description,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Create new user successfully!',
            'status' => 200,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            return response()->json([
                'message' => 'Get store data successfully!',
                'data' => Store::with('user')->find($id),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid store. Please try again!',
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
    public function update(StoreRequest $request, $id)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        try {
            $store = Store::findOrFail($request->id, $this->store_fields);

            $store->name = $request->name;
            $store->address = $request->address;
            $store->description = $request->description;
            $store->user_id = $request->user_id;

            $store->save();

            return response()->json([
                'message' => 'Update store successfully!',
                'data' => $store,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid store. Please try again!',
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
    public function destroy($id)
    {
        try {
            return response()->json([
                'message' => 'Delete store successfully!',
                'data' => Store::findOrFail($id)->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid store. Please try again!',
                'status' => 400,
            ], 400);
        }
    }
}
