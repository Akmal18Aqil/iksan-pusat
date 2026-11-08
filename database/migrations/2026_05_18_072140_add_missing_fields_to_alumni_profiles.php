<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            // Kita tambahkan semua kolom yang mungkin belum ada
            if (!Schema::hasColumn('alumni_profiles', 'tempat_lahir')) {
                $table->string('tempat_lahir')->nullable()->after('nama_lengkap');
            }
            if (!Schema::hasColumn('alumni_profiles', 'tanggal_lahir')) {
                $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            }
            if (!Schema::hasColumn('alumni_profiles', 'no_hp')) {
                $table->string('no_hp')->nullable()->after('tanggal_lahir');
            }
            if (!Schema::hasColumn('alumni_profiles', 'alamat_lengkap')) {
                $table->text('alamat_lengkap')->nullable()->after('no_hp');
            }
        });
    }

    public function down(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->dropColumn(['tempat_lahir', 'tanggal_lahir', 'no_hp', 'alamat_lengkap']);
        });
    }
};