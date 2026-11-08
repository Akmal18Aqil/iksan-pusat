<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
    Schema::create('alumni_profiles', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('korwil_id')->nullable()->constrained();
        $table->string('nama_lengkap');
        $table->string('angkatan', 4);
        $table->string('no_hp')->nullable();
        $table->text('alamat_lengkap');
        // Fitur 4: Mapping Alamat
        $table->decimal('latitude', 10, 8)->nullable();
        $table->decimal('longitude', 11, 8)->nullable();
        $table->string('pekerjaan')->nullable();
        $table->string('foto')->nullable(); // Untuk Cetak KTA
        $table->string('nomor_kta')->unique()->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_profiles');
    }
};
