import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ assets, filters = {} }) {
    const { auth, flash } = usePage().props;
    
    // State Kontrol Aplikasi
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Inertia Form Setup
    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        kode_aset: '', nama_aset: '', jumlah: '', keterangan: ''
    });

    // Otomatisasi Filter Pencarian (Debounce 400ms)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('aset'), { search: search }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Handle Eksekusi Create dan Update
    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('aset.update', editId), {
                onSuccess: () => { closeFormPanel(); }
            });
        } else {
            post(route('aset.store'), {
                onSuccess: () => { closeFormPanel(); }
            });
        }
    };

    const handleEdit = (item) => {
        clearErrors();
        setEditId(item.id);
        setIsEditing(true);
        setShowForm(true);
        setData({
            kode_aset: item.kode_aset,
            nama_aset: item.nama_aset,
            jumlah: item.jumlah,
            keterangan: item.keterangan || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const closeFormPanel = () => {
        setShowForm(false);
        setIsEditing(false);
        reset();
        clearErrors();
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">Aset Iksan</h2>}>
            <Head title="Aset Iksan" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* TOAST PANEL */}
                    {flash?.message && (
                        <div className="mb-8 p-5 bg-blue-600 text-white rounded-2xl shadow-xl font-bold flex items-center animate-fade-in">
                            <span className="mr-3 text-xl">🚀</span> {flash.message}
                        </div>
                    )}

                    {/* BAR KONTROL UTAMA */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-blue-600">🔍</span>
                            <input 
                                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode, nama aset, atau keterangan..."
                                className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                            />
                        </div>

                        {auth.user.role === 'admin' && (
                            <button onClick={() => { if(showForm) { closeFormPanel(); } else { setShowForm(true); } }} 
                                className={`w-full md:w-auto px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-xl transition transform hover:scale-105 ${showForm ? 'bg-slate-700 text-white' : 'bg-blue-900 text-white'}`}>
                                {showForm ? '✖ Tutup' : '🏗️ Tambah Aset'}
                            </button>
                        )}
                    </div>

                    {/* FORM INPUT / EDIT ASET (PERBAIKAN: Shadow bawah form menggunakan pendaran warna biru brand `shadow-blue-900/10`) */}
                    {showForm && (
                        <div className={`mb-12 p-10 bg-white rounded-[3rem] shadow-2xl shadow-blue-950/10 border-b-8 transition-all duration-300 animate-fade-in border-blue-900`}>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Kode Aset</label>
                                        <input type="text" className="w-full rounded-2xl border-slate-200 p-4 font-bold text-slate-800 focus:ring-blue-500" value={data.kode_aset} onChange={e => setData('kode_aset', e.target.value)} placeholder="Contoh: AST-2026-001" disabled={isEditing} required />
                                        {errors.kode_aset && <p className="text-red-500 text-xs mt-1 font-bold">{errors.kode_aset}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nama Komoditi Aset</label>
                                        <input type="text" className="w-full rounded-2xl border-slate-200 p-4 font-bold text-slate-800 focus:ring-blue-500" value={data.nama_aset} onChange={e => setData('nama_aset', e.target.value)} placeholder="Contoh: Genset / Karpet Utama" required />
                                        {errors.nama_aset && <p className="text-red-500 text-xs mt-1 font-bold">{errors.nama_aset}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Jumlah Unit</label>
                                        <input type="number" className="w-full rounded-2xl border-slate-200 p-4 font-bold text-slate-800 focus:ring-blue-500" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)} placeholder="1" min="1" required />
                                        {errors.jumlah && <p className="text-red-500 text-xs mt-1 font-bold">{errors.jumlah}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Keterangan Tambahan / Asal Wakaf</label>
                                    <textarea rows="3" className="w-full rounded-2xl border-slate-200 p-4 font-semibold text-slate-800 focus:ring-blue-500" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} placeholder="Tulis rincian kondisi, lokasi penyimpanan atau asal muasal aset..." />
                                </div>
                                <div className="text-right">
                                    {/* PERBAIKAN: Tombol terbitkan & perbarui disatukan ke nuansa warna Biru Brand Premium */}
                                    <button disabled={processing} className="px-12 py-4 rounded-2xl font-black text-white bg-blue-900 hover:bg-blue-950 shadow-xl shadow-blue-900/20 transition-all uppercase text-xs tracking-wider">
                                        {processing ? 'MEMPROSES...' : isEditing ? '⚙️ PERBARUI DATA' : '🏗️ DAFTARKAN ASET'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TABEL LIST PREMIUM */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-900 text-white uppercase text-[10px] font-black tracking-widest">
                                        <th className="py-5 px-6 text-center w-16">No</th>
                                        <th className="py-5 px-6">Kode Aset</th>
                                        <th className="py-5 px-6">Nama Aset</th>
                                        <th className="py-5 px-6 text-center w-24">Jumlah</th>
                                        <th className="py-5 px-6">Keterangan</th>
                                        {auth.user.role === 'admin' && <th className="py-5 px-6 text-center w-32">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                    {assets.data.length > 0 ? assets.data.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-5 px-6 text-center font-bold text-slate-400">
                                                {(assets.current_page - 1) * assets.per_page + index + 1}
                                            </td>
                                            <td className="py-5 px-6 font-mono text-xs font-black text-blue-900 tracking-tight">
                                                <span className="bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">{item.kode_aset}</span>
                                            </td>
                                            <td className="py-5 px-6 font-bold uppercase text-slate-800">{item.nama_aset}</td>
                                            <td className="py-5 px-6 text-center">
                                                <span className="bg-slate-100 font-black text-xs px-3 py-1.5 rounded-full text-slate-600">{item.jumlah} Unit</span>
                                            </td>
                                            <td className="py-5 px-6 text-slate-500 max-w-xs truncate italic">{item.keterangan || '-'}</td>
                                            {auth.user.role === 'admin' && (
                                                <td className="py-5 px-6 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEdit(item)} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition">✏️</button>
                                                        <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition">🗑️</button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={auth.user.role === 'admin' ? 6 : 5} className="text-center py-16 text-slate-300 font-black italic uppercase tracking-wider">
                                                Daftar Inventaris Kosong / Tidak Ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION LINK */}
                    <div className="mt-8 flex justify-center gap-2">
                        {assets.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} href={link.url} data={{ search: search }} dangerouslySetInnerHTML={{ __html: link.label }} 
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${link.active ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-white text-slate-400 hover:bg-blue-50'}`} 
                                />
                            ) : (
                                <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-200 bg-white border opacity-50" />
                            )
                        ))}
                    </div>

                </div>
            </div>

            {/* CONFIRMATION MODAL DELETE */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/30" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 text-center border-t-[10px] border-red-500">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">🗑️</div>
                        <h2 className="text-xl font-black text-slate-800 mb-1 uppercase italic tracking-tighter">Hapus Inventaris?</h2>
                        <p className="text-slate-500 text-xs mb-6 italic">"{itemToDelete?.nama_aset}"</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider">Batal</button>
                            <button onClick={() => router.delete(route('aset.destroy', itemToDelete.id), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-700">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
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