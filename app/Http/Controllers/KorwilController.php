<?php

namespace App\Http\Controllers;

use App\Models\Korwil;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KorwilController extends Controller
{
    public function index()
    {
        return Inertia::render('Korwil/Index', [
            // Mengambil semua data korwil, diurutkan dari ID terkecil, dan menghitung jumlah alumninya
            'korwils' => Korwil::withCount('alumni')->orderBy('id', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        // Validasi ketat untuk ID Kustom 2 Digit
        $request->validate([
            'id'          => 'required|integer|digits_between:1,2|unique:korwils,id',
            'nama_korwil' => 'required|string|max:255',
            'wilayah'     => 'required|string|max:255',
        ], [
            // Pesan error kustom bahasa Indonesia agar user ramah membacanya
            'id.required'       => 'ID Korwil wajib diisi.',
            'id.digits_between' => 'ID Korwil harus berupa angka 1 sampai 2 digit.',
            'id.unique'         => 'ID Korwil ini sudah digunakan oleh daerah lain.',
        ]);

        Korwil::create($request->all());
        
        return redirect()->back()->with('message', 'Korwil baru berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
{
    // 1. Cari data korwil asli berdasarkan ID lama yang dikirim dari React (editId)
    $korwil = Korwil::findOrFail($id);

    // 2. Validasi data inputan
    $request->validate([
        // Abaikan validasi unique jika ID kustomnya ternyata tidak diganti
        'id'          => 'required|integer|digits_between:1,2|unique:korwils,id,' . $korwil->id,
        'nama_korwil' => 'required|string|max:255',
        'wilayah'     => 'required|string|max:255',
    ], [
        'id.unique'   => 'ID Baru ini sudah digunakan oleh daerah korwil lain.',
    ]);

    // 3. JIKA ADMIN MENGUBAH ID KUSTOM
    if ($korwil->id != $request->id) {
        // Cek apakah korwil ini masih memiliki alumni yang nempel di database
        $korwil->loadCount('alumni');
        if ($korwil->alumni_count > 0) {
            return redirect()->back()->with('message', 'Gagal: ID tidak boleh diubah karena ada ' . $korwil->alumni_count . ' alumni yang terikat pada ID Korwil ini.');
        }

        // 💡 TRICK UTAMA: Karena ID adalah Primary Key, kita harus memaksa update lewat query builder langsung
        \Illuminate\Support\Facades\DB::table('korwils')
            ->where('id', $korwil->id)
            ->update([
                'id'          => $request->id,
                'nama_korwil' => $request->nama_korwil,
                'wilayah'     => $request->wilayah,
                'updated_at'  => now()
            ]);
    } else {
        // Jika ID tidak diganti, jalankan update Eloquent standar seperti biasa
        $korwil->update($request->only(['nama_korwil', 'wilayah']));
    }
    
    return redirect()->back()->with('message', 'Data korwil berhasil diperbarui!');
}

    public function destroy($id)
    {
        $korwil = Korwil::withCount('alumni')->findOrFail($id);

        // 💡 FITUR KEAMANAN TAMBAHAN:
        // Mencegah error SQL karena foreign key constraint jika Korwil ini ternyata masih memiliki anggota alumni didalamnya.
        if ($korwil->alumni_count > 0) {
            return redirect()->back()->with('message', 'Gagal: Korwil ini tidak bisa dihapus karena masih memiliki ' . $korwil->alumni_count . ' alumni terdaftar.');
        }

        $korwil->delete();
        
        return redirect()->back()->with('message', 'Korwil berhasil dihapus!');
    }
}