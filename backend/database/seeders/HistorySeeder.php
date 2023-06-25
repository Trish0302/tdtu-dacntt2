<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('histories')->insert([
            [
                'status_id' => 0,
                'transaction_id' => 0,
                'delivery_id' => 0,
                'message' => 'Order was placed successfully.',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            ],
            [
                'status_id' => 0,
                'transaction_id' => 3,
                'delivery_id' => 0,
                'message' => 'Order was paid successfully.',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            ],
            [
                'status_id' => 0,
                'transaction_id' => 2,
                'delivery_id' => 0,
                'message' => 'Order was paid unsuccessfully.',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            ],
        ]);
    }
}
