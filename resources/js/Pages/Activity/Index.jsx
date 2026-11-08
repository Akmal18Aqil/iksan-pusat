import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ photos = { data: [] }, videos = { data: [] } }) {
    const { auth, flash } = usePage().props;
    
    // Membaca query string di URL untuk mendeteksi halaman pagination aktif otomatis setelah reload
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.has('video_page') ? 'video' : 'foto';

    const [activeTab, setActiveTab] = useState(initialTab); 
    const [showForm, setShowForm] = useState(false);
    
    // STATE UNTUK MODE EDIT
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // STATE UNTUK MODAL KONFIRMASI HAPUS
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '', deskripsi: '', kategori: 'foto', foto: null, video_url: ''
    });

    // SINKRONISASI FORM DENGAN TAB
    useEffect(() => {
        if (!isEditMode) {
            setData('kategori', activeTab);
        }
    }, [activeTab, isEditMode]);

    // FUNGSI MEMBUKA FORM UNTUK EDIT
    const openEditMode = (item) => {
        setEditId(item.id);
        setIsEditMode(true);
        setShowForm(true);
        
        setData({
            judul: item.judul,
            deskripsi: item.deskripsi || '',
            kategori: String(item.kategori).toLowerCase(),
            foto: null,
            video_url: String(item.kategori).toLowerCase() === 'video' ? item.media_url : ''
        });
        
        setActiveTab(String(item.kategori).toLowerCase());
    };

    // FUNGSI SUBMIT (HANDLE TAMBAH & UPDATE)
    const submit = (e) => {
        e.preventDefault();
        
        if (isEditMode) {
            // Menggunakan FormData eksplisit agar bypass kendala _method PATCH di Laravel saat upload file
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            formData.append('judul', data.judul);
            formData.append('deskripsi', data.deskripsi || '');
            formData.append('kategori', activeTab);
            
            if (activeTab === 'foto' && data.foto) {
                formData.append('foto', data.foto);
            } else if (activeTab === 'video') {
                formData.append('video_url', data.video_url);
            }

            router.post(route('activity.update', editId), formData, {
                forceFormData: true,
                onSuccess: () => { 
                    setShowForm(false); 
                    setIsEditMode(false);
                    setEditId(null);
                    reset(); 
                },
            });
        } else {
            router.post(route('activity.store'), {
                ...data,
                kategori: activeTab
            }, {
                forceFormData: true,
                onSuccess: () => { setShowForm(false); reset(); },
            });
        }
    };

    // FUNGSI MEMBUKA MODAL HAPUS
    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    // FUNGSI EKSEKUSI HAPUS DATA VIA INERTIA
    const executeDelete = () => {
        if (itemToDelete) {
            router.delete(route('activity.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                }
            });
        }
    };

    // Menentukan paginator mana yang aktif berdasarkan tab saat ini
    const currentPaginator = activeTab === 'foto' ? photos : videos;
    const currentItems = currentPaginator.data || [];

    // KOMPONEN RENDER NAVIGASI PAGINATION
    const RenderPagination = ({ links }) => {
        if (!links || links.length <= 3) return null; // Sembunyikan jika data hanya ada 1 halaman
        
        return (
            <div className="mt-12 flex justify-center items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md w-fit mx-auto border border-slate-100">
                {links.map((link, index) => {
                    let label = link.label;
                    if (label.includes('Previous')) label = '«';
                    if (label.includes('Next')) label = '»';

                    return link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                link.active 
                                    ? activeTab === 'foto' ? 'bg-blue-600 text-white shadow-md' : 'bg-red-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    ) : (
                        <span
                            key={index}
                            className="px-4 py-2 text-xs font-black text-slate-300 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <AuthenticatedLayout 
            header={<h2 className="font-black text-2xl text-blue-900 uppercase italic">Ruang Kegiatan</h2>}
        >
            <Head title="Kegiatan" />
            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* TAB NAVIGASI */}
                    <div className="flex justify-center mb-10 gap-4 bg-white p-2 rounded-full shadow-lg w-fit mx-auto border">
                        <button onClick={() => {setActiveTab('foto'); setShowForm(false); setIsEditMode(false); reset();}} className={`px-10 py-3 rounded-full font-black text-xs uppercase transition-all ${activeTab === 'foto' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>🖼️ Album Foto</button>
                        <button onClick={() => {setActiveTab('video'); setShowForm(false); setIsEditMode(false); reset();}} className={`px-10 py-3 rounded-full font-black text-xs uppercase transition-all ${activeTab === 'video' ? 'bg-red-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>🎬 Album Video</button>
                    </div>

                    {/* TOMBOL TAMBAH / CONTROL PANEL */}
                    {auth.user.role === 'admin' && (
                        <div className="mb-10 text-center">
                            <button 
                                onClick={() => {
                                    if(showForm) {
                                        setShowForm(false);
                                        setIsEditMode(false);
                                        reset();
                                    } else {
                                        setShowForm(true);
                                    }
                                }} 
                                className={`px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 text-white ${
                                    showForm ? 'bg-slate-700' : activeTab === 'foto' ? 'bg-blue-900 shadow-blue-300' : 'bg-red-900 shadow-red-300'
                                }`}
                            >
                                {showForm ? '✖ Tutup Panel' : `➕ Tambah ${activeTab.toUpperCase()}`}
                            </button>
                        </div>
                    )}

                    {/* FORM INPUT / EDIT */}
                    {showForm && (
                        <div className={`mb-16 p-10 bg-white rounded-[3rem] shadow-2xl border-b-8 max-w-2xl mx-auto animate-fade-in ${activeTab === 'foto' ? 'border-blue-600' : 'border-red-600'}`}>
                            <form onSubmit={submit} className="space-y-6">
                                <h3 className="font-black text-center text-xl uppercase text-slate-800">
                                    {isEditMode ? `⚙️ Edit Data Album ${activeTab}` : `Input ke Album ${activeTab}`}
                                </h3>
                                
                                <input className="w-full rounded-2xl border-slate-200 p-4 font-bold focus:ring-blue-500 shadow-sm" placeholder="Judul..." value={data.judul} onChange={e => setData('judul', e.target.value)} required />
                                
                                {activeTab === 'foto' ? (
                                    <div className="bg-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 text-center">
                                        <input type="file" className="w-full text-xs" onChange={e => setData('foto', e.target.files[0])} accept="image/*" required={!isEditMode} />
                                        {isEditMode && <p className="text-[10px] text-blue-500 mt-2 italic">*Kosongkan jika tidak ingin mengubah foto lama</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <input className="w-full rounded-2xl border-slate-200 p-4 font-bold focus:ring-red-500 shadow-sm" placeholder="URL Video YouTube" value={data.video_url} onChange={e => setData('video_url', e.target.value)} required />
                                        <p className="text-[10px] mt-2 text-slate-400 italic">Contoh: https://www.youtube.com/watch?v=XXXXX</p>
                                    </div>
                                )}

                                <textarea className="w-full rounded-2xl border-slate-200 p-4 font-medium" placeholder="Deskripsi..." value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)}></textarea>
                                
                                <button disabled={processing} className={`w-full py-4 rounded-2xl font-black text-white shadow-xl ${activeTab === 'foto' ? 'bg-blue-600' : 'bg-red-600'}`}>
                                    {processing ? 'SEDANG PROSES...' : isEditMode ? '⚙️ PERBARUI DATA' : 'SIMPAN SEKARANG'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* GRID DISPLAY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {currentItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col group hover:shadow-2xl transition-all duration-500">
                                <div className="aspect-video relative overflow-hidden bg-slate-900">
                                    {String(item.kategori).toLowerCase() === 'foto' ? (
                                        <img src={`/storage/${item.media_url}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
                                    ) : (
                                        <iframe 
                                            className="w-full h-full border-0" 
                                            src={`${item.media_url.replace('youtube.com', 'youtube-nocookie.com')}?origin=${window.location.origin}`} 
                                            title={item.judul}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                    
                                    {/* PANEL KONTROL ADMIN (EDIT & HAPUS) */}
                                    {auth.user.role === 'admin' && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                            <button 
                                                type="button"
                                                onClick={() => openEditMode(item)}
                                                className="bg-amber-500 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-amber-600 transform hover:scale-110 transition-all text-sm"
                                                title="Edit Data"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => openDeleteModal(item)} 
                                                className="bg-red-600 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transform hover:scale-110 transition-all text-sm"
                                                title="Hapus Data"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-1">
                                    <h3 className="font-black text-blue-900 uppercase italic text-lg mb-3 leading-tight">{item.judul}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{item.deskripsi || 'Tidak ada deskripsi.'}</p>
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                        <span>#{item.kategori}</span>
                                        <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* JIKA DATA KOSONG */}
                    {currentItems.length === 0 && (
                        <div className="py-32 bg-white rounded-[4rem] text-center border-4 border-dashed border-slate-100 font-black text-slate-300 uppercase italic tracking-widest text-lg">
                            Album {activeTab} Belum Tersedia
                        </div>
                    )}

                    {/* RENDER NAVIGASI PAGINATION */}
                    <RenderPagination links={currentPaginator.links} />

                </div>
            </div>

            {/* --- MODAL KONFIRMASI HAPUS --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center animate-scale-up border-t-8 border-red-500">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                            🗑️
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Konfirmasi Hapus</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                            Apakah Anda yakin ingin menghapus data dari album ini? <br/>
                            <span className="text-red-600 font-black italic">"{itemToDelete?.judul}"</span>? <br/>
                            Data yang sudah dihapus tidak dapat dikembalikan.
                        </p>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Batal</button>
                            <button type="button" onClick={executeDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition transform active:scale-95">Ya, Hapus!</button>
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