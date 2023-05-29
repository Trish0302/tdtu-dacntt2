<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CustomerFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' =>$this->faker->unique()->safeEmail(),
            'address' => $this->faker->text(),
            'phone' => $this->faker->phoneNumber,
        ];
    }
}
