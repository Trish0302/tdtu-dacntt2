<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Models\Customer;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if ($request->type == 'admin') {
            $user = User::where('email', $request->email)->first();
            $abilities = ['admin'];
        } else if ($request->type == 'customer') {
            $user = Customer::where('email', $request->email)->first();
            $abilities = ['customer'];
        }

        if (!$user) {
            return response()->json([
                'message' => 'Please re-check your email!',
                'status' => 401,
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Please re-check your password!',
                'status' => 401,
            ], 401);
        }

        if (!$user->email_verified_at && $abilities == ['admin']) {
            return response()->json([
                'message' => 'Your account has not been approved by administrator!',
                'data' => false,
                'status' => 401,
            ], 401);
        }

        $token = $user->createToken('auth_token', $abilities)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'message' => 'Login successfully!',
            'email' => $user->email,
            'status' => 200,
        ], 200);
    }

    public function user(Request $request)
    {
        return $request->user();
    }

    public function update_password(PasswordRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        try {
            $request->user()->update([
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'message' => 'Update user password successfully!',
                'data' => true,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid user. Please try again!',
                'status' => 400,
            ], 400);
        }
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successfully!',
            'status' => 200,
        ], 200);
    }
}
