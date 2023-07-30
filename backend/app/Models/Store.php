<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'avatar',
        'address',
        'description',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function food_groups()
    {
        return $this->hasMany(FoodGroup::class);
    }

    public function food()
    {
        return $this->hasManyThrough(Food::class, FoodGroup::class);
    }
}
