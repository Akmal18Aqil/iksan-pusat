<?php

namespace App\Http\Controllers;

use App\Models\Kajian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class KajianController extends Controller
{
    public function index()
    {
        return Inertia::render('Kajian/Index', [
            'kajians' => Kajian::with('user:id,name')->latest()->paginate(6)
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'judul' => 'required',
        'isi'   => 'required',
        'image' => 'nullable|image|max:2048'
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $this->uploadAndCropKajian($request->file('image'));
    }

    // Pastikan 'image' masuk ke array create
    Kajian::create([
        'judul'   => $request->judul,
        'isi'     => $request->isi,
        'user_id' => auth()->id(),
        'image'   => $imagePath, // Pastikan ini tidak terlewat
    ]);

    return redirect()->route('kajian')->with('message', 'Berhasil terbit!');
}

    public function update(Request $request, $id)
    {
        $kajian = Kajian::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi'   => 'required|string',
            'image' => 'nullable', // Bisa file baru atau string path lama
        ]);

        $data = $request->only(['judul', 'isi']);

        if ($request->hasFile('image')) {
            // Hapus file lama jika ada
            if ($kajian->image) {
                Storage::disk('public')->delete($kajian->image);
            }
            $data['image'] = $this->uploadAndCropKajian($request->file('image'));
        }

        $kajian->update($data);

        return redirect()->route('kajian')->with('message', 'Kajian berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $kajian = Kajian::findOrFail($id);
        if ($kajian->image) {
            Storage::disk('public')->delete($kajian->image);
        }
        $kajian->delete();
        return redirect()->back()->with('message', 'Kajian berhasil dihapus!');
    }

    private function uploadAndCropKajian($file)
    {
        // Pastikan folder ada
        if (!Storage::disk('public')->exists('kajian_images')) {
            Storage::disk('public')->makeDirectory('kajian_images');
        }

        $name = time() . '.jpg';
        $img = Image::read($file);
        $img->cover(1200, 675); // Rasio 16:9
        
        $path = 'kajian_images/' . $name;
        Storage::disk('public')->put($path, (string) $img->encodeByExtension('jpg'));
        
        return $path;
    }
}