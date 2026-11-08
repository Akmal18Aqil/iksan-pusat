<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        // Data tiruan dokumen AD ART Organisasi
        $documents = [
            [
                'id' => 1,
                'keterangan' => 'Anggaran Dasar (AD) IKSAN Perubahan 2026',
                'url_drive' => 'https://drive.google.com/drive/folders/example1'
            ],
            [
                'id' => 2,
                'keterangan' => 'Anggaran Rumah Tangga (ART) IKSAN Hasil Kongres Perdana',
                'url_drive' => 'https://drive.google.com/drive/folders/example2'
            ],
            [
                'id' => 3,
                'keterangan' => 'Kode Etik & Tata Tertib Keanggotaan Organisasi',
                'url_drive' => 'https://drive.google.com/drive/folders/example3'
            ],
        ];

        // Me-render halaman sesuai standar PascalCase Anda: Pages/Organization/Index.jsx
        return Inertia::render('Organization/Index', [
            'documents' => $documents
        ]);
    }
}