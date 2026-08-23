import { Link } from 'react-router-dom';
import { Flame, Sparkles, Zap, ArrowRight, Layers, Tag, ShieldCheck } from 'lucide-react';

export default function CuratedBentoGrid() {
    return (
        <section className="py-4">
            <div className="text-center mb-6 sm:mb-8">
                <span className="text-xs font-black text-brand-red uppercase tracking-wider">
                    Colecciones Destacadas
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-0.5">
                    Compra por Beneficio y Deseo
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Selecciones pensadas para ahorrarte tiempo, dinero y brindarte máxima seguridad.
                </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Bento Card 1: Virales de TikTok */}
                <Link
                    to="/catalogo?q=viral"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 min-h-[220px]"
                >
                    <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-wider text-purple-300 mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Tendencia #1</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                            🔥 Top Virales de TikTok & Redes
                        </h3>
                        <p className="text-purple-200/80 text-xs sm:text-sm font-medium">
                            Los productos más vistos e innovadores con entrega inmediata en Venezuela.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-black text-purple-300 group-hover:text-white transition-colors">
                        <span>Explorar Virales</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* Bento Card 2: Combos Ahorro (Paga 1 Lleva 2) */}
                <Link
                    to="/catalogo"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 text-white p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 min-h-[220px]"
                >
                    <div className="absolute top-0 right-0 w-44 h-44 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-black uppercase tracking-wider text-yellow-200 mb-3">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Máximo Ahorro</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                            🎁 Combos "Paga 1 y Lleva el 2do con Descuento"
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm font-medium">
                            Ahorra hasta $10 comprando en pack de 2 o 3 unidades para ti o tu familia.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-black text-yellow-200 group-hover:text-white transition-colors">
                        <span>Ver Combos con Descuento</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* Bento Card 3: Despacho Express Caracas */}
                <Link
                    to="/catalogo"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2463] via-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 min-h-[220px]"
                >
                    <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-3">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Entrega Rápida</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                            ⚡ Caracas Express (&lt; 2 Horas)
                        </h3>
                        <p className="text-blue-200/80 text-xs sm:text-sm font-medium">
                            Motorizado directo a tu puerta en Gran Caracas con pago al recibir en el sitio.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-400 group-hover:text-white transition-colors">
                        <span>Pedir con Despacho Express</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
