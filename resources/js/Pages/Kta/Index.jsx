import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ alumni, filters = {} }) {
    const [search, setSearch] = useState(filters?.search || '');

    // Otomatisasi Filter Pencarian berdasarkan nama_lengkap atau ID (Debounce 400ms)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(window.location.pathname, { search: search }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const dataAlumni = alumni?.data || [];

    return (
        <AuthenticatedLayout header={<h2 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">Cetak KTA Alumni</h2>}>
            <Head title="Cetak KTA" />

            <div className="py-12 bg-slate-50 min-h-screen flex flex-col justify-between">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full mb-auto">
                    
                    {/* BAR PENCARIAN */}
                    <div className="mb-8 max-w-md group">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-blue-600">🔍</span>
                            <input 
                                type="text" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan nama alumni atau ID..."
                                className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* TABEL DATA LIST SIAP CETAK */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-950/5 overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-900 text-white uppercase text-[10px] font-black tracking-widest">
                                        <th className="py-5 px-6 text-center w-16">No</th>
                                        <th className="py-5 px-6 w-24 text-center">Foto</th>
                                        <th className="py-5 px-6">ID Profil</th>
                                        <th className="py-5 px-6">Nama Lengkap</th>
                                        <th className="py-5 px-6">No. HP</th>
                                        {/* 💡 JUDUL KOLOM DISESUAIKAN */}
                                        <th className="py-5 px-6">Tahun Masuk</th>
                                        <th className="py-5 px-6">Tahun Keluar</th>
                                        <th className="py-5 px-6 text-center w-40">Aksi Cetak</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                    {dataAlumni.length > 0 ? dataAlumni.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* Nomor Urut Kontinu */}
                                            <td className="py-5 px-6 text-center font-bold text-slate-400">
                                                {(alumni.current_page - 1) * alumni.per_page + index + 1}
                                            </td>
                                            
                                            {/* Foto Profil */}
                                            <td className="py-5 px-6 flex justify-center">
                                                <div className="w-10 h-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                                    {item.foto ? (
                                                        <img src={`/storage/${item.foto}`} className="w-full h-full object-cover" alt="Foto Profil" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-slate-400">NO PIC</div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* ID Profil */}
                                            <td className="py-5 px-6 font-mono text-xs font-black text-blue-900 tracking-tight">
                                                <span className="bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                                    {String(item.user_id || item.id).padStart(5, '0')}
                                                </span>
                                            </td>

                                            {/* Nama Lengkap */}
                                            <td className="py-5 px-6 font-black uppercase text-slate-800 tracking-tight">
                                                {item.nama_lengkap}
                                            </td>
                                            
                                            {/* No. HP */}
                                            <td className="py-5 px-6 font-black uppercase text-slate-800 tracking-tight">
                                                {item.no_hp || '-'}
                                            </td>

                                            {/* 💡 Kolom Tahun Masuk (Mengambil dari property angkatan/tahun_masuk) */}
                                            <td className="py-5 px-6 text-slate-600 font-bold">
                                                {item.angkatan || item.tahun_masuk || '-'}
                                            </td>

                                            {/* 💡 Kolom Baru: Tahun Keluar */}
                                            <td className="py-5 px-6 text-slate-600 font-bold">
                                                {item.tahun_keluar || '-'}
                                            </td>

                                            {/* Tombol Cetak */}
                                            <td className="py-5 px-6 text-center">
                                                {/* 💡 Modifikasi bagian atribut tag <a> tombol cetak */}
<a 
    href={route('kta.pdf', item.id)} 
    target="_blank"        // 💡 Membuka proses generate di window terpisah secara instan
    rel="noopener noreferrer"
    download               // 💡 Memaksa browser langsung mengunduh sebagai file tanpa rendering halaman baru
    className="inline-flex items-center bg-indigo-700 hover:bg-indigo-800 text-white font-black uppercase text-[9px] tracking-wider px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-700/20 hover:scale-105 transform duration-200"
>
    🖨️ Download PDF
</a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            {/* 💡 colSpan dinaikkan menjadi 8 karena ada penambahan kolom baru */}
                                            <td colSpan="8" className="text-center py-16 text-slate-300 font-black italic uppercase tracking-wider">
                                                Data Profil Alumni Tidak Ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION LINK */}
                    {alumni?.links && (
                        <div className="mt-8 flex justify-center gap-2">
                            {alumni.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        data={{ search: search }} 
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${link.active ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-white text-slate-400 hover:bg-blue-50'}`} 
                                    />
                                ) : (
                                    <span 
                                        key={i} 
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                        className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-200 bg-white border opacity-50" 
                                    />
                                )
                            ))}
                        </div>
                    )}

                </div>

                {/* FOOTER PREMIUM */}
                <footer className="mt-16 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t border-blue-400/20 py-4 px-6 text-center shadow-inner rounded-b-3xl print:hidden">
                    <p className="text-xs font-bold text-blue-100 tracking-wider uppercase">
                        &copy; {new Date().getFullYear()} IKSAN. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}