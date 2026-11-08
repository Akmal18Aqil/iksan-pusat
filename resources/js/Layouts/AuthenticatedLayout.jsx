import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ header, children }) {
    // Ambil props secara aman
    const { auth } = usePage().props;
    const user = auth?.user; // Menggunakan tanda tanya (?) agar tidak crash jika user kosong
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Fungsi pembantu untuk mengecek apakah route ada (mencegah blank putih)
    const safeRoute = (name, fallback = '#') => {
        try {
            return route(name);
        } catch (e) {
            console.error(`Route "${name}" tidak ditemukan!`);
            return fallback;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* NAVIGASI UTAMA */}
            <nav className="bg-blue-900 border-b border-blue-800 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
    <Link href="/dashboard">
        <ApplicationLogo className="block h-12 w-auto drop-shadow-md rounded-lg" />
    </Link>
    <div className="ml-3 flex flex-col justify-center border-l border-blue-700 pl-3">
        <span className="text-white font-black text-xl leading-none">IKSAN</span>
        <span className="text-blue-300 text-[9px] uppercase font-bold tracking-widest mt-1">Management System</span>
    </div>
</div>

                            {/* Menu Desktop */}
                            <div className="hidden space-x-6 sm:-my-px sm:ms-10 sm:flex items-center">
                                <NavLink href={safeRoute('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                
                                {/* Dropdown Alumni */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="text-blue-100 font-bold hover:text-white flex items-center text-sm transition">
                                            Alumni
                                            <svg className="ms-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={safeRoute('alumni.index')}>Data Alumni</Dropdown.Link>
                                        <Dropdown.Link href={route('korwil.index')}>Data Korwil</Dropdown.Link> {/* Tambahkan Ini */}
                                        <Dropdown.Link href={safeRoute('alumni.map')}>Peta Alumni</Dropdown.Link>
                                        <Dropdown.Link href={safeRoute('kta.index')}>Layanan KTA</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                <NavLink href={safeRoute('finance.index')} active={route().current('finance.index')}>
                                    Keuangan
                                </NavLink>

                                {/* Dropdown Portal */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="text-blue-100 font-bold hover:text-white flex items-center text-sm transition">
                                            Portal
                                            <svg className="ms-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={safeRoute('kajian')}>Kajian</Dropdown.Link>
                                        <Dropdown.Link href={safeRoute('menulis')}>Menulis</Dropdown.Link>
                                        <Dropdown.Link href={safeRoute('dzikir')}>Dzikir & Doa</Dropdown.Link>
                                        <Dropdown.Link href={safeRoute('kegiatan')}>Kegiatan</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Profil Kanan */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="bg-blue-800 text-white px-4 py-2 rounded-full font-bold text-sm border border-blue-600 hover:bg-blue-700 transition">
                                        {user?.name}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={safeRoute('profile.edit')}>Profil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Keluar</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Tombol Mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="p-2 text-white">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 uppercase tracking-widest">{header}</div>
                </header>
            )}

            {/* ISI HALAMAN */}
            <main>{children}</main>
        </div>
    );
}