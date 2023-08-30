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
        'role_id',
        'email_verified_at',
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
        $this->authorize('viewAny', new User);

        $query = $request->q;
        $users = new User;

        if (isset($query)) {
            $users = $users
                ->where('name', 'like', '%' . $query . '%')
                ->orWhere('email', 'like', '%' . $query . '%')
                ->orWhere('phone', $query)
                ->orWhere('id', $query);
        }

        $users = $users->orderBy('created_at', 'desc')
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
        if ($request->hasFile('avatar')) {
            $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
            $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

            $result = $request->file('avatar')->storeOnCloudinaryAs('users', $avatar_name);
            $avatar = $result->getSecurePath();
        } else {
            $avatar = 'https://res.cloudinary.com/ddusqwv7k/image/upload/v1688648527/users/default-avatar_1688648526.png';
        }

        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'avatar' => $avatar,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Request new account successfully. Please await administrator to approve!',
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
            $user = User::findOrFail($id, $this->fields);

            $this->authorize('view', $user);

            return response()->json([
                'message' => 'Get user data successfully!',
                'data' => $user,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
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
        try {
            $user = User::findOrFail($request->id, $this->fields);
            $this->authorize('update', $user);

            if (isset($request->validator) && $request->validator->fails()) {
                return response()->json([
                    'message' => $request->validator->messages(),
                    'status' => 400,
                ], 400);
            }

            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;

            if ($request->hasFile('avatar')) {
                $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
                $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

                $result = $request->file('avatar')->storeOnCloudinaryAs('users', $avatar_name);
                $user->avatar = $result->getSecurePath();
            }

            $user->save();

            return response()->json([
                'message' => 'Update user information successfully!',
                'data' => $user,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
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
            $user = User::findOrFail($id);
            $this->authorize('delete', $user);

            return response()->json([
                'message' => 'Delete user successfully!',
                'data' => $user->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => 400,
            ], 400);
        }
    }

    public function approve($id)
    {
        $this->authorize('create', new User);

        try {
            $user = User::findOrFail($id, $this->fields);

            if ($user->email_verified_at) {
                return response()->json([
                    'message' => 'This account was approved already!',
                    'data' => false,
                    'status' => 401,
                ], 401);
            }

            $user->markEmailAsVerified();

            return response()->json([
                'message' => 'Approve store manager account successfully!',
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
}
