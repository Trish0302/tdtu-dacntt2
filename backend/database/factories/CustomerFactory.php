<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class CustomerFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make(12345678),
            'avatar' => 'https://res.cloudinary.com/ddusqwv7k/image/upload/v1688648527/users/default-avatar_1688648526.png',
            'address' => $this->faker->text(),
            'phone' => $this->faker->phoneNumber,
        ];
    }
}
