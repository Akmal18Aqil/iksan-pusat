<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ActivityController extends Controller
{
   public function index(Request $request)
    {
        $photos = Activity::where('kategori', 'foto')
            ->latest()
            ->paginate(6, ['*'], 'photo_page')
            ->withQueryString();

        $videos = Activity::where('kategori', 'video')
            ->latest()
            ->paginate(6, ['*'], 'video_page')
            ->withQueryString();

        // 📝 SESUAIKAN KESINI: Mengarah ke folder Activity/Index
        return Inertia::render('Activity/Index', [
            'photos' => $photos,
            'videos' => $videos,
        ]);
    }

    

    public function edit($id)
    {
        $activity = Activity::findOrFail($id);

        // 📝 SESUAIKAN KESINI: Mengarah ke folder Activity/Edit (jika nanti menggunakan form terpisah)
        return Inertia::render('Activity/Edit', [
            'activity' => $activity
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required',
            'kategori' => 'required|in:foto,video',
            'video_url' => 'required_if:kategori,video',
            'foto' => 'required_if:kategori,foto',
        ]);

        $finalMediaUrl = "";

        if ($request->kategori === 'foto') {
            $finalMediaUrl = $request->file('foto')->store('activities', 'public');
        } else {
            $url = $request->video_url;
            $pattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i';
            
            if (preg_match($pattern, $url, $match)) {
                $videoId = $match[1];
                $finalMediaUrl = "https://www.youtube.com/embed/" . $videoId;
            } else {
                return redirect()->back()->withErrors(['video_url' => 'Link YouTube tidak valid!']);
            }
        }

        Activity::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'media_url' => $finalMediaUrl,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('message', 'Data berhasil masuk ke Album ' . $request->kategori);
    }

    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);

        if ($activity->kategori === 'foto' && $activity->media_url) {
            if (Storage::disk('public')->exists($activity->media_url)) {
                Storage::disk('public')->delete($activity->media_url);
            }
        }

        $activity->delete();
        return redirect()->back();
    }

   public function update(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);

        $request->validate([
            'judul'     => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori'  => 'required|string|in:foto,video',
            'foto'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
            'video_url' => 'required_if:kategori,video',
        ]);

        $mediaUrl = $activity->media_url; 

        if ($request->kategori === 'foto') {
            if ($request->hasFile('foto')) {
                if ($activity->media_url && Storage::disk('public')->exists($activity->media_url)) {
                    Storage::disk('public')->delete($activity->media_url);
                }
                $mediaUrl = $request->file('foto')->store('activities', 'public'); 
            }
        } else {
            $url = $request->video_url;
            $pattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i';
            
            if (preg_match($pattern, $url, $match)) {
                $videoId = $match[1];
                $mediaUrl = "https://www.youtube.com/embed/" . $videoId;
            } else {
                if (!str_contains($url, 'youtube.com/embed/')) {
                    return redirect()->back()->withErrors(['video_url' => 'Link YouTube tidak valid!']);
                }
                $mediaUrl = $url;
            }
        }

        $activity->update([
            'judul'     => $request->judul,
            'deskripsi' => $request->deskripsi,
            'kategori'  => $request->kategori,
            'media_url' => $mediaUrl,
        ]);

        return redirect()->route('kegiatan')->with('flash', [
            'message' => 'Data kegiatan berhasil diperbarui!'
        ]);
    }
}