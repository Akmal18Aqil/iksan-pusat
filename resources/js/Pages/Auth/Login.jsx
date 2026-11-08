import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-blue-900 font-sans overflow-x-hidden">
            <Head title="Masuk Ke Sistem IKSAN" />

            {/* --- BAGIAN BRANDING --- */}
            <div className="relative w-full md:w-7/12 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden min-h-[40vh] md:min-h-screen">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
                
                <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-blue-500 rounded-full blur-[80px] md:blur-[120px] opacity-60"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-indigo-600 rounded-full blur-[80px] md:blur-[120px] opacity-60"></div>

                <div className="relative z-10 text-center w-full max-w-2xl">
                    <div className="md:bg-white/10 md:backdrop-blur-md md:border md:border-white/20 p-6 md:p-16 rounded-[3rem] md:shadow-2xl">
                        <div className="flex justify-center mb-6 md:mb-10">
                            {/* Logo Tegak Lurus Tanpa Animasi Miring */}
                            <div className="p-4 md:p-6 bg-white rounded-3xl shadow-2xl">
                                <img 
                                    src="/images/logo-iksan.jpg" 
                                    className="w-16 h-16 md:w-24 md:h-24 object-contain" 
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src="/images/logo_iksan.png";
                                    }} 
                                />
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 md:mb-6 uppercase leading-tight">
                            IKSAN <br className="hidden md:block"/>
                            <span className="text-yellow-400 text-2xl md:text-4xl font-light lowercase italic tracking-normal">Management System</span>
                        </h1>
                        
                        <div className="w-16 md:w-24 h-1.5 md:h-2 bg-yellow-400 mx-auto mb-4 md:mb-8 rounded-full shadow-lg"></div>
                        
                        <p className="text-blue-100 text-sm md:text-xl font-medium leading-relaxed italic px-4">
                            "Menjalin Ukhuwah, Membangun Kemandirian Alumni."
                        </p>
                    </div>
                </div>
            </div>

            {/* --- BAGIAN FORM LOGIN --- */}
            <div className="relative flex-1 flex flex-col justify-between p-4 md:p-16 bg-slate-50 md:bg-white rounded-t-[3rem] md:rounded-t-none shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.3)] md:shadow-none -mt-10 md:mt-0 z-20 min-h-[60vh] md:min-h-screen">
                <div className="hidden md:block h-12"></div>

                <div className="w-full max-w-md mx-auto py-8 md:py-0 flex-1 flex flex-col justify-center">
                    <div className="mb-8 md:mb-12 text-center md:text-left px-4">
                        <h2 className="text-3xl md:text-5xl font-black text-blue-950 tracking-tighter mb-2 leading-none">Portal Masuk</h2>
                        <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-[0.2em]">Otentikasi Akun Alumni</p>
                    </div>

                    <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-3xl shadow-sm md:shadow-none">
                        <form onSubmit={submit} className="space-y-6 md:space-y-8">
                            <div className="group">
                                <label className="text-blue-900 font-black text-[10px] md:text-[11px] uppercase tracking-widest ml-2 mb-2 block">Alamat Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 md:p-5 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-bold text-slate-700 shadow-sm"
                                    placeholder="admin@annur.com"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-2 font-bold ml-2 italic">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="text-blue-900 font-black text-[10px] md:text-[11px] uppercase tracking-widest ml-2 mb-2 block">Kata Sandi</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 md:p-5 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-bold text-slate-700 shadow-sm"
                                    placeholder="••••••••"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-2 font-bold ml-2 italic">{errors.password}</p>}
                            </div>

                            <div className="pt-2 md:pt-4 space-y-4">
                                <button
                                    disabled={processing}
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 uppercase tracking-widest text-sm md:text-base"
                                >
                                    {processing ? 'Loading...' : 'Masuk Dashboard'}
                                    <span className="text-xl">→</span>
                                </button>

                                {/* Tautan ke Halaman Pendaftaran */}
                                <div className="text-center pt-2">
                                    <p className="text-xs font-bold text-slate-500">
                                        Belum punya akun?{' '}
                                        <Link
                                            href={route('register')}
                                            className="font-black text-blue-600 hover:text-blue-800 underline tracking-wide transition ml-1"
                                        >
                                            Daftar sekarang
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="w-full text-center pt-8 pb-4 md:pb-0 border-t border-slate-100 md:border-none">
                    <p className="text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                        &copy; {new Date().getFullYear()} <span className="text-blue-900 font-black">IKSAN</span>. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}