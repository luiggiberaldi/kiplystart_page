import { XCircle, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * BeforeAfterComparison Component
 * Neuromarketing Pain vs Pleasure visual contrast.
 * Tailored specifically per product with a safe, intelligent dynamic fallback.
 */
export default function BeforeAfterComparison({ product }) {
    if (!product) return null;

    const slug = (product.slug || '').toLowerCase();
    const name = product.name || 'este producto';
    const s = `${slug} ${name.toLowerCase()}`;

    let comparisonData = null;

    // 1. Nox Tiras Nasales
    if (s.includes('nox') || s.includes('tiras nasales') || s.includes('nasal')) {
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
    } 
    // 2. Pomo Palanca LED (ONLY for pomos / palancas)
    else if (s.includes('pomo') || s.includes('palanca de cambio') || s.includes('palanca led')) {
        comparisonData = {
            beforeTitle: 'Interior Tradicional',
            beforeSubtitle: 'Aspecto común y desgastado',
            beforeItems: [
                'Palanca original desgastada, agrietada u opaca',
                'Interior del vehículo sin personalidad ni estilo moderno',
                'Cero iluminación al cambiar de velocidad de noche',
                'Sensación de manejo anticuada y común'
            ],
            afterTitle: `Con ${name}`,
            afterSubtitle: 'Transformación premium al instante',
            afterItems: [
                'Iluminación LED táctil RGB que impacta al subirte',
                'Acabado cromado y cuero de alta durabilidad',
                'Instalación rápida sin mecánicos ni modificaciones',
                'Sensación moderna y deportiva cada vez que manejas'
            ]
        };
    } 
    // 3. Cargador Inteligente Batería 12V
    else if (s.includes('cargador') || s.includes('bateria') || s.includes('12v') || s.includes('pulse repair')) {
        comparisonData = {
            beforeTitle: 'Sin Cargador Inteligente',
            beforeSubtitle: 'Riesgos y gastos innecesarios',
            beforeItems: [
                'Batería descargada sin aviso previo dejándote varado en la calle o casa',
                'Gastos excesivos comprando baterías nuevas que solo estaban sulfatadas',
                'Depender de cables auxiliares o pedir auxilio a extraños',
                'Cargadores lentos tradicionales sin protección que queman la batería'
            ],
            afterTitle: `Con ${name}`,
            afterSubtitle: 'Energía y diagnóstico garantizado',
            afterItems: [
                'Carga inteligente por pulsos que revive y desulfata baterías descargadas',
                'Pantalla digital LCD con voltaje, corriente y temperatura en tiempo real',
                'Protección total contra sobrecalentamiento, polaridad invertida y cortocircuito',
                'Compatible con autos, camionetas, motos y baterías 12V (4Ah a 100Ah)'
            ]
        };
    }
    // 4. Compresor de Aire Portátil Digital
    else if (s.includes('compresor') || s.includes('inflador')) {
        comparisonData = {
            beforeTitle: 'Sin Compresor Portátil',
            beforeSubtitle: 'Imprevistos en carretera',
            beforeItems: [
                'Caucho desinflado en plena vía sin estaciones de servicio cerca',
                'Medidores analógicos imprecisos que desgastan tus neumáticos',
                'Largas filas y pérdida de tiempo en bombas de gasolina',
                'Inseguridad al quedarte accidentado de noche'
            ],
            afterTitle: `Con ${name}`,
            afterSubtitle: 'Tranquilidad en todo viaje',
            afterItems: [
                'Inflado digital automático con corte exacto a los PSI deseados',
                'Linterna LED de emergencia integrada para uso nocturno seguro',
                'Pantalla digital LCD con lectura exacta de presión',
                'Batería recargable y boquillas para autos, motos, bicis y balones'
            ]
        };
    }
    // 5. Esponja Mágica / Limpiador de Vidrios
    else if (s.includes('esponja') || s.includes('vidrio') || s.includes('oil film') || s.includes('parabrisa')) {
        comparisonData = {
            beforeTitle: 'Vidrio con Película de Grasa',
            beforeSubtitle: 'Peligro al conducir de noche',
            beforeItems: [
                'Capa de grasa y manchas de lluvia que encandilan con las luces de frente',
                'Limpiaparabrisas que rechinan y rayan el cristal sin limpiar bien',
                'Productos caseros que dejan marcas y empañan la visibilidad',
                'Alto riesgo de accidentes por reflejos y visión borrosa bajo la lluvia'
            ],
            afterTitle: `Con ${name}`,
            afterSubtitle: 'Visibilidad cristalina HD',
            afterItems: [
                'Elimina el 100% de la película de aceite, grasa y lluvia ácida',
                'Restaura la transparencia óptica pura del parabrisas',
                'Efecto hidrofóbico que repele el agua al instante',
                'Fórmula segura que no raya el vidrio ni daña los sellos de goma'
            ]
        };
    }
    // 6. Universal Dynamic Fallback
    else {
        comparisonData = {
            beforeTitle: `Sin ${name}`,
            beforeSubtitle: 'Complicaciones y gastos innecesarios',
            beforeItems: [
                'Pérdida de tiempo con alternativas de baja calidad que no duran',
                'Gastos recurrentes en soluciones temporales',
                'Incertidumbre y frustración al no obtener los resultados esperados',
                'Riesgo de comprar online sin poder revisar antes'
            ],
            afterTitle: `Con ${name}`,
            afterSubtitle: 'Resultados comprobados desde el primer uso',
            afterItems: [
                'Solución directa, práctica y garantizada para tu día a día',
                'Materiales de alta durabilidad con garantía de funcionamiento',
                'Envío 100% GRATIS directo a tu puerta o agencia',
                'Cero riesgo: Pagas al recibir en efectivo o Pago Móvil BCV'
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
