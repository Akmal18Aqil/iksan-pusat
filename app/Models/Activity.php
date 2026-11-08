<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi
    protected $fillable = ['judul', 'deskripsi', 'kategori', 'media_url', 'user_id'];

    // Relasi ke User (Penulis/Admin)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}