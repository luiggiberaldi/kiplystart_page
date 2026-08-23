import { Link } from 'react-router-dom';
import { Flame, Sparkles, Zap, ArrowRight, Gift, Percent, Truck, Star } from 'lucide-react';

export default function CuratedBentoGrid() {
    return (
        <section className="py-2 sm:py-4">
            <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0A2463] text-[11px] font-black uppercase tracking-wider mb-2 border border-slate-200/80 shadow-2xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Colecciones Destacadas</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight mt-0.5">
                    Compra por Beneficio y Deseo
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
                    Selecciones pensadas para ahorrarte tiempo, dinero y brindarte máxima seguridad.
                </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Bento Card 1: Virales de TikTok */}
                <Link
                    to="/catalogo?q=viral"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 min-h-[240px] border border-purple-500/20"
                >
                    <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-500/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner group-hover:rotate-6 transition-transform">
                                <Flame className="w-6 h-6 text-purple-300 fill-purple-300/30" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-purple-200">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Tendencia Viral</span>
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                            Top Virales de Redes
                        </h3>
                        <p className="text-purple-200/80 text-xs sm:text-sm font-medium leading-relaxed">
                            Los productos más vistos e innovadores de TikTok con entrega inmediata en Venezuela.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-black text-purple-300 group-hover:text-white transition-colors">
                        <span>Explorar Colección Viral</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                </Link>

                {/* Bento Card 2: Combos Ahorro (Paga 1 Lleva 2) */}
                <Link
                    to="/catalogo"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 min-h-[240px] border border-amber-400/20"
                >
                    <div className="absolute -top-10 -right-10 w-44 h-44 bg-yellow-400/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-amber-100 shadow-inner group-hover:rotate-6 transition-transform">
                                <Gift className="w-6 h-6 text-white" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-wider text-yellow-100">
                                <Percent className="w-3 h-3 text-yellow-300" />
                                <span>Máximo Ahorro</span>
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                            Packs de Ahorro Familiar
                        </h3>
                        <p className="text-amber-100/90 text-xs sm:text-sm font-medium leading-relaxed">
                            Ahorra comprando en combos de 2 o 3 unidades para ti o tu familia con envío 100% gratis.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-black text-yellow-200 group-hover:text-white transition-colors">
                        <span>Ver Combos con Descuento</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                </Link>

                {/* Bento Card 3: Despacho Express Caracas */}
                <Link
                    to="/catalogo"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2463] via-blue-900 to-slate-950 text-white p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 min-h-[240px] border border-blue-400/20"
                >
                    <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-500/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200 shadow-inner group-hover:rotate-6 transition-transform">
                                <Zap className="w-6 h-6 text-amber-300 fill-amber-300/30" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                                <Truck className="w-3 h-3 text-emerald-400" />
                                <span>Express &lt; 2h</span>
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                            Despacho Express Caracas
                        </h3>
                        <p className="text-blue-200/80 text-xs sm:text-sm font-medium leading-relaxed">
                            Motorizado directo a tu puerta en menos de 2 a 24 horas con pago al recibir en el sitio.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-300 group-hover:text-white transition-colors">
                        <span>Pedir con Despacho Express</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
