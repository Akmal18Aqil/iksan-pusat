import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [showRestrictedModal, setShowRestrictedModal] = useState(false);

    // Data Fitur Iksan
    const menus = [
        { name: 'Data Alumni', desc: 'Direktori lengkap database', icon: '👥', link: 'alumni.index', color: 'from-blue-600 to-blue-500 shadow-blue-500/20' },
        { name: 'Data Korwil', desc: 'Pemetaan alumni tiap wilayah', icon: '📍', link: 'korwil.index', color: 'from-blue-700 to-indigo-600 shadow-indigo-500/20' },
        { name: 'Mapping Alamat', desc: 'Visualisasi lokasi di peta', icon: '🗺️', link: 'alumni.map', color: 'from-cyan-600 to-teal-500 shadow-cyan-500/20' },
        { name: 'Cetak KTA', desc: 'Kartu Tanda Anggota Digital', icon: '🪪', link: 'kta.index', color: 'from-indigo-700 to-blue-800 shadow-indigo-500/20' },
        { name: 'Donatur & Laporan', desc: 'Transparansi dana & donasi', icon: '💰', link: 'finance.index', color: 'from-emerald-600 to-green-500 shadow-emerald-500/20' },
        { name: 'Kajian Ilmu', desc: 'Kajian kitab dari pengasuh', icon: '📖', link: 'kajian', color: 'from-teal-600 to-emerald-500 shadow-teal-500/20' },
        { name: 'Alumni Menulis', desc: 'Wadah karya tulis alumni', icon: '✍️', link: 'menulis', color: 'from-sky-600 to-blue-400 shadow-sky-500/20' },
        { name: 'Ruang Kegiatan', desc: 'Agenda & dokumentasi acara', icon: '🏛️', link: 'kegiatan', color: 'from-indigo-600 to-purple-500 shadow-purple-500/20' },
        { name: 'Dzikir & Doa', desc: 'Amalan, aurad, dan doa harian', icon: '📿', link: 'dzikir', color: 'from-blue-800 to-indigo-900 shadow-blue-900/20' },
        { name: 'Komoditi Bisnis', desc: 'Ekosistem ekonomi alumni', icon: '🛒', link: 'bisnis', color: 'from-orange-600 to-amber-500 shadow-orange-500/20' },
        { name: 'AD ART Iksan', desc: 'Landasan dasar organisasi', icon: '⚖️', link: 'organisasi', color: 'from-slate-700 to-slate-600 shadow-slate-500/20' },
        { name: 'Peraturan', desc: 'Pedoman administrasi & aturan', icon: '📜', link: 'organisasi', color: 'from-slate-600 to-slate-500 shadow-slate-500/20' },
        { name: 'Aset Iksan', desc: 'Daftar inventaris & wakaf', icon: '🏗️', link: 'asset', color: 'from-blue-900 to-slate-800 shadow-blue-900/20' },
    ];

    // 🔑 MENU MANAJEMEN USER
    if (auth.user.role !== 'alumni') {
        menus.push({ 
            name: 'Manajemen User', 
            desc: 'Kelola akun login & password', 
            icon: '🔐', 
            link: 'users.index', 
            color: 'from-blue-600 to-indigo-700 shadow-blue-600/20' 
        });
    }

    const getSafeRoute = (name) => {
        try { return route(name); } catch (e) { return '#'; }
    };

    // Handler klik menu dengan Popup Modern
    const handleMenuClick = (e, menuName) => {
        if (menuName === 'Donatur & Laporan' && auth.user.role === 'alumni') {
            e.preventDefault();
            setShowRestrictedModal(true);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-2 text-blue-950">
                    <span className="text-xl">🏠</span>
                    <h2 className="font-black text-lg uppercase tracking-tighter italic">Pusat Kendali Utama</h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="relative py-8 md:py-12 bg-slate-50 min-h-screen flex flex-col justify-between overflow-hidden">
                
                {/* Aksen Background Halus ala Android Modern */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-20 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-auto relative z-10">
                    
                    {/* BANNER WELCOME MODERNISED */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 rounded-[2.5rem] p-6 md:p-10 mb-8 shadow-xl text-white border border-blue-800/30">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xl md:text-2xl text-yellow-400 shadow-inner uppercase">
                                    {auth.user.name ? auth.user.name.substring(0, 2) : 'US'}
                                </div>
                                <div>
                                    <span className="bg-blue-400/20 text-blue-200 py-0.5 px-3 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
                                        Iksan Management System
                                    </span>
                                    <h1 className="text-2xl md:text-4xl font-black text-white mt-1 tracking-tight">
                                        Selamat Datang, <span className="text-yellow-400">{auth.user.name}</span>
                                    </h1> 
                                    <p className="text-blue-200/80 mt-0.5 text-xs md:text-sm font-medium italic">
                                        "Khidmah alumni untuk almamater dan umat."
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex md:flex-col justify-between items-center md:items-end min-w-[140px]">
                                <span className="text-blue-300 text-[9px] uppercase font-black tracking-wider">Akses Masuk</span>
                                <span className="text-yellow-400 text-base md:text-lg font-black tracking-tighter uppercase">{auth.user.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* INTERFACE GRID MENU */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {menus.map((menu, index) => (
                            <Link 
                                key={index} 
                                href={getSafeRoute(menu.link)}
                                onClick={(e) => handleMenuClick(e, menu.name)}
                                className="group bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100/80 hover:shadow-xl active:scale-95 transition-all duration-200 flex flex-col items-center text-center justify-between min-h-[160px] md:min-h-[180px]"
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${menu.color} text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    {menu.icon}
                                </div>

                                <div className="mt-3 flex-1 flex flex-col justify-center">
                                    <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight group-hover:text-blue-700 transition-colors px-1">
                                        {menu.name}
                                    </h3>
                                    <p className="text-slate-400 font-medium text-[10px] md:text-xs mt-1 px-2 line-clamp-2 hidden sm:block">
                                        {menu.desc}
                                    </p>
                                </div>

                                <div className="w-6 h-1 bg-slate-100 group-hover:bg-blue-600 group-hover:w-10 rounded-full mt-3 transition-all duration-300"></div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* --- MODAL POPUP AKSES TERBATAS YANG ESTETIK --- */}
                {showRestrictedModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/50 animate-fade-in">
                        <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 text-center border-t-8 border-amber-500 animate-scale-up">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
                                🔒
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase italic tracking-tight">Akses Terbatas</h3>
                            <p className="text-slate-500 text-xs font-semibold mb-6">
                                Menu <span className="text-blue-900 font-bold">Donatur & Laporan</span> khusus dikelola oleh administrator pusat.
                            </p>
                            <button 
                                onClick={() => setShowRestrictedModal(false)}
                                className="w-full py-3.5 bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition transform active:scale-95"
                            >
                                Mengerti / Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* --- FOOTER --- */}
                <footer className="mt-16 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t border-blue-400/20 py-4 px-6 text-center shadow-inner rounded-b-3xl print:hidden relative z-10">
                    <p className="text-xs font-bold text-blue-100 tracking-wider uppercase">
                        &copy; {new Date().getFullYear()} IKSAN. All Rights Reserved.
                    </p>
                </footer>

            </div>
        </AuthenticatedLayout>
    );
}