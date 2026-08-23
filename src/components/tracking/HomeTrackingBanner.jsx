import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeTrackingBanner() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleTrack = (e) => {
        e.preventDefault();
        const clean = query.trim();
        if (!clean) return;
        navigate(`/rastreo?q=${encodeURIComponent(clean)}`);
    };

    return (
        <section className="px-6 py-8">
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                {/* Background glow circle */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-red/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left max-w-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold mb-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            Rastreador Satelital 24/7
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            ¿Ya hiciste un pedido?
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                            Ingresa tu número de orden o teléfono para ver dónde está tu repartidor en tiempo real.
                        </p>
                    </div>

                    <form onSubmit={handleTrack} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ej: KS-20260822-4921 o teléfono..."
                            className="w-full sm:w-72 px-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white focus:outline-none text-xs sm:text-sm font-medium transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3.5 bg-brand-red hover:bg-brand-red/90 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-red/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                            <span>Rastrear</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
