/**
 * TrustBar 2.0 Component
 * @description
 * Visual 3-step process: Pides → Recibes → Pagas.
 * Upgraded with payment method sub-lines for each step.
 */

export default function TrustBar() {
    const steps = [
        {
            icon: 'shopping_bag',
            number: '1',
            title: 'Pides',
            desc: 'Selecciona tu producto',
            sub: 'Sin registro · Sin tarjeta'
        },
        {
            icon: 'package_2',
            number: '2',
            title: 'Recibes',
            desc: 'Llega a tu puerta en 24-48h',
            sub: 'Envío GRATIS · Contraentrega'
        },
        {
            icon: 'payments',
            number: '3',
            title: 'Pagas',
            desc: 'Solo cuando lo verifiques',
            sub: 'Efectivo · Zelle · Pago Móvil · Binance'
        }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start gap-2">
                {steps.map((step, i) => (
                    <div key={step.number} className="contents">
                        <div className="flex flex-col items-center flex-1 text-center gap-2.5">
                            <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                <span className="material-symbols-outlined text-[28px]">{step.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-blue">{step.number}. {step.title}</p>
                                <p className="text-xs text-gray-600 mt-1 leading-snug">{step.desc}</p>
                                <p className="text-[10px] text-gray-400 mt-1 leading-snug font-medium">{step.sub}</p>
                            </div>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="pt-4 text-gray-300 shrink-0">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
