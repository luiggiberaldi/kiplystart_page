import { Link } from 'react-router-dom';

/**
 * BrandStoryCTA — Emotional brand closer section
 * "Hecho para Venezuela" — builds brand connection and trust.
 */
export default function BrandStoryCTA() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-brand-blue to-steel-blue rounded-2xl p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)] pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.04),transparent_50%)] pointer-events-none"></div>

                <div className="relative z-10">
                    <span className="text-4xl mb-4 inline-block">🇻🇪</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 leading-snug">
                        Hecho para Venezuela
                    </h2>
                    <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-xl mx-auto mb-4">
                        En KiplyStart creemos que comprar online en Venezuela debería ser
                        fácil, seguro y sin riesgo. Por eso creamos un sistema donde
                        <strong className="text-white"> primero recibes, luego pagas</strong>.
                    </p>
                    <p className="text-base sm:text-lg text-white/70 font-medium mb-8">
                        Sin tarjeta. Sin transferencia previa. Sin miedo.
                    </p>

                    <Link
                        to="/catalogo"
                        className="inline-flex items-center gap-2 bg-white text-brand-blue font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                    >
                        Explorar Catálogo
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
