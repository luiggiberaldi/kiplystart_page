import { Link } from 'react-router-dom';

const steps = [
    { icon: 'shopping_cart', text: 'Haces tu pedido (sin pago previo)' },
    { icon: 'chat', text: 'Te contactamos por WhatsApp para confirmar' },
    { icon: 'local_shipping', text: 'Recibes el producto en tu puerta' },
    { icon: 'verified', text: 'Lo abres, lo verificas, y LUEGO pagas' },
];

const methods = ['Efectivo USD/Bs', 'Pago Móvil', 'Zelle', 'Binance', 'Zinli'];

/**
 * CODBanner — Educational banner explaining Cash on Delivery process
 * Reduces friction for first-time COD buyers in Venezuela.
 */
export default function CODBanner() {
    return (
        <section className="py-12 px-6">
            <div className="max-w-3xl mx-auto bg-brand-blue rounded-2xl p-8 sm:p-10 text-white shadow-xl overflow-hidden relative">
                {/* Subtle decorative circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-3xl text-brand-red">package_2</span>
                        <h2 className="text-xl sm:text-2xl font-extrabold">
                            ¿Cómo funciona el Pago al Recibir?
                        </h2>
                    </div>

                    <div className="space-y-4 mb-8">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 shrink-0 mt-0.5">
                                    <span className="text-sm font-bold">{i + 1}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl text-white/70">{step.icon}</span>
                                    <p className="text-[15px] text-white/90">{step.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment methods */}
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                        <span className="material-symbols-outlined text-xl text-white/60">credit_card</span>
                        <span className="text-sm text-white/60 mr-1">Aceptamos:</span>
                        {methods.map((m) => (
                            <span key={m} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/80 font-medium">
                                {m}
                            </span>
                        ))}
                    </div>

                    <Link
                        to="/catalogo"
                        className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-red-900/30"
                    >
                        Ver Productos
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
