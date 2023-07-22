<?php

use App\Http\Controllers\API\CustomersController;
use App\Http\Controllers\API\FoodController;
use App\Http\Controllers\API\FoodGroupsController;
use App\Http\Controllers\API\payment\PaymentController;
use App\Http\Controllers\API\StoresController;
use App\Http\Controllers\API\VouchersController;
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

Route::middleware('auth:sanctum', 'ability:admin,customer')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/password', [AuthController::class, 'update_password']);
    Route::get('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum', 'ability:admin')->group(function () {
    Route::get('/orders/history', [OrdersController::class, 'viewHistory']);

    Route::apiResources([
        'users' => UsersController::class,
        'orders' => OrdersController::class,
        'vouchers' => VouchersController::class,
        'customers' => CustomersController::class,
    ]);

    Route::apiResources(
        [
            'stores' => StoresController::class,
            'stores.food_groups.food' => FoodController::class,
            'stores.food_groups' => FoodGroupsController::class,
        ],
        ['except' => ['index', 'show']],
    );

    Route::apiResources(
        [
            'stores' => StoresController::class,
            'stores.food_groups.food' => FoodController::class,
            'stores.food_groups' => FoodGroupsController::class,
        ],
        ['except' => ['index', 'show']],
    );
});

Route::middleware('auth:sanctum', 'ability:customer')->group(function () {
    Route::get('/test_customer', function () {
        return 'hello';
    });
});

Route::post('/login', [AuthController::class, 'login']);

// Payment response
Route::get('/payment/respond', [PaymentController::class, 'respond']);

