<?php

namespace App\Http\Controllers;

use App\Models\Dzikir;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class DzikirController extends Controller
{
    

    public function index()
{
    // Mengambil 6 data per halaman
    $dzikirs = Dzikir::with('user:id,name')
        ->latest()
        ->paginate(6)
        ->withQueryString();

    return Inertia::render('Dzikir/Index', [
        'dzikirs' => $dzikirs
    ]);
}

    public function store(Request $request)
    {
        $request->validate(['judul' => 'required', 'isi' => 'required', 'image' => 'nullable|image|max:2048']);

        $imagePath = $request->hasFile('image') ? $this->uploadAndCrop($request->file('image')) : null;

        Dzikir::create([
            'judul' => $request->judul,
            'isi' => $request->isi,
            'image' => $imagePath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('dzikir')->with('message', 'Amalan berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $dzikir = Dzikir::findOrFail($id);
        $data = $request->only(['judul', 'isi']);

        if ($request->hasFile('image')) {
            if ($dzikir->image) Storage::disk('public')->delete($dzikir->image);
            $data['image'] = $this->uploadAndCrop($request->file('image'));
        }

        $dzikir->update($data);
        return redirect()->route('dzikir')->with('message', 'Amalan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $dzikir = Dzikir::findOrFail($id);
        if ($dzikir->image) Storage::disk('public')->delete($dzikir->image);
        $dzikir->delete();
        return redirect()->back()->with('message', 'Amalan dihapus.');
    }

    private function uploadAndCrop($file)
    {
        $name = time() . '.jpg';
        $img = Image::read($file);
        $img->cover(1200, 675);
        $path = 'dzikir_images/' . $name;
        Storage::disk('public')->put($path, (string) $img->encodeByExtension('jpg'));
        return $path;
    }
}