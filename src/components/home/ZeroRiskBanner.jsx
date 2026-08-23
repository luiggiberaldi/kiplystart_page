import { PackageCheck, SearchCheck, Banknote, ShieldCheck } from 'lucide-react';

export default function ZeroRiskBanner() {
    const steps = [
        {
            num: '01',
            icon: PackageCheck,
            title: 'Pides sin Anticipos',
            desc: 'Sin tarjetas ni pagos previos. Ordenas en 10 segundos con tus datos de envío.',
            badge: 'Cero Riesgo',
            color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/80',
            badgeColor: 'bg-blue-100 text-blue-800'
        },
        {
            num: '02',
            icon: SearchCheck,
            title: 'Abres y Verificas',
            desc: 'Revisas el producto físicamente frente al repartidor o en agencia antes de pagar.',
            badge: '100% Transparente',
            color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/80',
            badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
            num: '03',
            icon: Banknote,
            title: 'Pagas al Recibir',
            desc: 'Pagas en Efectivo ($ USD) o Pago Móvil (Bs a Tasa Oficial BCV) una vez conforme.',
            badge: 'Pago Seguro',
            color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/80',
            badgeColor: 'bg-emerald-100 text-emerald-800'
        },
    ];

    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0A2463] text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black uppercase tracking-wider text-amber-400 mb-3 shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Comprar en KiplyStart es 100% Seguro</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                        ¿Cómo Funciona el <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Pago al Recibir</span>?
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
                        Sin transferencias sospechosas por adelantado. Tu dinero está seguro en tu bolsillo hasta que tengas el paquete en tus manos.
                    </p>
                </div>

                {/* 3 Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {steps.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.num}
                                className="relative bg-white/95 backdrop-blur-md text-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/40 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} border flex items-center justify-center shadow-xs`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                                                {s.badge}
                                            </span>
                                            <span className="text-xs font-black text-slate-300">
                                                {s.num}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-black text-slate-950 mb-1.5">
                                        {s.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                        {s.desc}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-extrabold text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>Paso {idx + 1} de 3</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
