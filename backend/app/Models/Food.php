<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'avatar',
        'description',
        'price',
        'discount',
        'food_group_id',
    ];

    public function food_group()
    {
        return $this->belongsTo(FoodGroup::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
