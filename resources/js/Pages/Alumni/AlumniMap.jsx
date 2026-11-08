import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- PERBAIKAN BUG ICON LEAFLET (Wajib agar marker muncul) ---
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;
// -------------------------------------------------------------

export default function AlumniMap({ alumni = [] }) {
    const [isMounted, setIsMounted] = useState(false);
    
    // Pastikan data berupa array
    const dataAlumni = Array.isArray(alumni) ? alumni : [];

    // 💡 LOGIKA SMART-CENTER: Cari alumni pertama yang punya koordinat valid untuk jadi pusat peta
    const alumniDenganKoordinat = dataAlumni.find(
        item => item.latitude && item.longitude && parseFloat(item.latitude) !== 0
    );

    // Jika ada alumni yang punya koordinat, pakai lokasinya. Jika tidak ada, default ke Malang.
    const centerPosition = alumniDenganKoordinat 
        ? [parseFloat(alumniDenganKoordinat.latitude), parseFloat(alumniDenganKoordinat.longitude)]
        : [-7.9567, 112.6067]; 

    useEffect(() => {
        setIsMounted(true);
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-2 text-blue-900">
                    <span className="text-2xl">🗺️</span>
                    <h2 className="font-black text-xl uppercase tracking-tighter italic">
                        Peta Sebaran Alumni
                    </h2>
                </div>
            }
        >
            <Head title="Mapping Alumni" />

            <style>{`
                .leaflet-container {
                    height: 100% !important;
                    width: 100% !important;
                    z-index: 1 !important;
                }
                .leaflet-pane {
                    z-index: 1 !important;
                }
                .leaflet-top, .leaflet-bottom {
                    z-index: 2 !important;
                }
            `}</style>

            <div className="py-12 bg-slate-50 min-h-screen flex flex-col justify-between">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full mb-auto">
                    
                    <div className="bg-white overflow-hidden shadow-2xl rounded-[2.5rem] border-8 border-white">
                        {/* PANEL INFO SINGKAT */}
                        <div className="p-6 bg-blue-950 text-white flex justify-between items-center border-b-4 border-blue-800">
                            <div>
                                <h3 className="font-bold uppercase tracking-widest text-xs text-blue-300">Live Mapping Geografis</h3>
                                <p className="text-xl font-black">{dataAlumni.length} Anggota Terpetakan</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] bg-blue-600 px-4 py-1.5 rounded-full font-black uppercase tracking-wider">IKSAN SYSTEM</span>
                            </div>
                        </div>

                        {/* CONTAINER PETA */}
                        <div className="h-[600px] w-full relative block bg-slate-200">
                            {isMounted ? (
                                <MapContainer 
                                    center={centerPosition} 
                                    zoom={alumniDenganKoordinat ? 12 : 10} // 💡 Jika ketemu titiknya, otomatis zoom-in agak dekat
                                    scrollWheelZoom={true} 
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    {dataAlumni.map((item, index) => {
                                        // Konversi string ke float angka desimal
                                        const lat = parseFloat(item.latitude);
                                        const lng = parseFloat(item.longitude);
                                        
                                        // Jika koordinat kosong, ngawur, atau bernilai 0, jangan tampilkan pinnya
                                        if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

                                        return (
                                            <Marker 
                                                key={index} 
                                                position={[lat, lng]}
                                            >
                                                <Popup>
                                                    <div className="p-2 min-w-[180px]">
                                                        <div className="font-black text-blue-950 uppercase text-sm tracking-tight leading-tight mb-0.5">
                                                            {item.nama_lengkap || 'Tanpa Nama'}
                                                        </div>
                                                        
                                                        <div className="text-[9px] font-black text-blue-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded uppercase inline-block mb-3">
                                                            🎓 Angkatan {item.angkatan || '-'}
                                                        </div>

                                                        <div className="border-t pt-2.5">
                                                            <a 
                                                                href={`https://wa.me/${item.no_hp || ''}`} 
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600 text-white px-3 py-2 rounded-xl text-center font-black text-[10px] uppercase tracking-wider block hover:bg-blue-700 shadow-md shadow-blue-100 transition !text-white"
                                                            >
                                                                📱 Hubungi via WA
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}
                                </MapContainer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-bold gap-2">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs uppercase tracking-widest animate-pulse">Menyiapkan Engine Peta...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}