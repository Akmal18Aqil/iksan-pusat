import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

if (!Quill.imports['modules/imageResize']) {
    Quill.register('modules/imageResize', ImageResize);
}

export default function BusinessIndex({ businesses, filters }) {
    const { auth, flash } = usePage().props;
    
    // State Manajemen UI & Pencarian
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');

    // State Kontrol Modal Dialog
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [itemToRead, setItemToRead] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // React Inertia Form Hook (Menggunakan judul dan isi sesuai model bisnis)
    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '', isi: '', image: null,
    });

    // Konfigurasi Toolbar Rich Text Editor (ReactQuill)
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'direction': 'rtl' }, { 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
        imageResize: { modules: ['Resize', 'DisplaySize', 'Toolbar'] }
    }), []);

    // Efek Debounce untuk Pencarian Otomatis
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('business.index'), 
                { search: search }, 
                { preserveState: true, replace: true }
            );
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Proses Submit (Tambah Baru & Patch Perbaruan Data)
    const submit = (e) => {
        e.preventDefault();
        const url = isEditing ? route('business.update', editId) : route('business.store');
        
        router.post(url, { ...data, _method: isEditing ? 'patch' : 'post' }, {
            forceFormData: true,
            onSuccess: () => { 
                setShowForm(false); 
                setIsEditing(false); 
                reset(); 
                setImagePreview(null); 
            }
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">Komoditi Bisnis Alumni</h2>}>
            <Head title="Komoditi Bisnis" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
                .arabic-font { font-family: 'Amiri', serif; }
                .ql-editor { min-height: 250px; font-size: 1.1rem; line-height: 1.75; }
                .ql-editor img { max-width: 100%; height: auto; border-radius: 1rem; }
            `}</style>

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* TOAST NOTIFIKASI BERHASIL */}
                    {flash?.message && (
                        <div className="mb-8 p-5 bg-blue-600 text-white rounded-2xl shadow-xl font-bold italic animate-fade-in flex items-center">
                            <span className="mr-3 text-xl">✅</span> {flash.message}
                        </div>
                    )}

                    {/* BAR PANEL ATAS: PENCARIAN & TOMBOL TAMBAH */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                🔍
                            </span>
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari komoditi atau isi bisnis..."
                                className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-red-500 font-bold text-xs uppercase">
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* TOMBOL TAMBAH (Terbuka untuk semua user login / Alumni & Admin) */}
                        {auth.user && (
                            <div className="text-right w-full md:w-auto">
                                <button onClick={() => { if(isEditing){setIsEditing(false); reset(); setImagePreview(null);} setShowForm(!showForm); }} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 transition transform hover:scale-105">
                                    {showForm ? '✖ Tutup' : '🛒 Tambah Komoditi'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* PANEL FORM INPUT / EDIT PRODUK */}
                    {showForm && (
                        <div className={`mb-12 p-8 md:p-10 bg-white rounded-[3rem] shadow-2xl border-b-8 transition-all duration-500 animate-fade-in ${isEditing ? 'border-amber-400' : 'border-blue-600'}`}>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cover / Foto Produk</label>
                                        <div onClick={() => document.getElementById('image-input').click()} className="w-full h-48 bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all">
                                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : <p className="text-slate-400 font-bold uppercase text-[10px]">Klik Upload Cover</p>}
                                        </div>
                                        <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => { setData('image', e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Usaha / Komoditi</label>
                                        <input className="w-full rounded-2xl border-slate-200 p-5 font-black text-xl text-blue-900 focus:ring-blue-500" value={data.judul} onChange={e => setData('judul', e.target.value)} placeholder="Tuliskan nama usaha atau komoditi..." required />
                                    </div>
                                </div>
                                <div className="bg-white">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">Deskripsi Detail (Mendukung Teks Arab & Gambar)</label>
                                    <ReactQuill theme="snow" value={data.isi} onChange={(content) => setData('isi', content)} modules={modules} className="arabic-font" />
                                </div>
                                <div className="text-right">
                                    <button disabled={processing} className="bg-blue-600 px-12 py-4 rounded-2xl font-black text-white shadow-xl hover:bg-blue-700 transition">
                                        {processing ? 'MEMPROSES...' : isEditing ? 'UPDATE KOMODITI' : 'TERBITKAN USAHA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* DISPLAY GRID DATA KOMODITI BISNIS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {businesses.data.length > 0 ? businesses.data.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col group border border-slate-100 hover:shadow-2xl transition-all">
                                <div className="h-52 bg-slate-200 overflow-hidden relative">
                                    {item.image ? <img src={`${window.location.origin}/storage/${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={item.judul} /> : <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-[10px] italic bg-slate-100">Tanpa Cover</div>}
                                    <div className="absolute top-5 left-5 bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Alumni Business</div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-blue-950 mb-4 line-clamp-2 uppercase italic leading-tight">{item.judul}</h3>
                                    <div className="text-slate-500 text-sm line-clamp-3 mb-8" dangerouslySetInnerHTML={{ __html: item.isi.replace(/<img[^>]*>/g, "") }}></div>
                                    <div className="mt-auto pt-6 border-t flex justify-between items-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">Oleh: {item.user?.name || 'Admin Pusat'}</p>
                                        <div className="flex gap-2">
                                            {/* TOMBOL EDIT & HAPUS: Muncul jika Admin ATAU pemilik bisnis tersebut */}
                                            {auth.user && (auth.user.role === 'admin' || auth.user.id === item.user_id) && (
                                                <>
                                                    <button onClick={() => { setEditId(item.id); setIsEditing(true); setShowForm(true); setData({judul: item.judul, isi: item.isi}); setImagePreview(item.image ? `/storage/${item.image}` : null); window.scrollTo({top:0, behavior:'smooth'}); }} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition shadow-sm" title="Edit Bisnis">✏️</button>
                                                    <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm" title="Hapus Bisnis">🗑️</button>
                                                </>
                                            )}
                                            <button onClick={() => { setItemToRead(item); setIsReadModalOpen(true); }} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-[9px] font-black hover:bg-blue-600 transition shadow-lg">DETAIL</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-24 bg-white rounded-[4rem] text-slate-300 font-black border-4 border-dashed border-slate-100 italic uppercase tracking-widest text-sm">
                                Data Bisnis Tidak Ditemukan
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-12 flex justify-center gap-2">
                        {businesses.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url} 
                                    data={{ search: search }} 
                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                    className={`px-5 py-2.5 rounded-2xl text-[10px] font-black ${link.active ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-400 shadow-sm'}`} 
                                />
                            ) : (
                                <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-200 bg-white" />
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL BACA DETAIL */}
            {isReadModalOpen && itemToRead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-md">
                    <div className="absolute inset-0 bg-blue-950/60" onClick={() => setIsReadModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-t-[12px] border-blue-600 animate-scale-up">
                        <div className="p-6 bg-slate-50 border-b flex justify-between items-center shrink-0">
                            <h4 className="font-black uppercase text-sm tracking-widest text-blue-900 italic">Profil Komoditi Bisnis Iksan</h4>
                            <button onClick={() => setIsReadModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-black">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 ql-snow">
                            <h2 className="text-3xl md:text-5xl font-black text-blue-950 mb-10 leading-tight italic uppercase tracking-tighter border-l-8 border-blue-600 pl-6">{itemToRead.judul}</h2>
                            <div className="ql-editor arabic-font text-slate-700" style={{ fontSize: '1.4rem', lineHeight: '2.8' }} dangerouslySetInnerHTML={{ __html: itemToRead.isi }} />
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="absolute inset-0 bg-blue-950/40" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-md border-t-[12px] border-red-500 animate-fade-in">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">🗑️</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Hapus Komoditi?</h2>
                        <p className="text-slate-500 text-sm font-medium mb-10 italic">"{itemToDelete?.judul}"</p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Batal</button>
                            <button onClick={() => router.delete(route('business.destroy', itemToDelete.id), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-red-700 transition transform active:scale-95">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            <div>
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