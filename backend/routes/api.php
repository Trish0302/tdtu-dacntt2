<?php

use App\Http\Controllers\API\CustomersController;
use App\Http\Controllers\API\FoodController;
use App\Http\Controllers\API\FoodGroupsController;
use App\Http\Controllers\API\payment\PaymentController;
use App\Http\Controllers\API\StoresController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrdersController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum', 'ability:admin')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/orders/history', [OrdersController::class, 'viewHistory']);
    Route::apiResources([
        'users' => UsersController::class,
        'stores' => StoresController::class,
        'stores.food_groups' => FoodGroupsController::class,
        'stores.food_groups.food' => FoodController::class,
        'orders' => OrdersController::class,
        'customers' => CustomersController::class,
    ]);
});

Route::middleware('auth:sanctum', 'ability:customer')->group(function () {
    Route::get('/current_customer', function () {
        return Auth::user();
    });

    Route::delete('/current_customer', function () {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successfully!',
            'status' => 200,
        ], 200);
    });
});


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Payment response
Route::get('/payment/respond', [PaymentController::class, 'respond']);
