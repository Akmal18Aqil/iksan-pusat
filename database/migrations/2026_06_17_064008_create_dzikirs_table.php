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
    Schema::create('dzikirs', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->longText('isi'); // Untuk teks Arab & gambar Base64
        $table->string('image')->nullable(); // Thumbnail cover
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dzikirs');
    }
};
