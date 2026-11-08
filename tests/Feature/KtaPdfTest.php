<?php

namespace Tests\Feature;

use App\Models\AlumniProfile;
use App\Models\Korwil;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\FrameDecorator\Text;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class KtaPdfTest extends TestCase
{
    public static function identities(): array
    {
        return [
            'short' => ['ALUMNI CONTOH', 'Malang', 'Alamat contoh', 'Daerah contoh'],
            'long' => [
                'NAMA ALUMNI CONTOH PANJANG UNTUK UJI TATA LETAK',
                'Kabupaten Malang',
                'Alamat contoh panjang, Jalan Contoh Nomor 123, RT 001 RW 002, Kecamatan Contoh, Kabupaten Malang',
                'Daerah contoh Gondanglegi, Pagelaran dan sekitarnya',
            ],
            'missing' => ['ALUMNI CONTOH', null, null, null],
        ];
    }

    #[DataProvider('identities')]
    public function test_front_identity_fits_the_panel(?string $name, ?string $birthplace, ?string $address, ?string $region): void
    {
        $alumni = new AlumniProfile([
            'user_id' => '859601001',
            'nama_lengkap' => $name,
            'tempat_lahir' => $birthplace,
            'tanggal_lahir' => '1990-02-09',
            'angkatan' => '1985',
            'tahun_keluar' => '1996',
            'alamat_lengkap' => $address,
        ]);
        $alumni->setRelation('korwil', $region ? new Korwil(['wilayah' => $region]) : null);
        $pdf = Pdf::loadView('pdf.kta', compact('alumni'))
            ->setPaper([0, 0, 242.64, 153.01], 'landscape');
        $textBoxes = [];
        $pdf->getDomPDF()->setCallbacks([[
            'event' => 'end_frame',
            'f' => function ($frame, $canvas) use (&$textBoxes) {
                if ($canvas->get_page_number() === 1 && $frame instanceof Text && trim($frame->get_text()) !== '') {
                    $box = $frame->get_border_box();
                    if ($box[0] >= 69) {
                        $textBoxes[] = [$frame->get_text(), $box];
                    }
                }
            },
        ]]);

        $output = $pdf->output();

        $this->assertMatchesRegularExpression('/\/Subtype \/Image\s*\/Width 1685\s*\/Height 1063\b/', $output);
        $this->assertGreaterThanOrEqual(4, preg_match_all('/\/Subtype \/Image\s*\/Width 1685\s*\/Height 1063\b/', $output));

        $colons = array_values(array_filter($textBoxes, fn ($item) => trim($item[0]) === ':'));
        $this->assertCount(5, $colons);
        foreach ($colons as [, $box]) {
            $this->assertEqualsWithDelta($colons[0][1][0], $box[0], 0.01);
        }

        $this->assertSame(2, $pdf->getDomPDF()->getCanvas()->get_page_count());
        $this->assertNotEmpty($textBoxes);
        foreach ($textBoxes as [$text, [$x, $y, $width, $height]]) {
            $this->assertLessThanOrEqual(231, $x + $width, 'Right edge: '.$text);
            $this->assertLessThanOrEqual(113.5, $y + $height, 'Bottom edge: '.$text);
        }
    }
}
