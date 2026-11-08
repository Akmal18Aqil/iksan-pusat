import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ documents = [] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl text-blue-900 uppercase italic">Dokumen Organisasi</h2>}
        >
            <Head title="AD ART Organisasi" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* BANNER GRADIENT BRAND UTAMA */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-3xl p-8 mb-10 shadow-2xl text-white animate-fade-in">
                        <div className="relative z-10">
                            <span className="bg-blue-500/30 text-blue-200 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-400/20">
                                Konstitusi Organisasi
                            </span>
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mt-3 italic">📜 AD ART IKSAN</h3>
                            <p className="text-blue-100/80 text-xs md:text-sm font-medium mt-2 max-w-2xl leading-relaxed">
                                Landasan dasar dan hukum tertinggi organisasi. Gunakan tautan Google Drive resmi di bawah untuk meninjau atau mengunduh berkas fisik secara sah.
                            </p>
                        </div>
                        {/* Efek hiasan lingkaran abstrak di latar belakang banner */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl"></div>
                    </div>

                    {/* KARTU UTAMA TAMPILAN TABEL */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 p-8 md:p-12 animate-fade-in">
                        
                        {/* HEADER INTERNAL */}
                        <div className="mb-8 border-b pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Daftar Dokumen Resmi</h4>
                                <p className="text-slate-400 text-xs font-medium mt-0.5">Memastikan seluruh data berkas terintegrasi langsung dengan Cloud Storage.</p>
                            </div>
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-wider">
                                Total: {documents.length} Berkas
                            </span>
                        </div>

                        {/* WRAPPER TABLE RESPONSIF */}
                        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-900 text-white text-[11px] font-black uppercase tracking-[0.15em]">
                                        <th className="py-5 px-6 text-center w-20 rounded-tl-2xl">No</th>
                                        <th className="py-5 px-6">Keterangan / Nama Dokumen</th>
                                        <th className="py-5 px-6 text-center w-48 rounded-tr-2xl">URL Google Drive</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                                    {documents.map((doc, index) => (
                                        <tr key={doc.id} className="hover:bg-blue-50/30 transition duration-150 group">
                                            {/* NOMOR */}
                                            <td className="py-5 px-6 text-center font-black text-slate-400 group-hover:text-blue-900 transition-colors">
                                                {index + 1}
                                            </td>
                                            
                                            {/* KETERANGAN */}
                                            <td className="py-5 px-6 font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                                                {doc.keterangan}
                                            </td>
                                            
                                            {/* URL GOOGLE DRIVE (TOMBOL BIRU BRAND) */}
                                            <td className="py-5 px-6 text-center">
                                                <a 
                                                    href={doc.url_drive} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 transition-all transform active:scale-95 group-hover:scale-105"
                                                >
                                                    <span>📂 Buka Berkas</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* JIKA DATA DOKUMEN KOSONG */}
                                    {documents.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-16 text-center font-black text-slate-300 uppercase tracking-widest italic bg-slate-50/50">
                                                Belum ada dokumen yang diunggah
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>
             <div>
                 {/* 💡 FOOTER PREMIUM DENGAN UJUNG BAWAH TUMPUL SEPADAN DENGAN BANNER */}
<footer className="mt-16 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t border-blue-400/20 py-4 px-6 text-center shadow-inner rounded-b-3xl print:hidden">
    <p className="text-xs font-bold text-blue-100 tracking-wider uppercase">
        &copy; {new Date().getFullYear()} IKSAN. All Rights Reserved.
    </p>
</footer>
            
            </div>
        </AuthenticatedLayout>
    );
}