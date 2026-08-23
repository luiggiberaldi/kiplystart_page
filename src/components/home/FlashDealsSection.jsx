import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, Zap, ArrowRight, Truck } from 'lucide-react';
import ProductCard from '../ProductCard';

export default function FlashDealsSection({ products = [] }) {
    // Real-time Countdown to midnight (local time)
    const [timeLeft, setTimeLeft] = useState({ hours: '04', minutes: '28', seconds: '45' });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(23, 59, 59, 999);
            const diff = Math.max(0, midnight - now);

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                hours: String(h).padStart(2, '0'),
                minutes: String(m).padStart(2, '0'),
                seconds: String(s).padStart(2, '0'),
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    // Filter deals or top 4 products
    const flashItems = products.slice(0, 4);
    if (flashItems.length === 0) return null;

    return (
        <section className="bg-gradient-to-br from-amber-500/10 via-red-500/5 to-slate-50 border-2 border-amber-200/80 rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand-red/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header: Urgency & Timer */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red text-white text-[11px] font-black uppercase tracking-wider mb-2 shadow-xs animate-pulse">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>Ofertas Relámpago del Día</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                        Descuentos con Despacho Inmediato
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
                        Precios especiales válidos solo para pedidos registrados antes de medianoche.
                    </p>
                </div>

                {/* Countdown Box */}
                <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-md shrink-0 self-start md:self-auto">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-300">Termina en:</span>
                    <div className="flex items-center gap-1 font-mono font-black text-sm sm:text-base text-amber-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md">{timeLeft.hours}h</span>
                        <span>:</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md">{timeLeft.minutes}m</span>
                        <span>:</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md text-white">{timeLeft.seconds}s</span>
                    </div>
                </div>
            </div>

            {/* Scarcity Progress Bar */}
            <div className="mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-amber-200/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Zap className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                    <span>🔥 <strong>84%</strong> del inventario asignado para envío gratis hoy ya fue reservado.</span>
                </div>
                <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div className="bg-gradient-to-r from-amber-500 to-brand-red h-full rounded-full w-[84%] transition-all duration-1000"></div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {flashItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Footer View All CTA */}
            <div className="mt-6 text-center">
                <Link
                    to="/catalogo"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A2463] hover:bg-[#081b4b] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#0A2463]/20 transition-all hover:gap-3 cursor-pointer"
                >
                    <span>Ver Todas las Ofertas con Envío Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
