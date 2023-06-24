<?php

use App\Http\Controllers\API\FoodController;
use App\Http\Controllers\API\FoodGroupsController;
use App\Http\Controllers\API\payment\PaymentController;
use App\Http\Controllers\API\StoresController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrdersController;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/orders/history', [OrdersController::class, 'viewHistory']);
    Route::apiResources([
        'users' => UsersController::class,
        'stores' => StoresController::class,
        'stores.food_groups' => FoodGroupsController::class,
        'stores.food_groups.food' => FoodController::class,
        'orders' => OrdersController::class,
    ]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Payment response
Route::get('/payment/respond', [PaymentController::class, 'respond']);
