<?php

use App\Http\Controllers\API\payment\MOMOController;
use App\Http\Controllers\API\payment\VNPAYController;
use App\Http\Controllers\API\PayPalController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Payment
Route::get('/payment/vnpay', [VNPAYController::class, 'payment']);

Route::get('/payment/momo', [MOMOController::class, 'atm']);
Route::get('/test', function (Request $request) {
    return $request;
});

// Paypal
Route::get('paypal-create-transaction', [PayPalController::class, 'createTransaction'])->name('createTransaction');
Route::get('process-transaction', [PayPalController::class, 'processTransaction'])->name('processTransaction');
Route::get('success-transaction', [PayPalController::class, 'successTransaction'])->name('successTransaction');
Route::get('cancel-transaction', [PayPalController::class, 'cancelTransaction'])->name('cancelTransaction');
