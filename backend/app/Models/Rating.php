<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'food_id',
        'rating',
    ];

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
