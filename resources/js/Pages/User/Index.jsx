import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function UserIndex({ users, filters = {} }) {
    const { flash } = usePage().props;
    
    // State UI untuk Modal/Form Edit Password
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form Hook khusus untuk ganti password
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        password: '',
        password_confirmation: ''
    });

    // 🔍 State untuk Fitur Pencarian
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    // Sinkronisasi state pencarian jika filter dari backend berubah
    useEffect(() => {
        setSearchQuery(filters?.search || '');
    }, [filters?.search]);

    // 🔍 Fungsi Filter / Pencarian
    const handleFilter = (e) => {
        if (e) e.preventDefault();
        
        router.get(
            route('users.index'), 
            { search: searchQuery }, 
            { 
                preserveState: true,
                replace: true        
            }
        );
    };

    // Buka Modal Edit Password
    const handleEditPassword = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
        clearErrors();
        reset();
    };

    // Tutup Modal secara aman
    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
        clearErrors();
        reset();
    };

    // Eksekusi Update Password
    const submitPassword = (e) => {
        e.preventDefault();
        put(route('users.update-password', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseModal();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl text-blue-900 uppercase tracking-tighter italic">Manajemen Pengguna (User)</h2>}
        >
            <Head title="Manajemen User" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* NOTIFIKASI SUKSES / ERROR */}
                    {flash?.message && (
                        <div className="mb-8 p-5 bg-blue-600 text-white rounded-2xl shadow-xl font-bold animate-fade-in flex items-center">
                            <span className="mr-3 text-xl">✅</span> {flash.message}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-8 p-5 bg-rose-600 text-white rounded-2xl shadow-xl font-bold animate-fade-in flex items-center">
                            <span className="mr-3 text-xl">⚠️</span> {flash.error}
                        </div>
                    )}

                    {/* 🔍 BOX PENCARIAN */}
                    <div className="mb-8 p-6 bg-white rounded-[2.5rem] shadow-xl border border-blue-50 flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full uppercase font-black text-[10px] text-blue-900">
                            <label className="ml-2 mb-1 block">Cari Pengguna</label>
                            <input 
                                type="text" 
                                className="w-full rounded-2xl border-slate-200 p-3 font-bold focus:ring-blue-500 text-sm" 
                                placeholder="Ketik Email atau Nama Alumni..." 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleFilter()} 
                            />
                        </div>
                        <button 
                            onClick={handleFilter} 
                            className="w-full md:w-auto bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-blue-700 transition uppercase tracking-wider"
                        >
                            Cari User
                        </button>
                    </div>

                    {/* TABEL DATA USER */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                        <div className="bg-blue-950 p-6 text-white flex justify-between items-center border-b-4 border-blue-800">
                            <h3 className="font-black text-xs uppercase tracking-widest ml-2">Daftar Akun Login Sistem</h3>
                            <span className="bg-blue-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">{users?.total || 0} USER</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="p-6 text-center w-16">No</th>
                                        <th className="p-6">Akun Login (Email)</th>
                                        <th className="p-6">Password Status</th>
                                        <th className="p-6">Nama User (Alumni)</th>
                                        <th className="p-6">Alamat Lengkap</th>
                                        <th className="p-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users?.data?.length > 0 ? users.data.map((user, index) => {
                                        const noUrut = (users.current_page - 1) * users.per_page + index + 1;
                                        return (
                                            <tr key={user.id} className="hover:bg-blue-50/50 transition">
                                                <td className="p-6 text-center text-sm font-black text-blue-900/40 italic">{noUrut}</td>
                                                
                                                {/* Kolom Email yang digunakan untuk Login */}
                                                <td className="p-6">
                                                    <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-mono">
                                                        📧 <span>{user.email}</span>
                                                    </div>
                                                </td>

                                                {/* Kolom Password Indicator */}
                                                <td className="p-6">
                                                    <span className="text-[11px] font-mono tracking-widest text-slate-400 font-bold">
                                                        ••••••••
                                                    </span>
                                                </td>

                                                {/* Kolom Nama User */}
                                                <td className="p-6">
                                                    <div className="font-black text-blue-950 uppercase text-sm tracking-tight">
                                                        {user.alumni_profile?.nama_lengkap || user.name || 'Admin / Pengurus'}
                                                    </div>
                                                    <span className="text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                                                        Role: {user.role || 'User'}
                                                    </span>
                                                </td>

                                                {/* Kolom Alamat */}
                                                <td className="p-6 max-w-xs">
                                                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                                                        {user.alumni_profile?.alamat_lengkap || '—'}
                                                    </p>
                                                </td>

                                                {/* Kolom Aksi */}
                                                <td className="p-6 text-center">
                                                    <button 
                                                        onClick={() => handleEditPassword(user)} 
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition transform hover:scale-105 flex items-center justify-center gap-1.5 mx-auto"
                                                    >
                                                        🔑 <span>Ubah Password</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan="6" className="p-20 text-center text-slate-300 font-black italic uppercase">Data user tidak ditemukan...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="bg-slate-50 p-6 flex flex-wrap justify-center gap-2 border-t">
                            {users?.links?.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        data={{ search: searchQuery }} 
                                        preserveState
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition ${link.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm hover:bg-slate-100'}`} 
                                    />
                                ) : (
                                    <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-200 bg-white" />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL EDIT PASSWORD --- */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-scale-up border-t-8 border-blue-600">
                        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div>
                        
                        <h2 className="text-xl font-black text-slate-800 text-center uppercase tracking-tighter">Reset Password</h2>
                        <p className="text-center text-xs text-slate-400 font-bold mb-6">User: <span className="text-blue-600">{selectedUser?.email}</span></p>
                        
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left">
                            <span className="text-xs font-black text-blue-900 block mb-1">💡 Saran Keamanan:</span>
                            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                                Gunakan kombinasi **Angka (0-9)** dan **Huruf (A-Z, a-z)** sepanjang minimal **8 karakter** agar keamanan akun terjaga optimal.
                            </p>
                        </div>

                        <form onSubmit={submitPassword} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase ml-2 mb-1">Password Baru</label>
                                <input 
                                    type="password" 
                                    className="w-full rounded-2xl border-slate-200 p-3.5 font-bold focus:ring-blue-500 text-sm" 
                                    placeholder="Masukkan password baru"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="text-rose-500 text-xs mt-1 font-bold ml-2">{errors.password}</div>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase ml-2 mb-1">Konfirmasi Password</label>
                                <input 
                                    type="password" 
                                    className="w-full rounded-2xl border-slate-200 p-3.5 font-bold focus:ring-blue-500 text-sm" 
                                    placeholder="Ulangi password baru"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                />
                                {errors.password_confirmation && <div className="text-rose-500 text-xs mt-1 font-bold ml-2">{errors.password_confirmation}</div>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 transition">
                                    {processing ? 'PROSES...' : 'UPDATE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}