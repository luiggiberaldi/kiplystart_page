import { Link } from 'react-router-dom';

/**
 * BrandStoryCTA — Emotional brand closer section
 * "Hecho para Venezuela" — builds brand connection and trust.
 */
export default function BrandStoryCTA() {
    return (
        <section className="py-16 px-6">
            <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.01]">
                {/* Background with Deep Gradient & Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#003B95] via-[#002A6B] to-[#001540] z-0"></div>

                {/* Abstract Shapes / Vzla Map Hint */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-40"></div>

                {/* Content Container */}
                <div className="relative z-10 p-8 sm:p-14 text-center flex flex-col items-center">

                    {/* Badge/Icon */}
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                        <span className="text-4xl filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-default">🇻🇪</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight leading-tight">
                        Hecho para <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-red-400">Venezuela</span>
                    </h2>

                    <div className="max-w-2xl mx-auto space-y-4 mb-10">
                        <p className="text-lg sm:text-xl text-blue-100/90 font-light leading-relaxed">
                            Llevamos la experiencia de compra internacional a tu puerta.
                            <br className="hidden sm:block" />
                            Sin complicaciones. Sin riesgos.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base font-medium text-white/80">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                                Primero recibes
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                                Luego pagas
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                                Sin tarjeta
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/catalogo"
                        className="group relative inline-flex items-center justify-center gap-3 bg-white text-[#002A6B] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                    >
                        <span className="relative z-10">Explorar Catálogo</span>
                        <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform relative z-10">arrow_forward</span>

                        {/* Shimmer effect */}
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1s_infinite]"></div>
                    </Link>

                    <p className="mt-6 text-sm text-white/40 font-medium tracking-wide">
                        🛒 Disfruta entregas ràpidas en Caracas
                    </p>
                </div>
            </div>
        </section>
    );
}
