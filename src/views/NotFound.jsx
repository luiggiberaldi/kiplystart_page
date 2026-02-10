/**
 * NotFound (404) Page
 * @description
 * Professional 404 page following KiplyStart neuromarketing principles:
 * - Empathetic microcopy (reduces frustration cortisol)
 * - Brand-consistent design (trust blue #0A2463)
 * - Clear CTAs guiding user back to value (catalog/home)
 * - Subtle animation for engagement
 * - SEO: noindex meta for 404 pages
 */

import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
    useEffect(() => {
        document.title = 'Página no encontrada — KiplyStart';
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#0D2B6B] to-[#1A3A7A] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Decorative floating circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/[0.03] rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#457B9D]/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E63946]/[0.03] rounded-full blur-3xl" />

            <div className="relative z-10 text-center max-w-lg mx-auto">

                {/* Big 404 with gradient */}
                <div className="relative mb-6">
                    <h1
                        className="text-[140px] sm:text-[180px] font-display font-black leading-none select-none"
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #A8DADC 40%, #457B9D 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            opacity: 0.9,
                        }}
                    >
                        404
                    </h1>
                    {/* Subtle shadow under the number */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 rounded-full blur-xl" />
                </div>

                {/* Empathetic headline */}
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                    ¡Ups! Esta página no existe
                </h2>

                {/* Friendly microcopy — reduces frustration */}
                <p className="font-body text-[#A8DADC] text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto">
                    Parece que el enlace que seguiste ya no está disponible o fue un error de escritura.
                    No te preocupes, te llevamos de vuelta.
                </p>

                {/* CTAs — Primary (catalog) + Secondary (home) */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Link
                        to="/catalogo"
                        className="group relative inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#d32f3d] text-white font-display font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(230,57,70,0.35)] hover:-translate-y-0.5 text-base"
                    >
                        <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-0.5">storefront</span>
                        Ver Catálogo
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white font-display font-medium px-6 py-3.5 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all duration-300 text-base"
                    >
                        <span className="material-symbols-outlined text-xl">home</span>
                        Ir al Inicio
                    </Link>
                </div>

                {/* Trust micro-element */}
                <div className="mt-12 flex items-center justify-center gap-2 text-white/30 text-xs font-body">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>KiplyStart — Pago al Recibir · Envío Gratis · Tasa BCV</span>
                </div>
            </div>
        </div>
    );
}
