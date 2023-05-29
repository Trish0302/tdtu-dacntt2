<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Ramsey\Uuid\Type\Integer;

class OrderFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'total' => $this->faker->numberBetween(50000, 2000000),
            'address' => $this->faker->text(),
            'phone' => $this->faker->phoneNumber,
            'customer_id' => $this->faker->numberBetween(1, 8),
        ];
    }
}
