<?php

use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\PayPalController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

Route::get('/', [PaymentController::class, 'atm']);
Route::get('/vnpay-payment', [\App\Http\Controllers\API\PaymentVNPAYController::class, 'payment']);
Route::get('/send-mail', function (Request $request) {
    Mail::send('emails.test', ['name' => 'test name for email'], function ($email) {
        $email->to('letri03022001@gmail.com', 'xin chào việt nam')->subject('test mail');
    });
    return $request;
});

//paypal api
Route::get('paypal-create-transaction', [PayPalController::class, 'createTransaction'])->name('createTransaction');
Route::get('process-transaction', [PayPalController::class, 'processTransaction'])->name('processTransaction');
Route::get('success-transaction', [PayPalController::class, 'successTransaction'])->name('successTransaction');
Route::get('cancel-transaction', [PayPalController::class, 'cancelTransaction'])->name('cancelTransaction');
