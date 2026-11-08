<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Mengambil user beserta relasi profile alumni-nya (eager loading)
        $users = User::with('alumniProfile:user_id,nama_lengkap,alamat_lengkap')
                    ->paginate(10);

        return Inertia::render('User/Index', [
            'users' => $users
        ]);
    }

    public function updatePassword(Request $request, User $user)
    {
        // Validasi wajib kombinasi huruf dan angka (menggunakan alpha_num / regex)
        $request->validate([
            'password' => [
                'required', 
                'confirmed', 
                'min:8',
                'regex:/[a-zA-Z]/', // Harus ada huruf
                'regex:/[0-9]/',    // Harus ada angka
            ],
        ], [
            'password.regex' => 'Password wajib menggunakan kombinasi angka dan huruf.',
            'password.min' => 'Password minimal berjumlah 8 karakter.'
        ]);

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return redirect()->back()->with('message', 'Password user berhasil diperbarui dengan kombinasi yang aman!');
    }
}