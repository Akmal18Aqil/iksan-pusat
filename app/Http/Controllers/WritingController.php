<?php

namespace App\Http\Controllers;

use App\Models\Writing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class WritingController extends Controller
{
    /**
     * Menampilkan daftar tulisan alumni
     */
    public function index()
    {
        return Inertia::render('Writing/Index', [
            'writings' => Writing::with('user:id,name')->latest()->paginate(6)
        ]);
    }

    /**
     * Menyimpan tulisan baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->uploadAndCrop($request->file('image'));
        }

        Writing::create([
            'judul' => $request->judul,
            'isi' => $request->isi,
            'image' => $imagePath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('menulis')->with('message', 'Karya Anda berhasil diterbitkan!');
    }

    /**
     * Memperbarui tulisan
     */
    public function update(Request $request, $id)
    {
        $writing = Writing::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required',
        ]);

        $data = $request->only(['judul', 'isi']);

        if ($request->hasFile('image')) {
            if ($writing->image) {
                Storage::disk('public')->delete($writing->image);
            }
            $data['image'] = $this->uploadAndCrop($request->file('image'));
        }

        $writing->update($data);

        return redirect()->route('menulis')->with('message', 'Tulisan berhasil diperbarui!');
    }

    /**
     * Menghapus tulisan
     */
    public function destroy($id)
    {
        $writing = Writing::findOrFail($id);

        // Keamanan: Hanya admin atau pemilik yang bisa hapus
        if (auth()->user()->role === 'admin' || auth()->id() === $writing->user_id) {
            if ($writing->image) {
                Storage::disk('public')->delete($writing->image);
            }
            $writing->delete();
            return redirect()->back()->with('message', 'Tulisan berhasil dihapus.');
        }

        abort(403);
    }

    /**
     * Helper untuk memproses gambar
     */
    private function uploadAndCrop($file)
    {
        if (!Storage::disk('public')->exists('writing_images')) {
            Storage::disk('public')->makeDirectory('writing_images');
        }

        $name = time() . '.jpg';
        $img = Image::read($file);
        $img->cover(1200, 675); // Rasio 16:9
        
        $path = 'writing_images/' . $name;
        Storage::disk('public')->put($path, (string) $img->encodeByExtension('jpg'));
        
        return $path;
    }
}