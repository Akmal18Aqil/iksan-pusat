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
        Schema::table('users', function (Blueprint $table) {
            // Cek dan tambahkan kolom 'tempat_lahir' jika belum ada
            if (!Schema::hasColumn('users', 'tempat_lahir')) {
                $table->string('tempat_lahir', 100)->nullable()->after('password');
            }

            // Cek dan tambahkan kolom 'tanggal_lahir' jika belum ada
            if (!Schema::hasColumn('users', 'tanggal_lahir')) {
                $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            }

            // Cek dan tambahkan kolom 'no_hp' jika belum ada
            if (!Schema::hasColumn('users', 'no_hp')) {
                $table->string('no_hp', 20)->nullable()->after('tanggal_lahir');
            }

            // Cek dan tambahkan kolom 'alamat_lengkap' jika belum ada
            if (!Schema::hasColumn('users', 'alamat_lengkap')) {
                $table->text('alamat_lengkap')->nullable()->after('no_hp');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop kolom jika kolom tersebut ada saat rollback
            $columnsToDrop = [];

            if (Schema::hasColumn('users', 'tempat_lahir')) {
                $columnsToDrop[] = 'tempat_lahir';
            }
            if (Schema::hasColumn('users', 'tanggal_lahir')) {
                $columnsToDrop[] = 'tanggal_lahir';
            }
            if (Schema::hasColumn('users', 'no_hp')) {
                $columnsToDrop[] = 'no_hp';
            }
            if (Schema::hasColumn('users', 'alamat_lengkap')) {
                $columnsToDrop[] = 'alamat_lengkap';
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};