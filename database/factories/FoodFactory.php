<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'slug' => $this->faker->slug(2, false),
            'description' => $this->faker->text(),
            'price' => $this->faker->randomNumber(6, true),
            'food_group_id' => $this->faker->numberBetween(11, 44),
        ];
    }
}
