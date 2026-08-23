import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, Heart } from 'lucide-react';

/**
 * BrandStoryCTA — Emotional brand closer section
 * "Hecho para Venezuela" — builds brand connection and trust.
 */
export default function BrandStoryCTA() {
    return (
        <section className="py-12 sm:py-16">
            <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.01] border border-blue-900/40">
                {/* Background with Deep Gradient & Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A2463] via-[#081b4b] to-[#040d24] z-0"></div>

                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 p-8 sm:p-14 text-center flex flex-col items-center">

                    {/* Badge/Icon */}
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/15 shadow-inner text-amber-400">
                        <Heart className="w-7 h-7 fill-amber-400/20 text-amber-400" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                        Hecho para <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-red-400">Venezuela</span>
                    </h2>

                    <div className="max-w-2xl mx-auto space-y-4 mb-8">
                        <p className="text-base sm:text-lg text-blue-100/90 font-medium leading-relaxed">
                            Llevamos la experiencia de compra segura directamente a tu puerta.
                            <br className="hidden sm:block" />
                            Sin complicaciones. Sin pagos por adelantado.
                        </p>

                        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-bold text-white/90">
                            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                Primero recibes
                            </span>
                            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                Luego pagas
                            </span>
                            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                Cero anticipos
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/catalogo"
                        className="group relative inline-flex items-center justify-center gap-3 bg-white text-[#0A2463] font-black text-base sm:text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 overflow-hidden cursor-pointer"
                    >
                        <span className="relative z-10">Explorar Catálogo Completo</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform relative z-10" />

                        {/* Shimmer effect */}
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1s_infinite]"></div>
                    </Link>

                    <p className="mt-5 text-xs text-slate-400 font-semibold tracking-wide">
                        Entregas express en Gran Caracas y envíos gratis vía Tealca a todo el país.
                    </p>
                </div>
            </div>
        </section>
    );
}
