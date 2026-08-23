import { ShoppingBag, Truck, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

/**
 * CODProcessSteps Component
 * Visual 3-step guide explaining Cash on Delivery in Venezuela.
 */
export default function CODProcessSteps() {
    const steps = [
        {
            step: '01',
            icon: ShoppingBag,
            title: 'Pides en 30 Segundos',
            desc: 'Sin tarjetas de crédito ni registros complicados. Solo tu nombre, teléfono y dirección.'
        },
        {
            step: '02',
            icon: Truck,
            title: 'Despacho a Domicilio u Oficina',
            desc: 'Entrega a tu domicilio en zonas con cobertura directa o en la oficina Tealca más cercana a ti en todo el país (24-48h).',
            highlight: true
        },
        {
            step: '03',
            icon: ShieldCheck,
            title: 'Revisas y Pagas al Recibir',
            desc: 'Revisas tu paquete en mano y cancelas en efectivo ($ USD) o Pago Móvil a Tasa Oficial BCV.'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-900 via-[#0A2463] to-slate-950 rounded-3xl p-6 sm:p-8 md:p-10 text-white space-y-8 shadow-xl">
            <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
                    <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    Proceso 100% Seguro y Transparente
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                    ¿Cómo Funciona el Pago al Recibir?
                </h3>
                <p className="text-xs sm:text-sm text-blue-200/80">
                    Tu tranquilidad es nuestra prioridad. Cero riesgos, pagas solo cuando tienes tu producto en la mano.
                </p>
            </div>

            {/* 3 Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {steps.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div 
                            key={idx}
                            className={`rounded-2xl p-5 sm:p-6 space-y-3 relative border transition-all ${
                                item.highlight 
                                    ? 'bg-white/10 border-emerald-400/40 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/30' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                                    item.highlight ? 'bg-emerald-500 text-white' : 'bg-white/10 text-blue-300'
                                }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="font-mono text-2xl font-black text-white/20">
                                    {item.step}
                                </span>
                            </div>

                            <h4 className="font-black text-base text-white">
                                {item.title}
                            </h4>

                            <p className="text-xs sm:text-sm text-blue-100/75 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
