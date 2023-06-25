<?php

namespace Database\Seeders;

use App\Models\Food;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            UserSeeder::class,
            FoodGroupSeeder::class,
            StoreSeeder::class,
            CustomerSeeder::class,
            FoodSeeder::class,
            StatusSeeder::class,
            VoucherSeeder::class,
            TransactionSeeder::class,
            DeliverySeeder::class,
            HistorySeeder::class,
            OrderSeeder::class,
        ]);
    }
}
