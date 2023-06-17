<?php

namespace App\Models;

use App\Http\Controllers\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;
    protected $table = 'order_history';
    protected $fillable = [
        'order_id',
        'status_id',
        'transaction_id',
        'delivery_id',
    ];


    public function _order()
    {
        return $this->belongsTo(Order::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }
}
