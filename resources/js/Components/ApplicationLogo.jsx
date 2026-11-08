export default function ApplicationLogo(props) {
    return (
        /* Opsi A: Menggunakan File Gambar */
        <img 
            {...props} 
            src="/images/logo_iksan.png" 
            alt="Logo Iksan" 
            className={`h-12 w-auto object-contain ${props.className}`} 
            onError={(e) => {
                // Fallback jika gambar tidak ditemukan, tampilkan teks saja
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
            }}
        />

        /* Opsi B: Teks Bergaya (Akan muncul jika gambar di atas tidak ada) */
        /* 
        <div className="flex items-center space-x-2" style={{ display: 'none' }}>
            <div className="bg-white text-blue-900 p-1 rounded-lg font-black text-xl px-3 shadow-md">
                I
            </div>
            <span className="text-white font-bold text-2xl tracking-tighter">IKSAN</span>
        </div> 
        */
    );
}