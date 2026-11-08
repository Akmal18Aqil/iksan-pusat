import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function KorwilIndex({ korwils }) {
    const { flash } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // State untuk kontrol popup hapus kustom
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, patch, delete: destroy, reset, errors } = useForm({
        id: '', 
        nama_korwil: '',
        wilayah: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('korwil.update', editId), { 
                onSuccess: () => { 
                    reset(); 
                    setIsEditing(false); 
                    setEditId(null);
                } 
            });
        } else {
            post(route('korwil.store'), { 
                onSuccess: () => reset() 
            });
        }
    };

    // Fungsi membuka popup hapus kustom
    const confirmDelete = (korwil) => {
        setDeleteTarget(korwil);
        setShowDeleteModal(true);
    };

    // Fungsi eksekusi hapus setelah disetujui di popup
    const handleDeleteExecute = () => {
        if (deleteTarget) {
            destroy(route('korwil.destroy', deleteTarget.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center space-x-2 text-blue-900">
                    <span className="text-2xl">📍</span>
                    <h2 className="font-black text-xl uppercase tracking-tighter">Manajemen Kontrol Korwil</h2>
                </div>
            }
        >
            <Head title="Data Korwil" />
            
            <div className="py-12 bg-gray-50 min-h-screen flex flex-col justify-between">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full mb-auto">
                    
                    {/* NOTIFIKASI FLASH */}
                    {flash?.message && (
                        <div className="mb-6 p-4 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800 rounded-r-xl font-bold text-sm shadow-sm">
                            🎉 {flash.message}
                        </div>
                    )}

                    {/* FORM INPUT PREMIUM */}
                    <div className="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-black text-lg text-gray-800 uppercase tracking-tight mb-4">
                            {isEditing ? '📝 Perbarui Data Korwil' : '🚀 Tambah Korwil Baru'}
                        </h3>
                        <form onSubmit={submit} className="flex flex-col lg:flex-row gap-4 items-start">
                            <div className="w-full lg:w-24">
                                <label className="block text-xs font-black text-gray-500 uppercase mb-1 px-1">ID</label>
                                <input 
                                    className="w-full rounded-xl border-gray-200 text-center font-mono font-bold focus:border-blue-500 focus:ring-blue-500 uppercase bg-white text-gray-800" 
                                    placeholder="01" 
                                    maxLength="2"
                                    value={data.id} 
                                    onChange={e => setData('id', e.target.value.replace(/[^0-9]/g, ''))} 
                                />
                                {errors.id && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.id}</div>}
                            </div>

                            <div className="w-full flex-1">
                                <label className="block text-xs font-black text-gray-500 uppercase mb-1 px-1">Nama Wilayah Korwil</label>
                                <input 
                                    className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                    placeholder="Nama Korwil (e.g. Korwil Surabaya)" 
                                    value={data.nama_korwil} 
                                    onChange={e => setData('nama_korwil', e.target.value)} 
                                />
                                {errors.nama_korwil && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.nama_korwil}</div>}
                            </div>

                            <div className="w-full flex-1">
                                <label className="block text-xs font-black text-gray-500 uppercase mb-1 px-1">Cakupan Daerah</label>
                                <input 
                                    className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                    placeholder="Cakupan Wilayah" 
                                    value={data.wilayah} 
                                    onChange={e => setData('wilayah', e.target.value)} 
                                />
                                {errors.wilayah && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.wilayah}</div>}
                            </div>

                            <div className="flex gap-2 w-full lg:w-auto pt-5 self-end">
                                <button className="flex-1 lg:flex-none bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all">
                                    {isEditing ? 'Update' : 'Simpan'}
                                </button>
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsEditing(false); setEditId(null); reset(); }} 
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* TABEL DATA PREMIUM */}
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-center w-20">ID</th>
                                    <th className="p-4">Nama Korwil</th>
                                    <th className="p-4">Wilayah</th>
                                    <th className="p-4">Jumlah Alumni</th>
                                    <th className="p-4 text-center w-48">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {korwils.map((k) => (
                                    <tr key={k.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 text-center font-mono font-black text-gray-400 bg-gray-50/50">
                                            {String(k.id).padStart(2, '0')}
                                        </td>
                                        <td className="p-4 font-extrabold text-blue-900 uppercase tracking-tight">
                                            {k.nama_korwil}
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            {k.wilayah}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-black">
                                                👤 {k.alumni_count} Orang
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => { 
                                                        setIsEditing(true); 
                                                        setEditId(k.id); 
                                                        setData({ 
                                                            id: String(k.id).padStart(2, '0'), 
                                                            nama_korwil: k.nama_korwil, 
                                                            wilayah: k.wilayah 
                                                        }); 
                                                    }} 
                                                    className="flex items-center gap-1 text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-200 shadow-sm"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                
                                                {/* Tombol Hapus memanggil fungsi Kustom Modal */}
                                                <button 
                                                    onClick={() => confirmDelete(k)} 
                                                    className="flex items-center gap-1 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-200 shadow-sm"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🚨 POPUP POP-UP MODAL KONFIRMASI HAPUS PREMIUM */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm transition-opacity duration-300">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 text-rose-600 text-3xl mb-4 shadow-inner">
                                    ⚠️
                                </div>
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">Hapus Data Korwil?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    Apakah Anda yakin ingin menghapus <span className="font-extrabold text-blue-900">"{deleteTarget?.nama_korwil}"</span> secara permanen? Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteExecute}
                                    className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-100 transition-all"
                                >
                                    Ya, Hapus Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FOOTER PREMIUM DASHBOARD */}
                <footer className="mt-16 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t border-blue-400/20 py-4 px-6 text-center shadow-inner rounded-b-3xl print:hidden">
                    <p className="text-xs font-bold text-blue-100 tracking-wider uppercase">
                        &copy; {new Date().getFullYear()} IKSAN. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}