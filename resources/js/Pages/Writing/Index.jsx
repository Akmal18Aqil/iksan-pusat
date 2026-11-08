import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);

export default function WritingIndex({ writings }) {
    const { auth, flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [itemToRead, setItemToRead] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '', isi: '', image: null,
    });

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

    const submit = (e) => {
        e.preventDefault();
        const url = isEditing ? route('writing.update', editId) : route('writing.store');
        router.post(url, { ...data, _method: isEditing ? 'patch' : 'post' }, {
            forceFormData: true,
            onSuccess: () => { setShowForm(false); setIsEditing(false); reset(); setImagePreview(null); }
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">Wadah Alumni Menulis</h2>}>
            <Head title="Alumni Menulis" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
                .arabic-font { font-family: 'Amiri', serif; }
                .ql-editor { min-height: 250px; font-size: 1.1rem; }
            `}</style>

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.message && <div className="mb-8 p-5 bg-blue-600 text-white rounded-2xl shadow-xl font-bold italic animate-fade-in">✅ {flash.message}</div>}

                    <div className="mb-8 text-right">
                        <button onClick={() => { if(isEditing){setIsEditing(false); reset();} setShowForm(!showForm); }} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 transition transform hover:scale-105">
                            {showForm ? '✖ Tutup' : '✍️ Mulai Menulis'}
                        </button>
                    </div>

                    {showForm && (
                        <div className={`mb-12 p-8 md:p-10 bg-white rounded-[3rem] shadow-2xl border-b-8 transition-all duration-500 animate-fade-in ${isEditing ? 'border-amber-400' : 'border-blue-600'}`}>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1">
                                        <div onClick={() => document.getElementById('image-input').click()} className="w-full h-48 bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all">
                                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <p className="text-slate-400 font-bold uppercase text-[10px]">Klik Upload Cover</p>}
                                        </div>
                                        <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => { setData('image', e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Judul Artikel</label>
                                        <input className="w-full rounded-2xl border-slate-200 p-5 font-black text-xl text-blue-900 focus:ring-blue-500" value={data.judul} onChange={e => setData('judul', e.target.value)} placeholder="Tuliskan judul artikel..." />
                                    </div>
                                </div>
                                <div className="bg-white">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">Isi Artikel (Mendukung Teks Arab & Gambar)</label>
                                    <ReactQuill theme="snow" value={data.isi} onChange={(content) => setData('isi', content)} modules={modules} className="arabic-font" />
                                </div>
                                <div className="text-right"><button disabled={processing} className="bg-blue-600 px-12 py-4 rounded-2xl font-black text-white shadow-xl hover:bg-blue-700">{isEditing ? 'UPDATE' : 'TERBITKAN'}</button></div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {writings.data.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col group border border-slate-100 hover:shadow-2xl transition-all">
                                <div className="h-52 bg-slate-200 overflow-hidden relative">
                                    {item.image ? <img src={`/storage/${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" /> : <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-[10px] italic bg-slate-100">Tanpa Cover</div>}
                                    <div className="absolute top-5 left-5 bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Karya Alumni</div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-blue-950 mb-4 line-clamp-2 uppercase italic leading-tight">{item.judul}</h3>
                                    <div className="text-slate-500 text-sm line-clamp-3 mb-8" dangerouslySetInnerHTML={{ __html: item.isi.replace(/<img[^>]*>/g, "") }}></div>
                                    <div className="mt-auto pt-6 border-t flex justify-between items-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">Oleh: {item.user.name}</p>
                                        <div className="flex gap-2">
                                            {(auth.user.role === 'admin' || auth.user.id === item.user_id) && (
                                                <>
                                                    <button onClick={() => { setEditId(item.id); setIsEditing(true); setShowForm(true); setData({judul: item.judul, isi: item.isi}); setImagePreview(item.image ? `/storage/${item.image}` : null); window.scrollTo({top:0, behavior:'smooth'}); }} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition shadow-sm">✏️</button>
                                                    <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm">🗑️</button>
                                                </>
                                            )}
                                            <button onClick={() => { setItemToRead(item); setIsReadModalOpen(true); }} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-[9px] font-black hover:bg-blue-600 transition shadow-lg">BACA</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-12 flex justify-center gap-2">
                        {writings.links.map((link, i) => (
                            link.url ? <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black ${link.active ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-400 shadow-sm'}`} /> : 
                            <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-200 bg-white" />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL BACA & HAPUS (Gunakan logika yang sama dengan Kajian) --- */}
            {isReadModalOpen && itemToRead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-md">
                    <div className="absolute inset-0 bg-blue-950/60" onClick={() => setIsReadModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-t-[12px] border-blue-600 animate-scale-up">
                        <div className="p-6 bg-slate-50 border-b flex justify-between items-center shrink-0">
                            <h4 className="font-black uppercase text-sm tracking-widest text-blue-900 italic">Karya Alumni Iksan</h4>
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
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Hapus Postingan?</h2>
                        <p className="text-slate-500 text-sm font-medium mb-10 italic">"{itemToDelete?.judul}"</p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Batal</button>
                            <button onClick={() => router.delete(route('writing.destroy', itemToDelete.id), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-red-700 transition transform active:scale-95">Ya, Hapus</button>
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