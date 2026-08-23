import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrackingWidget from '../components/tracking/TrackingWidget';

export default function TrackingPage() {
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('orden') || searchParams.get('id') || searchParams.get('q') || '';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-red selection:text-white">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full flex flex-col justify-center">
                {/* Hero section for tracking */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-800 text-xs font-black tracking-wide uppercase mb-3 border border-red-200 shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                        Rastreo Satelital & Logístico Nacional
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
                        Sigue Tu Envío en Vivo
                    </h1>
                    <p className="text-gray-600 mt-3 text-base sm:text-lg font-medium">
                        Monitorea tu paquete desde la bodega central hasta la puerta de tu casa.
                    </p>
                </div>

                {/* Tracking Interactive Widget */}
                <TrackingWidget initialQuery={orderNumber} />

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-center">
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-2xl">verified_user</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Pago Seguro al Recibir</h3>
                        <p className="text-xs text-gray-500 mt-1">Verificas que tu producto esté en perfecto estado antes de pagar.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-2xl">local_shipping</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Despacho 24 a 48h</h3>
                        <p className="text-xs text-gray-500 mt-1">Envíos rápidos y asegurados en toda Venezuela sin costo adicional.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-2xl">currency_exchange</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Tasa Oficial BCV</h3>
                        <p className="text-xs text-gray-500 mt-1">Tu pago en Bolívares se cobra a la tasa oficial del día sin recargos.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
