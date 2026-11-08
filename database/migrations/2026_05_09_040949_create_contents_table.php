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
    Schema::create('contents', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->text('isi');
        $table->string('thumbnail')->nullable();
        // Enum untuk membedakan jenis konten
        $table->enum('kategori', ['kajian', 'artikel_alumni', 'dzikir_doa', 'ad_art', 'peraturan_organisasi']);
        $table->foreignId('author_id')->constrained('users');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
