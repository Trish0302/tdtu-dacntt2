<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    private $fields = [
        'id',
        'name',
        'email',
        'phone',
        'avatar',
        'created_at',
        'updated_at',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')
            ->paginate($request->page_size ?? 10, $this->fields);

        return $users;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RegisterUserRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'avatar' => $request->avatar ?? 'default-avatar.png',
            'password' => Hash::make($request->password),
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
                'message' => 'Get user data successfully!',
                'data' => User::findOrFail($id, $this->fields),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid user. Please try again!',
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
    public function update(RegisterUserRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        try {
            $user = User::findOrFail($request->id, $this->fields);

            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->password = Hash::make($request->password);

            if ($request->avatar) {
                $user->avatar = $request->avatar;
            }

            $user->save();

            return response()->json([
                'message' => 'Update user successfully!',
                'data' => $user,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid user. Please try again!',
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
                'message' => 'Delete user successfully!',
                'data' => User::findOrFail($id)->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid user. Please try again!',
                'status' => 400,
            ], 400);
        }
    }
}