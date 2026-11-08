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
    Schema::table('alumni_profiles', function (Blueprint $table) {
        $table->string('tempat_lahir')->nullable()->after('nama_lengkap');
        $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
        // alamat_lengkap dan no_hp biasanya sudah ada dari langkah sebelumnya, 
        // jika belum ada, tambahkan di sini.
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            //
        });
    }
};
