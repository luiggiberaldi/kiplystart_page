import { XCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

/**
 * BeforeAfterComparison Component
 * Neuromarketing Pain vs Pleasure visual contrast.
 */
export default function BeforeAfterComparison({ product }) {
    if (!product) return null;

    const slug = product.slug || '';
    const name = product.name || 'este producto';

    // Tailored before/after data for popular products or smart category fallback
    let comparisonData = null;

    if (slug.includes('nox') || slug.includes('nasal') || slug.includes('tiras')) {
        comparisonData = {
            beforeTitle: 'Sin Nox Tiras Nasales',
            beforeSubtitle: 'El problema diario al dormir',
            beforeItems: [
                'Ronquidos constantes que interrumpen tu descanso y el de tu pareja',
                'Despertar con fatiga, boca seca y sensación de no haber descansado',
                'Congestión nasal y dificultad para respirar acostado',
                'Falta de energía y bajo rendimiento durante el día'
            ],
            afterTitle: 'Con Nox Tiras Nasales',
            afterSubtitle: 'Alivio y descanso garantizado',
            afterItems: [
                'Apertura instantánea del 100% del flujo de aire nasal',
                'Silencio total y sueño profundo y continuo toda la noche',
                'Despiertas renovado, con energía y respiración despejada',
                'Adhesivo médico hipoalergénico suave con la piel'
            ]
        };
    } else if (slug.includes('pomo') || slug.includes('palanca') || slug.includes('carro') || slug.includes('auto')) {
        comparisonData = {
            beforeTitle: 'Interior Tradicional',
            beforeSubtitle: 'Aspecto común y desgastado',
            beforeItems: [
                'Palanca original desgastada u opaca',
                'Interior del vehículo sin personalidad ni estilo',
                'Cero iluminación al cambiar de velocidad de noche',
                'Sensación de manejo común y corriente'
            ],
            afterTitle: `Con ${name}`,
            afterSubtitle: 'Transformación premium al instante',
            afterItems: [
                'Iluminación LED táctil RGB que impacta al subirte',
                'Acabado cromado y cuero de alta durabilidad',
                'Instalación en 3 minutos sin mecánicos ni cables',
                'Sensación moderna y exótica cada vez que manejas'
            ]
        };
    } else {
        // Universal Smart Fallback
        comparisonData = {
            beforeTitle: 'Sin ' + name,
            beforeSubtitle: 'Complicaciones y gastos innecesarios',
            beforeItems: [
                'Pérdida de tiempo y soluciones temporales de baja calidad',
                'Gastos recurrentes en productos que no resuelven el problema',
                'Incertidumbre y frustración al no ver resultados reales',
                'Riesgo de comprar por internet sin poder revisar antes'
            ],
            afterTitle: 'Con ' + name,
            afterSubtitle: 'Resultados comprobados desde el primer día',
            afterItems: [
                'Solución directa y garantizada para tu día a día',
                'Materiales de alta durabilidad y máximo rendimiento',
                'Ahorro significativo con envío 100% gratis a tu puerta',
                'Pagas al recibir en efectivo o Pago Móvil (Tasa BCV)'
            ]
        };
    }

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div className="text-center space-y-1.5 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0A2463] border border-blue-200/80 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Contraste de Resultados</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                    ¿Por qué necesitas {name}?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Mira la diferencia entre tu rutina actual y la solución definitiva:
                </p>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Before Card (Pain) */}
                <div className="bg-rose-50/50 border-2 border-rose-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-3 border-b border-rose-200/60 pb-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                            ✕
                        </div>
                        <div>
                            <h4 className="font-black text-base text-rose-950 leading-tight">
                                {comparisonData.beforeTitle}
                            </h4>
                            <span className="text-[11px] text-rose-700 font-bold block">
                                {comparisonData.beforeSubtitle}
                            </span>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {comparisonData.beforeItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-900 leading-relaxed">
                                <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* After Card (Pleasure & Relief) */}
                <div className="bg-emerald-50/60 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-xs">
                        RECOMENDADO
                    </div>

                    <div className="flex items-center gap-3 border-b border-emerald-200/80 pb-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                            ✓
                        </div>
                        <div>
                            <h4 className="font-black text-base text-emerald-950 leading-tight">
                                {comparisonData.afterTitle}
                            </h4>
                            <span className="text-[11px] text-emerald-700 font-bold block">
                                {comparisonData.afterSubtitle}
                            </span>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {comparisonData.afterItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
