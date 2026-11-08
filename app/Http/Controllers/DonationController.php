<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Exports\DonationsExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    /**
     * Menampilkan Dashboard Keuangan
     */
    public function index()
{
    // Gunakan paginate (Donations akan menjadi Object)
    $donations = Donation::orderBy('tanggal', 'desc')->paginate(10);
    
    $stats = [
        'total_masuk' => (float) Donation::where('jenis', 'masuk')->sum('nominal') ?? 0,
        'total_keluar' => (float) Donation::where('jenis', 'keluar')->sum('nominal') ?? 0,
    ];
    $stats['saldo'] = $stats['total_masuk'] - $stats['total_keluar'];

    // Monthly Recap (Ini tetap menjadi Array)
    $monthlyRecap = Donation::select(
        \DB::raw("DATE_FORMAT(tanggal, '%Y-%m') as bulan"),
        \DB::raw("SUM(CASE WHEN jenis = 'masuk' THEN nominal ELSE 0 END) as masuk"),
        \DB::raw("SUM(CASE WHEN jenis = 'keluar' THEN nominal ELSE 0 END) as keluar")
    )
    ->groupBy('bulan')
    ->orderBy('bulan', 'desc')
    ->get();

    return Inertia::render('Finance/Index', [
        'donations' => $donations,
        'stats' => $stats,
        'monthlyRecap' => $monthlyRecap ?? [],
    ]);
}

    /**
     * Menyimpan transaksi baru (Hanya Admin)
     */
    public function store(Request $request)
    {
        // Proteksi Role
        if (auth()->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Hanya Admin yang dapat menambah data keuangan.');
        }

        $request->validate([
            'nama_donatur' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'jenis' => 'required|in:masuk,keluar',
            'keterangan' => 'required' // Tambahkan ini agar muncul pesan peringatan jika kosong
        ]);

        Donation::create($request->all());

        return redirect()->back()->with('message', 'Transaksi berhasil dicatat!');
    }

    /**
     * Memperbarui transaksi (Hanya Admin)
     */
    public function update(Request $request, $id)
    {
        // Proteksi Role
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $donation = Donation::findOrFail($id);

        $request->validate([
            'nama_donatur' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'jenis' => 'required|in:masuk,keluar',
            'keterangan' => 'required'  
        ]);

        $donation->update($request->all());

        return redirect()->back()->with('message', 'Transaksi berhasil diperbarui!');
    }

    /**
     * Menghapus transaksi (Hanya Admin)
     */
    public function destroy($id)
    {
        // Proteksi Role
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $donation = Donation::findOrFail($id);
        $donation->delete();

        return redirect()->back()->with('message', 'Transaksi berhasil dihapus!');
    }

    /**
     * Fitur Export ke Excel
     */
    public function export() 
    {
        // Pastikan Anda sudah membuat file App\Exports\DonationsExport
        return Excel::download(new DonationsExport, 'Laporan_Keuangan_Iksan_' . date('Y-m-d') . '.xlsx');
    }
}