<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kajian extends Model
{
    use HasFactory;

    /**
     * Kolom yang diizinkan untuk diisi (Mass Assignment).
     *
     * @var array<int, string>
     */
    protected $fillable = [
    'judul',
    'isi',
    'user_id',
    'image', 
];

    /**
     * Relasi ke model User.
     * Menjelaskan bahwa setiap satu postingan Kajian dimiliki oleh satu User (Penulis).
     * 
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}