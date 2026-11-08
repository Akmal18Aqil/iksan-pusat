<?php

namespace App\Http\Controllers;

use App\Models\AlumniProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class KtaController extends Controller
{
    public function index(Request $request)
    {
        $query = AlumniProfile::query();

        // Pencarian disesuaikan dengan kolom nama_lengkap
        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama_lengkap', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('id', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $alumni = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Kta/Index', [
            'alumni' => $alumni,
            'filters' => $request->only(['search'])
        ]);
    }

    public function downloadPdf($id)
    {
        $alumni = AlumniProfile::with('korwil')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.kta', compact('alumni'));
        $pdf->setPaper([0, 0, 242.64, 153.01], 'landscape');

        //return $pdf->download('KTA_' . str_replace(' ', '_', $alumni->nama_lengkap) . '.pdf');
        //  KODE BARU (Lebih aman karena langsung dipaksa download file)
        return $pdf->download('kta-' . $alumni->id . '.pdf');

    }
}
