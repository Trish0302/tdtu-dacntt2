<?php

namespace App\Models;

use App\Http\Controllers\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'history_id',
    ];


    public function order()
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

    public function history()
    {
        return $this->belongsTo(History::class);
    }
}
