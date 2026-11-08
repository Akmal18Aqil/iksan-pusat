<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlumniProfile extends Model
{
    use HasFactory;

    protected $table = 'alumni_profiles';

    protected $guarded = ['id'];

    public function korwil()
    {
        return $this->belongsTo(Korwil::class, 'korwil_id');
    }
}