<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dzikir extends Model
{
   protected $fillable = ['judul', 'isi', 'image', 'user_id'];

public function user() {
    return $this->belongsTo(User::class);
}
}
