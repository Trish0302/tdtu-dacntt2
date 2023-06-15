<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code' => $this->faker->lexify(),
            'discount' => $this->faker->numberBetween(1, 100),
        ];
    }
}
