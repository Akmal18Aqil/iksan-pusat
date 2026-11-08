<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            // 1. Tambahkan kolom username dan password jika belum ada
            if (!Schema::hasColumn('alumni_profiles', 'username')) {
                $table->string('username')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('alumni_profiles', 'password')) {
                $table->string('password')->nullable()->after('username');
            }

            // 💡 TAMBAHKAN KOLOM TAHUN_KELUAR DI SINI (Nullable dulu agar aman)
            if (!Schema::hasColumn('alumni_profiles', 'tahun_keluar')) {
                $table->string('tahun_keluar', 4)->nullable()->after('angkatan');
            }
        });

        // 2. Isi data username alumni yang sudah terlanjur ada di database
        DB::table('alumni_profiles')->whereNull('username')->orWhere('username', '')->get()->each(function ($alumni) {
            DB::table('alumni_profiles')
                ->where('id', $alumni->id)
                ->update([
                    'username' => $alumni->user_id . '@gmail.com',
                    'password' => bcrypt('password123')
                ]);
        });

        // 3. Set kolom username menjadi UNIQUE
        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->string('username')->change()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->dropColumn(['username', 'password', 'tahun_keluar']);
        });
    }
};