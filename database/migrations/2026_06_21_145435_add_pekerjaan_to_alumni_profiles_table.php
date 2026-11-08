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
        Schema::table('alumni_profiles', function (Blueprint $table) {
            // 💡 Cek dulu, jika kolom pekerjaan BELUM ada, baru buat. Jika SUDAH ada, lewati (skip).
            if (!Schema::hasColumn('alumni_profiles', 'pekerjaan')) {
                $table->string('pekerjaan', 150)->nullable()->after('korwil_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('alumni_profiles', 'pekerjaan')) {
                $table->dropColumn('pekerjaan');
            }
        });
    }
};