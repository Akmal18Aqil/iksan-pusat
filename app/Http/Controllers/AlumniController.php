<?php

namespace App\Http\Controllers;

use App\Models\AlumniProfile;
use App\Models\Korwil;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class AlumniController extends Controller
{
    /**
     * Menampilkan daftar alumni dengan filter & pagination
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $korwil_id = $request->input('korwil_id');

        $alumni = AlumniProfile::with('korwil')
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%");
            })
            ->when($korwil_id, function ($query, $korwil_id) {
                $query->where('korwil_id', $korwil_id);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Alumni/Index', [
            'alumni' => $alumni,
            'korwils' => Korwil::all(),
            'filters' => $request->only(['search', 'korwil_id'])
        ]);
    }

    /**
     * Simpan Alumni Baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap'   => 'required|string|max:255',
            'tempat_lahir'   => 'required|string|max:100',
            'tanggal_lahir'  => 'required|date',
            'no_hp'          => 'required|string|max:20',
            'alamat_lengkap' => 'required|string',
            'angkatan'       => 'required|digits:4', 
            'tahun_keluar'   => 'required|digits:4',
            'korwil_id'      => 'required|exists:korwils,id',
            'pekerjaan'      => 'nullable|string|max:255',
            'foto'           => 'nullable|image|max:3072', 
            'location_url'   => 'nullable|string',
            'latitude'       => 'nullable|string',
            'longitude'      => 'nullable|string',
        ]);

        $duaDigitMasuk  = substr($request->angkatan, -2);
        $duaDigitKeluar = substr($request->tahun_keluar, -2);
        $duaDigitKorwil = str_pad($request->korwil_id, 2, '0', STR_PAD_LEFT);
        $prefix = $duaDigitMasuk . $duaDigitKeluar . $duaDigitKorwil;

        $lastAlumni = AlumniProfile::where('user_id', 'LIKE', $prefix . '%')
            ->orderBy('user_id', 'desc')
            ->first();

        $nextOrder = $lastAlumni ? str_pad(((int) substr($lastAlumni->user_id, -3)) + 1, 3, '0', STR_PAD_LEFT) : '001';
        $generatedUserId = $prefix . $nextOrder; 

        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');

        $photoPath = null;
        if ($request->hasFile('foto')) {
            $photoPath = $this->uploadAndCrop($request->file('foto'));
        }

        DB::transaction(function () use ($generatedUserId, $request, $latitude, $longitude, $photoPath) {
            User::create([
                'id'             => $generatedUserId, 
                'name'           => $request->nama_lengkap,
                'username'       => $generatedUserId, 
                'email'          => $generatedUserId . '@gmail.com',
                'password'       => bcrypt('password123'),
                'tempat_lahir'   => $request->tempat_lahir,
                'tanggal_lahir'  => $request->tanggal_lahir,
                'no_hp'          => $request->no_hp,
                'alamat_lengkap' => $request->alamat_lengkap,
            ]);

            AlumniProfile::create([
                'user_id'        => $generatedUserId, 
                'username'       => $generatedUserId . '@gmail.com',
                'password'       => bcrypt('password123'),
                'nama_lengkap'   => $request->nama_lengkap,
                'tempat_lahir'   => $request->tempat_lahir,
                'tanggal_lahir'  => $request->tanggal_lahir,
                'no_hp'          => $request->no_hp,
                'alamat_lengkap' => $request->alamat_lengkap,
                'angkatan'       => $request->angkatan,
                'tahun_keluar'   => $request->tahun_keluar,
                'pekerjaan'      => $request->pekerjaan,
                'foto'           => $photoPath,
                'location_url'   => $request->location_url,
                'latitude'       => $latitude,
                'longitude'      => $longitude,
                'korwil_id'      => $request->korwil_id,
            ]);
        });

        return redirect()->back()->with('message', 'Registrasi Anggota Alumni Baru Berhasil Ditambahkan!');
    }

    /**
     * Update Data Alumni
     */
    public function update(Request $request, $id)
    {
        $alumni = AlumniProfile::findOrFail($id);
        
        $request->validate([
            'nama_lengkap'   => 'required|string|max:255',
            'tempat_lahir'   => 'required|string|max:100',
            'tanggal_lahir'  => 'required|date',
            'no_hp'          => 'required|string|max:20',
            'alamat_lengkap' => 'required|string',
            'angkatan'       => 'required|digits:4',
            'tahun_keluar'   => 'required|digits:4',
            'korwil_id'      => 'required|exists:korwils,id',
            'pekerjaan'      => 'nullable|string|max:255',
            'foto'           => 'nullable|image|max:3072',
            'location_url'   => 'nullable|string',
            'latitude'       => 'nullable|string',
            'longitude'      => 'nullable|string',
        ]);

        $data = $request->except(['foto']);

        $data['latitude'] = $request->input('latitude');
        $data['longitude'] = $request->input('longitude');
        $data['location_url'] = $request->input('location_url');

        if ($request->hasFile('foto')) {
            if ($alumni->foto && Storage::disk('public')->exists($alumni->foto)) {
                Storage::disk('public')->delete($alumni->foto);
            }
            $data['foto'] = $this->uploadAndCrop($request->file('foto'));
        }

        DB::transaction(function () use ($alumni, $request, $data) {
            User::where('id', $alumni->user_id)->update([
                'name'           => $request->nama_lengkap,
                'tempat_lahir'   => $request->tempat_lahir,
                'tanggal_lahir'  => $request->tanggal_lahir,
                'no_hp'          => $request->no_hp,
                'alamat_lengkap' => $request->alamat_lengkap,
            ]);

            $alumni->update($data);
        });

        return redirect()->back()->with('message', 'Data alumni berhasil diperbarui!');
    }

    /**
     * Hapus Data Alumni
     */
    public function destroy($id)
    {
        $alumni = AlumniProfile::findOrFail($id);
        
        DB::transaction(function () use ($alumni) {
            if ($alumni->foto && Storage::disk('public')->exists($alumni->foto)) {
                Storage::disk('public')->delete($alumni->foto);
            }
            $alumni->delete();
            User::where('id', $alumni->user_id)->delete();
        });

        return redirect()->back()->with('message', 'Data berhasil dihapus!');
    }

    /**
     * Tampilan Peta Geografis Alumni
     */
    public function map()
    {
        $alumni = AlumniProfile::get(); 

        return Inertia::render('Alumni/AlumniMap', [
            'alumni' => $alumni
        ]);
    }

    /**
     * HELPER: Auto Crop Foto 3:4
     */
    private function uploadAndCrop($file)
    {
        $name = time() . '.jpg';
        $img = Image::read($file);
        $img->cover(600, 800); 
        
        $path = 'alumni_photos/' . $name;
        Storage::disk('public')->put($path, (string) $img->encodeByExtension('jpg'));
        
        return $path;
    }
}