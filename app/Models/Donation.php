<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_donatur', 
        'nominal', 
        'tanggal', 
        'jenis', // 'masuk' atau 'keluar'
        'keterangan'
    ];
}