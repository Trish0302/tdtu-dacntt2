<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Http\Requests\RegisterUserRequest;
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

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successfully!',
            'status' => 200,
        ], 200);
    }
}
