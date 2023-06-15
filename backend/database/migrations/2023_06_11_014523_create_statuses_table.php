<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

<<<<<<<< HEAD:backend/database/migrations/2023_06_08_111852_create_vouchers_table.php
class CreateVouchersTable extends Migration
========
class CreateStatusesTable extends Migration
>>>>>>>> 5e2207dc609ec809220afdc2ac4182fc1fa661e2:backend/database/migrations/2023_06_11_014523_create_statuses_table.php
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
<<<<<<<< HEAD:backend/database/migrations/2023_06_08_111852_create_vouchers_table.php
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->integer('discount');
========
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('type');
>>>>>>>> 5e2207dc609ec809220afdc2ac4182fc1fa661e2:backend/database/migrations/2023_06_11_014523_create_statuses_table.php
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
<<<<<<<< HEAD:backend/database/migrations/2023_06_08_111852_create_vouchers_table.php
        Schema::dropIfExists('vouchers');
========
        Schema::dropIfExists('statuses');
>>>>>>>> 5e2207dc609ec809220afdc2ac4182fc1fa661e2:backend/database/migrations/2023_06_11_014523_create_statuses_table.php
    }
}
