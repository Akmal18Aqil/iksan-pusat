<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relasi ke pembuat (alumni/admin)
            $table->string('judul'); // Nama Usaha / Produk
            $table->text('isi'); // Deskripsi lengkap (HTML dari Rich Text Editor)
            $table->string('image')->nullable(); // Foto/Brosur produk
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};