<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AlumniProfile;
use App\Models\Korwil;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'korwils' => Korwil::all(), // Mengirim data korwil agar combo box tampil otomatis
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_lengkap'   => 'required|string|max:255',
            'email'          => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password'       => ['required', 'confirmed', Rules\Password::defaults()],
            'tempat_lahir'   => 'required|string|max:100',
            'tanggal_lahir'  => 'required|date',
            'no_hp'          => 'required|string|max:20',
            'alamat_lengkap' => 'required|string',
            'angkatan'       => 'required|digits:4',
            'tahun_keluar'   => 'required|digits:4',
            'korwil_id'      => 'required|exists:korwils,id',
        ]);

        // Generate ID unik otomatis berbasis Angkatan & Korwil (sama seperti di AlumniController)
        $duaDigitMasuk  = substr($request->angkatan, -2);
        $duaDigitKeluar = substr($request->tahun_keluar, -2);
        $duaDigitKorwil = str_pad($request->korwil_id, 2, '0', STR_PAD_LEFT);
        $prefix = $duaDigitMasuk . $duaDigitKeluar . $duaDigitKorwil;

        $lastAlumni = AlumniProfile::where('user_id', 'LIKE', $prefix . '%')
            ->orderBy('user_id', 'desc')
            ->first();

        $nextOrder = $lastAlumni ? str_pad(((int) substr($lastAlumni->user_id, -3)) + 1, 3, '0', STR_PAD_LEFT) : '001';
        $generatedUserId = $prefix . $nextOrder;

        $user = null;

        DB::transaction(function () use ($request, $generatedUserId, &$user) {
            // 1. Simpan ke tabel users dengan ID kustom
            $user = User::create([
                'id'             => $generatedUserId,
                'name'           => $request->nama_lengkap,
                'username'       => $generatedUserId,
                'email'          => $request->email,
                'password'       => Hash::make($request->password),
                'tempat_lahir'   => $request->tempat_lahir,
                'tanggal_lahir'  => $request->tanggal_lahir,
                'no_hp'          => $request->no_hp,
                'alamat_lengkap' => $request->alamat_lengkap,
            ]);

            // 2. Simpan ke tabel alumni_profiles
            AlumniProfile::create([
                'user_id'        => $generatedUserId,
                'username'       => $request->email,
                'password'       => Hash::make($request->password),
                'nama_lengkap'   => $request->nama_lengkap,
                'tempat_lahir'   => $request->tempat_lahir,
                'tanggal_lahir'  => $request->tanggal_lahir,
                'no_hp'          => $request->no_hp,
                'alamat_lengkap' => $request->alamat_lengkap,
                'angkatan'       => $request->angkatan,
                'tahun_keluar'   => $request->tahun_keluar,
                'korwil_id'      => $request->korwil_id,
            ]);
        });

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}