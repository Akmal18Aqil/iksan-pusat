<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    // TAMPILKAN DAFTAR ASET & PENCARIAN
    public function index(Request $request)
    {
        $query = Asset::query();

        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('kode_aset', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('nama_aset', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('keterangan', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $assets = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Asset/Index', [
            'assets'  => $assets,
            'filters' => $request->only(['search'])
        ]);
    }

    // SIMPAN ASET BARU
    public function store(Request $request)
    {
        $request->validate([
            'kode_aset'  => 'required|string|unique:assets,kode_aset|max:100',
            'nama_aset'  => 'required|string|max:255',
            'jumlah'     => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        Asset::create($request->all());

        return redirect()->back()->with('message', 'Data aset berhasil ditambahkan ke inventaris!');
    }

    // UPDATE DATA ASET
    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        $request->validate([
            'kode_aset'  => 'required|string|max:100|unique:assets,kode_aset,' . $asset->id,
            'nama_aset'  => 'required|string|max:255',
            'jumlah'     => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        $asset->update($request->all());

        return redirect()->back()->with('message', 'Data aset berhasil diperbarui!');
    }

    // HAPUS ASET
    public function destroy($id)
    {
        $asset = Asset::findOrFail($id);
        $asset->delete();

        return redirect()->back()->with('message', 'Aset berhasil dihapus dari inventaris!');
    }
}