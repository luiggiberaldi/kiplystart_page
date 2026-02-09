/**
 * TrustBar Component
 * @description
 * Visual 3-step process: Pides → Recibes → Pagas.
 * Implements Progressive Disclosure and builds trust.
 * 
 * Brain Validation:
 * - ✅ 3 pasos claros (cognitive load reduction)
 * - ✅ Iconografía simple (reconocimiento rápido)
 * 
 * @returns {JSX.Element} TrustBar component
 */

export default function TrustBar() {
    const steps = [
        {
            icon: '🛍️',
            number: '1',
            title: 'Pides',
            desc: 'Selecciona tu producto'
        },
        {
            icon: '📦',
            number: '2',
            title: 'Recibes',
            desc: 'Entrega en tu puerta'
        },
        {
            icon: '💵',
            number: '3',
            title: 'Pagas',
            desc: 'Solo cuando lo recibas'
        }
    ];

    return (
        <section className="bg-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div key={step.number} className="text-center">
                            {/* Icon */}
                            <div className="text-5xl mb-4">{step.icon}</div>

                            {/* Step number + title */}
                            <h3 className="font-sans font-semibold text-xl text-brand-blue mb-2">
                                {step.number}. {step.title}
                            </h3>

                            {/* Description */}
                            <p className="font-body text-sm text-soft-black">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
