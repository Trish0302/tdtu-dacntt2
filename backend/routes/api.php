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
use App\Http\Controllers\RatingController;
use App\Http\Controllers\StatisticController;

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

    Route::apiResources(
        [
            'orders' => OrdersController::class
        ],
        ['except' => ['update', 'destroy']],
    );

    Route::put('/customers/{id}', [CustomersController::class, 'update']);
});

Route::middleware('auth:sanctum', 'ability:admin')->group(function () {
    Route::get('/orders/history', [OrdersController::class, 'viewHistory']);

    Route::apiResources([
        'users' => UsersController::class,
        'vouchers' => VouchersController::class,
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
            'orders' => OrdersController::class
        ],
        ['except' => ['index', 'store', 'show']],
    );

    Route::apiResources(
        [
            'customers' => CustomersController::class,
        ],
        ['except' => ['update']],
    );

    Route::get('/statistics/get-total/{type}', [StatisticController::class, 'getTotal']);
    Route::get('/statistics/get-recent-order-progresses', [StatisticController::class, 'getRecentOrderProgresses']);
});

Route::middleware('auth:sanctum', 'ability:customer')->group(function () {
    Route::get('/get-voucher-by-code/{voucher_code}', [VouchersController::class, 'getVoucherByCode']);
    Route::get('/get-ratings-for-customer/{customer_id}', [RatingController::class, 'getRatingsForCustomer']);
    Route::post('/ratings', [RatingController::class, 'addRatingForCustomer']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::get('/stores', [StoresController::class, 'index']);
Route::get('/stores/{store_id}', [StoresController::class, 'show']);

Route::get('/food-groups', [FoodGroupsController::class, 'getAll']);
Route::get('/stores/{store_id}/food_groups', [FoodGroupsController::class, 'index']);
Route::get('/stores/{store_id}/food_groups/{food_group_id}', [FoodGroupsController::class, 'show']);

Route::get('/food', [FoodController::class, 'getAll']);
Route::get('/stores/{store_id}/food_groups/{food_group_id}/food', [FoodController::class, 'index']);
Route::get('/stores/{store_id}/food_groups/{food_group_id}/food/{food_id}', [FoodController::class, 'show']);
Route::get('/food/{id}', [FoodController::class, 'getDetail']);

Route::post('/register', [CustomersController::class, 'store']);

// Payment response
Route::get('/payment/respond', [PaymentController::class, 'respond'])->name('paymentRespond');;
