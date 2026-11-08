import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function FinanceIndex({ donations, stats, monthlyRecap = [] }) {
    const { auth, flash } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form Hook - Menambahkan 'errors' untuk menangkap pesan validasi dari server
    const { data, setData, post, patch, processing, reset, errors } = useForm({
        nama_donatur: '', 
        nominal: '', 
        tanggal: new Date().toISOString().split('T')[0], 
        jenis: 'masuk', 
        keterangan: '' // Pastikan ini terdaftar
    });

    // Helper format Rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(num || 0);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('finance.update', editId), { 
                onSuccess: () => { 
                    setIsEditing(false); 
                    reset(); 
                } 
            });
        } else {
            post(route('finance.store'), { 
                onSuccess: () => reset() 
            });
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setIsEditing(true);
        setData({
            nama_donatur: item.nama_donatur || '',
            nominal: item.nominal || '',
            tanggal: item.tanggal || '',
            jenis: item.jenis || 'masuk',
            keterangan: item.keterangan || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-black text-2xl text-blue-900 uppercase">Laporan Kas Iksan</h2>}>
            <Head title="Keuangan" />
            
            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* FLASH MESSAGE SUCCESS */}
                    {flash?.message && (
                        <div className="mb-6 p-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg flex items-center">
                            <span className="mr-2">✅</span> {flash.message}
                        </div>
                    )}

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-white">
                        <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl border-b-8 border-blue-800 text-center">
                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Total Masuk</p>
                            <p className="text-3xl font-black mt-2">{formatRupiah(stats?.total_masuk)}</p>
                        </div>
                        <div className="bg-slate-700 p-8 rounded-[2rem] shadow-xl border-b-8 border-slate-900 text-center">
                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Total Keluar</p>
                            <p className="text-3xl font-black mt-2">{formatRupiah(stats?.total_keluar)}</p>
                        </div>
                        <div className="bg-blue-950 p-8 rounded-[2rem] shadow-xl border-b-8 border-yellow-500 text-center">
                            <p className="text-[10px] font-black uppercase text-yellow-400 font-bold tracking-widest">Saldo Kas</p>
                            <p className="text-3xl font-black mt-2">{formatRupiah(stats?.saldo)}</p>
                        </div>
                    </div>

                    {/* FORM INPUT (ONLY FOR ADMIN) */}
                    {auth?.user?.role === 'admin' && (
                        <div className={`mb-12 p-8 rounded-[3rem] shadow-2xl border-t-8 bg-white transition-all ${isEditing ? 'border-amber-400' : 'border-blue-600'}`}>
                            <h4 className="font-black text-slate-800 mb-6 uppercase text-sm italic">
                                {isEditing ? '⚠️ Edit Transaksi' : '📝 Input Kas Baru'}
                            </h4>
                            
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Donatur / Sumber</label>
                                    <input className="w-full rounded-2xl border-slate-200 font-bold p-3 mt-1 focus:ring-blue-600" value={data.nama_donatur} onChange={e => setData('nama_donatur', e.target.value)} required />
                                    {errors.nama_donatur && <div className="text-red-500 text-[10px] mt-1 ml-2">{errors.nama_donatur}</div>}
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nominal</label>
                                    <input type="number" className="w-full rounded-2xl border-slate-200 font-bold p-3 mt-1" value={data.nominal} onChange={e => setData('nominal', e.target.value)} required />
                                    {errors.nominal && <div className="text-red-500 text-[10px] mt-1 ml-2">{errors.nominal}</div>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tanggal</label>
                                    <input type="date" className="w-full rounded-2xl border-slate-200 font-bold p-3 mt-1" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Jenis Kas</label>
                                    <select className="w-full rounded-2xl border-slate-200 font-bold p-3 mt-1" value={data.jenis} onChange={e => setData('jenis', e.target.value)}>
                                        <option value="masuk">Masuk (Debit)</option>
                                        <option value="keluar">Keluar (Kredit)</option>
                                    </select>
                                </div>

                                {/* INPUT KETERANGAN - WAJIB ADA AGAR TIDAK ERROR */}
                                <div className="md:col-span-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Keterangan / Catatan</label>
                                    <input className="w-full rounded-2xl border-slate-200 font-bold p-3 mt-1" placeholder="Contoh: Pembayaran iuran bulan Juli" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} required />
                                    {errors.keterangan && <div className="text-red-500 text-[10px] mt-1 ml-2">{errors.keterangan}</div>}
                                </div>

                                <div className="md:col-span-4 flex justify-end gap-3 mt-4">
                                    {isEditing && (
                                        <button type="button" onClick={() => {setIsEditing(false); reset();}} className="bg-slate-200 px-8 py-3 rounded-2xl font-black text-xs hover:bg-slate-300 transition">BATAL</button>
                                    )}
                                    <button disabled={processing} className="bg-blue-600 px-12 py-3 rounded-2xl font-black text-white shadow-xl hover:bg-blue-700 transition uppercase text-xs disabled:opacity-50">
                                        {isEditing ? 'UPDATE DATA' : 'SIMPAN TRANSAKSI'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* MAIN TABLE */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 mb-12">
                        <div className="bg-blue-950 p-6 text-white flex justify-between items-center">
                            <h3 className="font-black text-xs uppercase tracking-widest ml-2">Riwayat Transaksi Kas</h3>
                            <a href={route('finance.export')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg transition">📥 Export Excel</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b">
                                    <tr>
                                        <th className="p-6">Tanggal</th>
                                        <th className="p-6">Nama / Sumber</th>
                                        <th className="p-6">Keterangan</th>
                                        <th className="p-6">Jenis</th>
                                        <th className="p-6 text-right">Nominal</th>
                                        {auth?.user?.role === 'admin' && <th className="p-6 text-center">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                                    {donations?.data && donations.data.length > 0 ? (
                                        donations.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition">
                                                <td className="p-6 text-xs text-slate-400 font-black italic">{item.tanggal}</td>
                                                <td className="p-6 uppercase text-blue-900 text-sm tracking-tighter">{item.nama_donatur}</td>
                                                <td className="p-6 text-xs text-slate-500 font-normal">{item.keterangan || '-'}</td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.jenis === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {item.jenis === 'masuk' ? 'MASUK' : 'KELUAR'}
                                                    </span>
                                                </td>
                                                <td className={`p-6 text-right font-black ${item.jenis === 'masuk' ? 'text-blue-600' : 'text-red-600'}`}>
                                                    {formatRupiah(item.nominal)}
                                                </td>
                                                {auth?.user?.role === 'admin' && (
                                                    <td className="p-6 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button onClick={() => handleEdit(item)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition">✏️</button>
                                                            <button onClick={() => {if(confirm('Hapus transaksi ini?')) router.delete(route('finance.destroy', item.id))}} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition">🗑️</button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="p-20 text-center text-slate-300 font-black italic uppercase">Belum ada riwayat transaksi.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* PAGINATION */}
                        {donations?.links && (
                            <div className="bg-slate-50 p-6 flex flex-wrap justify-center gap-2 border-t">
                                {donations.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 rounded-xl text-[10px] font-black transition ${link.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`} />
                                    ) : (
                                        <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-200 bg-white" />
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MONTHLY RECAP */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-blue-100">
                        <div className="bg-slate-900 p-6 text-white border-b-4 border-yellow-500 flex justify-between items-center">
                            <h3 className="font-black text-xs uppercase tracking-widest">Akumulasi Kas Per Bulan</h3>
                            <span className="text-[10px] font-bold text-yellow-400 italic">Standar Buku Kas</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b">
                                    <tr>
                                        <th className="p-6">Bulan Periode</th>
                                        <th className="p-6 text-right">Masuk (Debit)</th>
                                        <th className="p-6 text-right">Keluar (Kredit)</th>
                                        <th className="p-6 text-right">Saldo Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-black">
                                    {monthlyRecap?.length > 0 ? monthlyRecap.map((rekap, idx) => (
                                        <tr key={idx} className="hover:bg-yellow-50/50 transition">
                                            <td className="p-6 text-blue-900 uppercase italic tracking-tighter">{rekap.bulan}</td>
                                            <td className="p-6 text-right text-green-600">{formatRupiah(rekap.masuk)}</td>
                                            <td className="p-6 text-right text-red-500">{formatRupiah(rekap.keluar)}</td>
                                            <td className="p-6 text-right text-blue-950 font-black underline decoration-yellow-400 decoration-2">{formatRupiah(rekap.masuk - rekap.keluar)}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="p-10 text-center text-slate-300 italic uppercase">Belum ada akumulasi bulanan</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t border-blue-400/20 py-6 px-6 text-center shadow-inner rounded-b-[3rem] mt-[-2rem] relative z-10">
                <p className="text-[10px] font-bold text-blue-200 tracking-[0.3em] uppercase">
                    &copy; {new Date().getFullYear()} IKSAN ALUMNI • Professional Financial Report
                </p>
            </footer>
        </AuthenticatedLayout>
    );
}