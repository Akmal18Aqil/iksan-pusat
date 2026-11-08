<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>KTA Alumni - {{ $alumni->nama_lengkap }}</title>
    <style>
        /* Mengunci ukuran kertas internasional CR-80 standar ID Card */
        @page {
            size: 8.56cm 5.398cm landscape;
            margin: 0;
        }
        
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica', 'Arial', sans-serif;
            background-color: #ffffff;
            color: #0f172a;
            width: 8.56cm;
            height: 5.398cm;
        }

        /* Memaksa pemotongan halaman tepat setelah komponen selesai */
        .page-break {
            page-break-after: always;
            page-break-inside: avoid;
            width: 8.56cm;
            height: 5.398cm;
            position: relative;
            overflow: hidden;
        }

        /* Kontainer Utama Depan */
        .card {
            width: 8.56cm;
            height: 5.398cm;
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
        }
        .card-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 8.56cm;
            height: 5.398cm;
        }
        
        .content-container {
            position: absolute;
            top: 1.78cm;
            left: 0.5cm;
            width: 7.6cm;
        }

        .photo-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 1.6cm;
            height: 2.1cm;
            border: 1pt solid #eef4eb;
            border-radius: 3px;
            background-color: #eef4eb;
            overflow: hidden;
        }
        .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .no-photo {
            text-align: center;
            font-size: 5px;
            font-weight: bold;
            color: #64748b;
            padding-top: 30px;
        }

        .identity {
            position: absolute;
            top: 0;
            left: 1.98cm;
            width: 5.5cm;
            font-family: Helvetica, Arial, sans-serif;
            color: #203820;
        }
        .member-name {
            margin: 0 0 0.35mm;
            font-size: 7.8pt;
            line-height: 1.1;
            font-weight: bold;
        }
        .info-table {
            width: 100%;
            table-layout: auto;
            border-collapse: collapse;
        }
        .info-table td {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 5.6pt;
            padding: 0 0 0.6mm;
            vertical-align: top;
            line-height: 1.15;
            overflow-wrap: break-word;
        }
        .label {
            width: 1.55cm;
            font-weight: normal;
            color: #374c35;
            white-space: nowrap;
        }
        .colon {
            width: 0.2cm;
            color: #374c35;
            text-align: center;
        }
        .value {
            width: 3.75cm;
            font-weight: normal;
            white-space: normal;
        }
        .korwil-row .value {
            font-weight: bold;
        }
        .identity-compact .member-name {
            font-size: 6.8pt;
        }
        .identity-compact .info-table td {
            font-size: 5.1pt;
            line-height: 1.05;
            padding-bottom: 0.25mm;
        }

        /* ==========================================================
           HALAMAN BELAKANG (ANTI LUMPUR / OVERFLOW)
           ========================================================== */
        .back-card {
            width: 8.56cm;
            height: 5.398cm;
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
        }
        .back-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 8.56cm;
            height: 5.398cm;
        }
        
    </style>
</head>
<body>

    <!-- HALAMAN 1: DEPAN -->
    <div class="page-break">
        <div class="card">
            <img class="card-background" src="{{ public_path('images/kta-front.png') }}" alt="" width="1685" height="1063">
            <div class="content-container">
                <div class="photo-box">
                    @if($alumni->foto && file_exists(public_path('storage/' . $alumni->foto)))
                        <img src="{{ public_path('storage/' . $alumni->foto) }}" alt="Foto">
                    @else
                        <div class="no-photo">FOTO<br>2x3</div>
                    @endif
                </div>

                <div class="identity {{ mb_strlen($alumni->nama_lengkap.' '.$alumni->alamat_lengkap.' '.optional($alumni->korwil)->wilayah) > 140 ? 'identity-compact' : '' }}">
                    <h1 class="member-name">{{ $alumni->nama_lengkap }}</h1>
                    <table class="info-table">
                    <tr>
                        <td class="label">ID Alumni</td>
                        <td class="colon">:</td>
                        <td class="value">{{ str_pad($alumni->user_id ?? $alumni->id, 5, '0', STR_PAD_LEFT) }}</td>
                    </tr>
                    <tr>
                        <td class="label">TTL</td>
                        <td class="colon">:</td>
                        <td class="value">
                            {{ $alumni->tempat_lahir ?? '-' }}, 
                            {{ $alumni->tanggal_lahir ? \Carbon\Carbon::parse($alumni->tanggal_lahir)->locale('id')->translatedFormat('d F Y') : '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Masuk / Keluar</td>
                        <td class="colon">:</td>
                        <td class="value">
                            {{ $alumni->angkatan ?? $alumni->tahun_masuk ?? '-' }} / {{ $alumni->tahun_keluar ?? '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Alamat</td>
                        <td class="colon">:</td>
                        <td class="value">{{ $alumni->alamat_lengkap ?? '-' }}</td>
                    </tr>
                    <tr class="korwil-row">
                        <td class="label">Korwil</td>
                        <td class="colon">:</td>
                        <td class="value">{{ optional($alumni->korwil)->wilayah ?: (optional($alumni->korwil)->nama_korwil ?: '-') }}</td>
                    </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- HALAMAN 2: BELAKANG -->
    <div class="page-break" style="page-break-after: avoid;">
        <div class="back-card">
            <img class="back-background" src="{{ public_path('images/kta-back.png') }}" alt="" width="1685" height="1063">
        </div>
    </div>

</body>
</html>
