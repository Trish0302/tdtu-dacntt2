<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

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

        Mail::send('emails.registerUserSuccessfully', [
            'name' => $user->name,
            'avatar' => $user->avatar,
        ], function ($email) use ($user) {
            $email->to($user->email)->subject('Register new user successfully!');
        });

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
