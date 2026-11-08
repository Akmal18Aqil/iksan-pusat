<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AlumniProfile; // 💡 Wajib diimpor agar relasi tidak error Class not found

class Korwil extends Model
{
    use HasFactory;

    /**
     * Menonaktifkan fitur Auto Increment karena ID akan diinput manual (2 Digit).
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Menentukan tipe data Primary Key jika bukan integer auto-increment standar.
     *
     * @var string
     */
    protected $keyType = 'int';

    /**
     * Kolom yang diizinkan untuk diisi secara massal (Mass Assignment).
     * Kolom 'id' wajib dimasukkan agar sistem mengizinkan input ID kustom dari frontend.
     *
     * @var array
     */
    protected $fillable = [
        'id', 
        'nama_korwil', 
        'wilayah'
    ];

    /**
     * Relasi ke data alumni.
     */
    public function alumni()
    {
        return $this->hasMany(AlumniProfile::class, 'korwil_id');
    }
}