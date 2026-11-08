import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ korwils }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: '',
        email: '',
        password: '',
        password_confirmation: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        no_hp: '',
        alamat_lengkap: '',
        angkatan: '',
        tahun_keluar: '',
        korwil_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-blue-900 font-sans overflow-x-hidden">
            <Head title="Pendaftaran Akun Alumni" />

            {/* --- BAGIAN KIRI: BRANDING / BANNER --- */}
            <div className="relative w-full md:w-5/12 flex flex-col items-center justify-center p-8 md:p-12 text-center text-white bg-blue-950">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
                
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Pendaftaran <br /><span className="text-yellow-400">Alumni IKSAN</span>
                    </h1>
                    <div className="w-20 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full shadow-lg"></div>
                    <p className="text-blue-100 text-sm md:text-base italic leading-relaxed">
                        "Silakan isi data diri Anda dengan lengkap dan benar untuk mendapatkan ID Anggota Resmi sistem IKSAN secara otomatis."
                    </p>
                </div>
            </div>

            {/* --- BAGIAN KANAN: FORM REGISTRASI LENGKAP --- */}
            <div className="relative flex-1 p-6 md:p-16 bg-slate-50 md:bg-white rounded-t-[3rem] md:rounded-t-none shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.3)] md:shadow-none z-20">
                <div className="max-w-xl mx-auto">
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight">Form Registrasi</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Lengkapi data profil alumni di bawah ini</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={data.nama_lengkap}
                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                            {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.nama_lengkap}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Tempat Lahir</label>
                                <input
                                    type="text"
                                    value={data.tempat_lahir}
                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                    placeholder="Kota Kelahiran"
                                    required
                                />
                                {errors.tempat_lahir && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.tempat_lahir}</p>}
                            </div>
                            <div>
                                <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                    required
                                />
                                {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.tanggal_lahir}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Angkatan (Tahun Masuk)</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 2019"
                                    value={data.angkatan}
                                    onChange={(e) => setData('angkatan', e.target.value)}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                    required
                                />
                                {errors.angkatan && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.angkatan}</p>}
                            </div>
                            <div>
                                <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Tahun Keluar / Lulus</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 2025"
                                    value={data.tahun_keluar}
                                    onChange={(e) => setData('tahun_keluar', e.target.value)}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                    required
                                />
                                {errors.tahun_keluar && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.tahun_keluar}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Pilih Wilayah Korwil</label>
                            <select
                                value={data.korwil_id}
                                onChange={(e) => setData('korwil_id', e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                required
                            >
                                <option value="">-- Pilih Wilayah Korwil --</option>
                                {korwils && korwils.map((korwil) => (
                                    <option key={korwil.id} value={korwil.id}>
                                        {korwil.nama_korwil || korwil.name}
                                    </option>
                                ))}
                            </select>
                            {errors.korwil_id && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.korwil_id}</p>}
                        </div>

                        <div>
                            <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Nomor WhatsApp / HP</label>
                            <input
                                type="text"
                                placeholder="08xxxxxxxxxx"
                                value={data.no_hp}
                                onChange={(e) => setData('no_hp', e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                required
                            />
                            {errors.no_hp && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.no_hp}</p>}
                        </div>

                        <div>
                            <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Alamat Email Aktif</label>
                            <input
                                type="email"
                                placeholder="email@domain.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Kata Sandi</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Konfirmasi Sandi</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                    required
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.password_confirmation}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="text-blue-900 font-black text-[10px] uppercase tracking-widest block mb-1">Alamat Domisili Lengkap</label>
                            <textarea
                                value={data.alamat_lengkap}
                                onChange={(e) => setData('alamat_lengkap', e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition"
                                rows="2"
                                placeholder="Jalan, Desa, Kecamatan, Kabupaten..."
                                required
                            ></textarea>
                            {errors.alamat_lengkap && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.alamat_lengkap}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={processing}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/40 uppercase tracking-widest text-sm transition transform hover:-translate-y-0.5 active:scale-95"
                            >
                                {processing ? 'Memproses Pendaftaran...' : 'Daftar Sekarang →'}
                            </button>
                        </div>

                        <div className="text-center pt-3">
                            <p className="text-xs font-bold text-slate-500">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="font-black text-blue-600 hover:text-blue-800 underline transition ml-1">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}