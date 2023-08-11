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

    public function detail()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function histories()
    {
        return $this->hasMany(OrderHistory::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
