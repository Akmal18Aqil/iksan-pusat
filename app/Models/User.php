<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * 💡 NON-AKTIFKAN AUTO INCREMENT
     * Karena ID user diisi manual menggunakan rumus formula user_id alumni
     */
    public $incrementing = false;

    /**
     * 💡 SET TIPE DATA ID SEBAGAI STRING
     * Agar menampung kombinasi digit angka formula yang panjang dengan aman
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    
    protected $fillable = [
    'id', 
    'name',
    'username', // 👈 PASTIKAN INI SUDAH ADA DI SINI JUGA
    'email',
    'password',
    'tempat_lahir',   
    'tanggal_lahir',  
    'no_hp',          
    'alamat_lengkap', 
];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
public function alumniProfile()
{
    return $this->hasOne(AlumniProfile::class, 'user_id', 'id');
}

    }