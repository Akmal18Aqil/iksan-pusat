import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AlumniIndex({ alumni, korwils = [], filters = {} }) {
    const { auth, flash } = usePage().props;
    
    // State UI
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // STATE UNTUK MODAL HAPUS
    const [isDeleteModalOpen, setIsDeletingModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form Hook - 💡 Menggunakan input manual latitude & longitude secara langsung
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nama_lengkap: '', 
        tempat_lahir: '', 
        tanggal_lahir: '',
        no_hp: '', 
        alamat_lengkap: '', 
        angkatan: '', 
        tahun_keluar: '', 
        korwil_id: '', 
        pekerjaan: '', 
        location_url: '', 
        latitude: '',
        longitude: '',
        foto: null,
    });

    // Handle Pencarian
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [korwilFilter, setKorwilFilter] = useState(filters?.korwil_id || '');

    const handleFilter = (e) => {
        if(e) e.preventDefault();
        router.get(route('alumni.index'), { search: searchQuery, korwil_id: korwilFilter }, { preserveState: true });
    };

    // 💡 LOGIKA SUBMIT FORM (Langsung kirim nilai latitude & longitude manual)
    const submit = (e) => {
        e.preventDefault();
        
        const url = isEditing ? route('alumni.update', editId) : route('alumni.store');
        
        router.post(url, {
            ...data,
            _method: isEditing ? 'patch' : 'post'
        }, {
            forceFormData: true,
            onSuccess: () => { setIsEditing(false); setShowForm(false); setPhotoPreview(null); reset(); }
        });
    };

    // 💡 LOGIKA EDIT (Memuat latitude & longitude yang tersimpan)
    const handleEdit = (item) => {
        setEditId(item.id); setIsEditing(true); setShowForm(true);
        if (item.foto) setPhotoPreview(`/storage/${item.foto}`);
        setData({
            nama_lengkap: item.nama_lengkap || '', 
            tempat_lahir: item.tempat_lahir || '',
            tanggal_lahir: item.tanggal_lahir || '', 
            no_hp: item.no_hp || '',
            alamat_lengkap: item.alamat_lengkap || '', 
            angkatan: item.angkatan || '',
            tahun_keluar: item.tahun_keluar || '', 
            korwil_id: item.korwil_id || '', 
            pekerjaan: item.pekerjaan || '', 
            location_url: item.location_url || '', 
            latitude: item.latitude || '',
            longitude: item.longitude || '',
            foto: null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // FUNGSI UNTUK MEMBUKA MODAL HAPUS
    const confirmDelete = (item) => {
        setItemToDelete(item);
        setIsDeletingModalOpen(true);
    };

    // FUNGSI EKSEKUSI HAPUS ASLI
    const executeDelete = () => {
        router.delete(route('alumni.destroy', itemToDelete.id), {
            onSuccess: () => {
                setIsDeletingModalOpen(false);
                setItemToDelete(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl text-blue-900 uppercase tracking-tighter italic">Database Alumni</h2>}
        >
            <Head title="Manajemen Alumni" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* NOTIFIKASI SUKSES */}
                    {flash?.message && (
                        <div className="mb-8 p-5 bg-blue-600 text-white rounded-2xl shadow-xl font-bold animate-fade-in flex items-center">
                            <span className="mr-3 text-xl">✅</span> {flash.message}
                        </div>
                    )}

                    {/* BOX PENCARIAN */}
                    <div className="mb-8 p-6 bg-white rounded-[2.5rem] shadow-xl border border-blue-50 flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full uppercase font-black text-[10px] text-blue-900">
                            <label className="ml-2 mb-1 block">Cari Nama</label>
                            <input type="text" className="w-full rounded-2xl border-slate-200 p-3 font-bold focus:ring-blue-500" placeholder="Ketik nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleFilter()} />
                        </div>
                        <div className="w-full md:w-64 uppercase font-black text-[10px] text-blue-900">
                            <label className="ml-2 mb-1 block">Wilayah</label>
                            <select className="w-full rounded-2xl border-slate-200 p-3 font-bold focus:ring-blue-500" value={korwilFilter} onChange={e => setKorwilFilter(e.target.value)}>
                                <option value="">Semua Wilayah</option>
                                {korwils?.map(k => <option key={k.id} value={k.id}>{k.nama_korwil}</option>)}
                            </select>
                        </div>
                        <button onClick={handleFilter} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-blue-700 transition">CARI</button>
                        
                        {auth.user.role !== 'alumni' && (
                            <button 
                                onClick={() => { if(isEditing){setIsEditing(false); reset();} setShowForm(!showForm); }} 
                                className={`px-8 py-3 rounded-2xl font-black text-xs shadow-xl transition transform hover:scale-105 ${
                                    showForm ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {showForm ? '✖ TUTUP' : '➕ TAMBAH'}
                            </button>
                        )}
                    </div>

                    {/* FORM INPUT */}
                    {(showForm || isEditing) && (
                        <div className={`mb-12 p-10 rounded-[3rem] shadow-2xl border-b-8 animate-fade-in transition-all ${
                            isEditing ? 'bg-blue-50/70 border-blue-700 shadow-blue-100' : 'bg-white border-blue-600'
                        }`}>
                            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center italic underline decoration-blue-500 underline-offset-8 decoration-4">
                                {isEditing ? '🔄 PERBARUI DATA ANGGOTA ALUMNI' : '📝 REGISTRASI ANGGOTA BARU'}
                            </h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-1 flex flex-col items-center bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-200">
                                    <div className="w-32 h-44 bg-slate-200 rounded-xl overflow-hidden border-4 border-white shadow-lg mb-4">
                                        {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-400 font-bold text-[10px] text-center p-4">PAS FOTO 3:4</div>}
                                    </div>
                                    <input type="file" id="foto-input" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; setData('foto', file); setPhotoPreview(URL.createObjectURL(file)); }} />
                                    <button type="button" onClick={() => document.getElementById('foto-input').click()} className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Pilih Foto</button>
                                    {errors.foto && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.foto}</div>}
                                </div>
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <input className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="Nama Lengkap" value={data.nama_lengkap} onChange={e => setData('nama_lengkap', e.target.value)} />
                                        {errors.nama_lengkap && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.nama_lengkap}</div>}
                                    </div>
                                    <div>
                                        <input className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="No. HP / WA" value={data.no_hp} onChange={e => setData('no_hp', e.target.value)} />
                                        {errors.no_hp && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.no_hp}</div>}
                                    </div>
                                    <div>
                                        <input className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="Tempat Lahir" value={data.tempat_lahir} onChange={e => setData('tempat_lahir', e.target.value)} />
                                        {errors.tempat_lahir && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.tempat_lahir}</div>}
                                    </div>
                                    <div>
                                        <input type="date" className="w-full rounded-2xl border-slate-200 p-4 font-bold" value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)} />
                                        {errors.tanggal_lahir && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.tanggal_lahir}</div>}
                                    </div>
                                    
                                    <div>
                                        <input type="number" className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="Tahun Masuk (Angkatan)" value={data.angkatan} onChange={e => setData('angkatan', e.target.value)} />
                                        {errors.angkatan && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.angkatan}</div>}
                                    </div>
                                    <div>
                                        <input type="number" className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="Tahun Keluar" value={data.tahun_keluar} onChange={e => setData('tahun_keluar', e.target.value)} />
                                        {errors.tahun_keluar && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.tahun_keluar}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <select className="w-full rounded-2xl border-slate-200 p-4 font-bold" value={data.korwil_id} onChange={e => setData('korwil_id', e.target.value)}>
                                            <option value="">Pilih Korwil</option>
                                            {korwils?.map(k => <option key={k.id} value={k.id}>[{String(k.id).padStart(2, '0')}] {k.nama_korwil}</option>)}
                                        </select>
                                        {errors.korwil_id && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.korwil_id}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <input className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="Pekerjaan Sekarang (Contoh: Guru, Wiraswasta, Mahasiswa)" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} />
                                        {errors.pekerjaan && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.pekerjaan}</div>}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <textarea className="w-full rounded-2xl border-slate-200 p-4 font-bold" placeholder="Alamat Lengkap" value={data.alamat_lengkap} onChange={e => setData('alamat_lengkap', e.target.value)}></textarea>
                                        {errors.alamat_lengkap && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.alamat_lengkap}</div>}
                                    </div>

                                    {/* 💡 INPUT URL & KOORDINAT MANUAL (Opsi 1) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Link Google Maps / Share Location WhatsApp</label>
                                        <input className="w-full rounded-2xl border-blue-100 bg-blue-50 p-4 font-bold text-blue-900" placeholder="https://maps.app.goo.gl/..." value={data.location_url} onChange={e => setData('location_url', e.target.value)} />
                                        {errors.location_url && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.location_url}</div>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Latitude</label>
                                            <input type="text" className="w-full rounded-2xl border-slate-200 p-4 font-mono font-bold" placeholder="Contoh: -7.9839" value={data.latitude} onChange={e => setData('latitude', e.target.value)} />
                                            {errors.latitude && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.latitude}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Longitude</label>
                                            <input type="text" className="w-full rounded-2xl border-slate-200 p-4 font-mono font-bold" placeholder="Contoh: 112.6214" value={data.longitude} onChange={e => setData('longitude', e.target.value)} />
                                            {errors.longitude && <div className="text-rose-500 text-xs mt-1 font-bold">{errors.longitude}</div>}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 -mt-4 text-[11px] text-slate-400 italic">
                                        💡 Tips: Buka link WhatsApp, salin koordinat lat & long dari Google Maps lalu paste ke kolom di atas agar pin peta langsung tampil.
                                    </div>
                                </div>
                                <div className="md:col-span-4 text-right">
                                    <button disabled={processing} className="px-12 py-4 rounded-2xl font-black text-white shadow-xl transition transform hover:-translate-y-1 bg-blue-600 shadow-blue-200 hover:bg-blue-700">
                                        {processing ? 'SEDANG PROSES...' : isEditing ? 'SIMPAN PERUBAHAN' : 'SIMPAN ANGGOTA BARU'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TABEL DATA */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                        <div className="bg-blue-950 p-6 text-white flex justify-between items-center border-b-4 border-blue-800">
                            <h3 className="font-black text-xs uppercase tracking-widest ml-2">Database Alumni Terdaftar</h3>
                            <span className="bg-blue-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">{alumni?.total || 0} TOTAL DATA</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="p-6 text-center w-16">No</th>
                                        <th className="p-6">User ID & Akun Login</th>
                                        <th className="p-6">Profil Alumni</th>
                                        <th className="p-6">Kontak & Wilayah</th>
                                        <th className="p-6">Pekerjaan</th>
                                        <th className="p-6 text-center">Status Map</th>
                                        <th className="p-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {alumni?.data?.length > 0 ? alumni.data.map((item, index) => {
                                        const noUrut = (alumni.current_page - 1) * alumni.per_page + index + 1;
                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition">
                                                <td className="p-6 text-center text-sm font-black text-blue-900/40 italic">{noUrut}</td>
                                                
                                                <td className="p-6">
                                                    <div className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl inline-block mb-1 border border-blue-100 shadow-sm">
                                                        🆔 {item.user_id || 'PROSES...'}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 font-semibold tracking-tight block">
                                                        📧 {item.username || 'proses@gmail.com'}
                                                    </div>
                                                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                                                        🔑 pass: password123
                                                    </div>
                                                </td>

                                                <td className="p-6 flex items-center">
                                                    <div className="w-12 h-16 bg-slate-200 rounded-xl overflow-hidden mr-4 border-2 border-white shadow-md flex-shrink-0">
                                                        {item.foto ? <img src={`/storage/${item.foto}`} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[8px] font-black uppercase text-center p-1 text-slate-400">NO FOTO</div>}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-blue-950 uppercase text-sm tracking-tight">{item.nama_lengkap}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">📅 {item.tempat_lahir}, {item.tanggal_lahir}</div>
                                                        <div className="text-[9px] font-black text-blue-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md uppercase mt-1 inline-block">
                                                            🎓 {item.angkatan} - {item.tahun_keluar || '????'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-blue-600 font-black text-xs mb-1">📱 {item.no_hp}</div>
                                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">{item.korwil?.nama_korwil || 'UMUM'}</span>
                                                </td>

                                                <td className="p-6">
                                                    <div className="text-xs font-black text-slate-700 uppercase tracking-tight">
                                                        {item.pekerjaan ? `💼 ${item.pekerjaan}` : '➖ Belum Diisi'}
                                                    </div>
                                                </td>

                                                <td className="p-6 text-center">
                                                    <div className={`text-[9px] font-black uppercase flex items-center justify-center gap-1.5 ${item.latitude && item.longitude ? 'text-green-500' : 'text-red-400'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${item.latitude && item.longitude ? 'bg-green-500' : 'bg-red-400'} animate-pulse`}></span>
                                                        {item.latitude && item.longitude ? 'TERSEDIA' : 'KOSONG'}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center items-center space-x-2">
                                                        {auth.user.role !== 'alumni' && (
                                                            <>
                                                                <button onClick={() => handleEdit(item)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition">✏️</button>
                                                                <button onClick={() => confirmDelete(item)} className="p-2.5 bg-red-100 text-red-600 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition">🗑️</button>
                                                            </>
                                                        )}
                                                        {item.location_url && <a href={item.location_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition">📍</a>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan="7" className="p-20 text-center text-slate-300 font-black italic uppercase">Data alumni belum terdaftar...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* PAGINATION */}
                        <div className="bg-slate-50 p-6 flex flex-wrap justify-center gap-2 border-t">
                            {alumni?.links?.link ? null : alumni?.links?.map((link, i) => (
                                link.url ? <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 rounded-xl text-[10px] font-black transition ${link.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm'}`} /> : 
                                <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-200 bg-white" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL KONFIRMASI HAPUS --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDeletingModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center animate-scale-up border-t-8 border-red-500">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">🗑️</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Konfirmasi Hapus</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                            Apakah Anda yakin ingin menghapus alumni <br/>
                            <span className="text-red-600 font-black italic">"{itemToDelete?.nama_lengkap}"</span>? <br/>
                            Data yang sudah dihapus tidak dapat dikembalikan.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeletingModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition transform active:scale-95">Ya, Hapus!</button>
                        </div>
                    </div>
                </div>
            )}
            
            <div>
                <footer className="mt-16 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t border-blue-400/20 py-4 px-6 text-center shadow-inner rounded-b-3xl print:hidden">
                    <p className="text-xs font-bold text-blue-100 tracking-wider uppercase">
                        &copy; {new Date().getFullYear()} IKSAN. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}