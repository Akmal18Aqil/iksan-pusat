import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

// --- KONFIGURASI QUILL & IMAGE RESIZE ---
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

// Registrasi modul resize ke Quill
Quill.register('modules/imageResize', ImageResize);
// ------------------------------------------

export default function KajianIndex({ kajians }) {
    const { auth, flash } = usePage().props;
    
    // State UI
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // State Modal
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [itemToRead, setItemToRead] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form Hook
    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '',
        isi: '',
        image: null,
    });

    // Konfigurasi Toolbar & Fitur Resize
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'direction': 'rtl' }, { 'align': [] }], 
            ['link', 'image'],
            ['clean']
        ],
        // MENGAKTIFKAN EDIT UKURAN GAMBAR
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        }
    }), []);

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const blob = items[i].getAsFile();
                setData('image', blob);
                setImagePreview(URL.createObjectURL(blob));
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEditing ? route('kajian.update', editId) : route('kajian.store');
        router.post(url, { ...data, _method: isEditing ? 'patch' : 'post' }, {
            forceFormData: true,
            onSuccess: () => { 
                setShowForm(false); setIsEditing(false); 
                reset(); setImagePreview(null); 
            }
        });
    };

    const handleEdit = (item) => {
        setEditId(item.id); setIsEditing(true); setShowForm(true);
        setData({ judul: item.judul || '', isi: item.isi || '', image: null });
        setImagePreview(item.image ? `/storage/${item.image}` : null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-black text-2xl text-blue-900 uppercase tracking-tighter italic">Portal Kajian Iksan</h2>}>
            <Head title="Kajian Ilmu" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
                .arabic-font { font-family: 'Amiri', serif; }
                .ql-editor { min-height: 300px; font-size: 1.1rem; line-height: 2; border-radius: 0 0 1.5rem 1.5rem; }
                .ql-toolbar { border-radius: 1.5rem 1.5rem 0 0 !important; background: #f8fafc; }
                /* Styling Handle Resize agar terlihat jelas */
                .ql-editor img { cursor: pointer; transition: 0.3s; }
                .ql-editor img:hover { outline: 3px solid #3b82f6; }
            `}</style>

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {flash?.message && (
                        <div className="mb-8 p-5 bg-blue-600 text-white rounded-2xl shadow-xl font-bold animate-fade-in flex items-center">
                            <span className="mr-3 text-xl">✅</span> {flash.message}
                        </div>
                    )}

                    {auth.user.role === 'admin' && (
                        <div className="mb-8 text-right">
                            <button onClick={() => { if(isEditing){setIsEditing(false); reset(); setImagePreview(null);} setShowForm(!showForm); }} 
                                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl transition ${showForm ? 'bg-slate-700 text-white' : 'bg-blue-600 text-white'}`}>
                                {showForm ? '✖ Tutup Panel' : '📝 Tulis Kajian Baru'}
                            </button>
                        </div>
                    )}

                    {/* FORM INPUT */}
                    {showForm && (
                        <div className={`mb-12 p-8 md:p-10 bg-white rounded-[3rem] shadow-2xl border-b-8 transition-all duration-500 animate-fade-in ${isEditing ? 'border-amber-400' : 'border-blue-600'}`}>
                            <h3 className="text-xl font-black text-slate-800 mb-8 uppercase italic underline decoration-blue-500 decoration-4 underline-offset-8">
                                {isEditing ? '⚠️ Edit Postingan' : '📝 Terbitkan Kajian'}
                            </h3>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Thumbnail Utama</label>
                                        <div onClick={() => document.getElementById('image-input').click()} className="w-full h-48 bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all">
                                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <p className="text-slate-400 font-bold uppercase text-[10px]">Pilih Cover</p>}
                                        </div>
                                        <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => { setData('image', e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul Kajian</label>
                                        <input className="w-full rounded-2xl border-slate-200 p-5 font-black text-xl text-blue-900 focus:ring-blue-500" value={data.judul} onChange={e => setData('judul', e.target.value)} placeholder="Ketik judul..." />
                                    </div>
                                </div>

                                <div className="bg-white">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Isi Konten (Klik pada gambar untuk ubah ukuran)</label>
                                    <ReactQuill 
                                        theme="snow" 
                                        value={data.isi} 
                                        onChange={(content) => setData('isi', content)} 
                                        modules={modules} 
                                        className="arabic-font" 
                                    />
                                </div>

                                <div className="text-right">
                                    <button disabled={processing} className={`px-12 py-4 rounded-2xl font-black text-white shadow-xl transform transition hover:-translate-y-1 ${isEditing ? 'bg-amber-500' : 'bg-blue-600 shadow-blue-200'}`}>
                                        {processing ? 'SEDANG PROSES...' : isEditing ? 'UPDATE POSTINGAN' : 'TERBITKAN SEKARANG'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* LIST POSTINGAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {kajians.data.map((item, index) => {
                             const noUrut = (kajians.current_page - 1) * kajians.per_page + index + 1;
                             return (
                                <div key={item.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col group border border-slate-100 hover:shadow-2xl transition-all duration-500">
                                    <div className="h-52 bg-slate-200 relative overflow-hidden">
                                        {item.image ? <img src={`${window.location.origin}/storage/${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" /> : <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-[10px] italic bg-slate-100">Gambar Kosong</div>}
                                        <div className="absolute top-5 left-5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">#{noUrut} Kajian</div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-blue-950 mb-4 line-clamp-2 uppercase italic leading-tight group-hover:text-blue-600 transition-colors">{item.judul}</h3>
                                        <div className="text-slate-500 text-sm line-clamp-3 mb-8 font-medium" dangerouslySetInnerHTML={{ __html: item.isi.replace(/<img[^>]*>/g, "") }}></div>
                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.user.name}</p>
                                            <div className="flex items-center space-x-2">
                                                {auth.user.role === 'admin' && (
                                                    <>
                                                        <button onClick={() => handleEdit(item)} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 transition shadow-sm">✏️</button>
                                                        <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 transition shadow-sm">🗑️</button>
                                                    </>
                                                )}
                                                <button onClick={() => { setItemToRead(item); setIsReadModalOpen(true); }} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-blue-600 transition shadow-lg shadow-blue-100">BACA</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             )
                        })}
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-12 flex justify-center gap-2">
                        {kajians.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${link.active ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-white text-slate-400 hover:bg-blue-100 shadow-sm'}`} />
                            ) : (
                                <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-200 bg-white" />
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL BACA PREMIUM --- */}
            {isReadModalOpen && itemToRead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-md">
                    <div className="absolute inset-0 bg-blue-950/60" onClick={() => setIsReadModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-t-[12px] border-blue-600 animate-scale-up">
                        <div className="p-6 bg-slate-50 border-b flex justify-between items-center shrink-0">
                            <h4 className="font-black uppercase text-sm tracking-widest text-blue-900">Detail Kajian</h4>
                            <button onClick={() => setIsReadModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-black">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 ql-snow">
                            <h2 className="text-3xl md:text-5xl font-black text-blue-950 mb-10 leading-tight italic uppercase border-l-8 border-blue-600 pl-6">{itemToRead.judul}</h2>
                            <div className="ql-editor arabic-font text-slate-700" style={{ fontSize: '1.4rem', lineHeight: '2.8' }} dangerouslySetInnerHTML={{ __html: itemToRead.isi }} />
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL HAPUS --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md transition-all">
                    <div className="absolute inset-0 bg-blue-950/40" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-md border-t-[12px] border-red-500 animate-fade-in">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">🗑️</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic">Hapus Postingan?</h2>
                        <p className="text-slate-500 text-sm font-medium mb-10">"{itemToDelete?.judul}"</p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Batal</button>
                            <button onClick={() => router.delete(route('kajian.destroy', itemToDelete.id), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-red-700 transition">Ya, Hapus</button>
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