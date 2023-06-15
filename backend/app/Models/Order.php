<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'total',
        'address',
        'phone',
        'customer_id',
        'store_id',
        'voucher_id',
        'payment_type',
        'transaction_code',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
