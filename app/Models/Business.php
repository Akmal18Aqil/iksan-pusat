<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'judul', 'isi', 'image'];

    // Relasi otomatis untuk mengambil data nama alumni yang memposting usaha
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}