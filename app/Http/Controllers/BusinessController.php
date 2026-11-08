<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class BusinessController extends Controller
{
    // TAMPILKAN HALAMAN UTAMA USAHA ALUMNI
    public function index()
    {
        // Mengambil data komoditi dengan pagination (9 item per halaman) 
        // serta memuat data user pembuatnya
        $businesses = Business::with('user')
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Business/Index', [
            'businesses' => $businesses
        ]);
    }

    // PROSES SIMPAN DATA BARU
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi'   => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->uploadAndCrop($request->file('image'));
        }

        Business::create([
            'judul'   => $request->judul,
            'isi'     => $request->isi,
            'image'   => $imagePath,
            'user_id' => auth()->id(), // Otomatis mengikat ke id user/alumni yang sedang login
        ]);

        return redirect()->back()->with('message', 'Komoditi bisnis baru berhasil diterbitkan!');
    }

    // PROSES PERBARUI/EDIT DATA
    public function update(Request $request, $id)
    {
        $business = Business::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi'   => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        $imagePath = $business->image; // Default pakai foto yang lama

        if ($request->hasFile('image')) {
            // Hapus file fisik lama jika ada
            if ($business->image && file_exists(public_path('storage/' . $business->image))) {
                unlink(public_path('storage/' . $business->image));
            }
            // Simpan gambar baru
            $imagePath = $this->uploadAndCrop($request->file('image'));
        }

        $business->update([
            'judul' => $request->judul,
            'isi'   => $request->isi,
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('message', 'Data komoditi bisnis berhasil diperbarui!');
    }

    // PROSES HAPUS DATA
    public function destroy($id)
    {
        $business = Business::findOrFail($id);

        // Hapus file fisik gambar di folder public/storage
        if ($business->image && file_exists(public_path('storage/' . $business->image))) {
            unlink(public_path('storage/' . $business->image));
        }

        $business->delete();

        return redirect()->back()->with('message', 'Komoditi bisnis berhasil dihapus dari sistem!');
    }

    /**
     * HELPER: Auto simpan dan kompres gambar langsung ke folder fisik public (Tanpa Symlink)
     */
    private function uploadAndCrop($file)
    {
        $name = time() . '.jpg';
        $img = Image::read($file);
        $img->cover(800, 600); // Sesuaikan ukuran proporsional gambar bisnis
        
        $destinationPath = public_path('storage/business_photos');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0775, true);
        }

        $img->toJpeg(85)->save($destinationPath . '/' . $name);
        
        return 'business_photos/' . $name;
    }
}