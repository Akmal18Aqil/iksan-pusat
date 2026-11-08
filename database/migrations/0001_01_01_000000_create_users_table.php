<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        // Karena aplikasi Anda pakai ID manual (seperti 960001001), gunakan ini:
        $table->unsignedBigInteger('id')->primary(); 
        
        $table->string('name');
        $table->string('username')->unique(); 
        $table->string('email')->unique();
        $table->string('password');
        
        // Kolom tambahan yang muncul di error sebelumnya
        $table->string('tempat_lahir')->nullable();
        $table->date('tanggal_lahir')->nullable();
        $table->string('no_hp')->nullable();
        $table->text('alamat_lengkap')->nullable();
        
        $table->rememberToken();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
