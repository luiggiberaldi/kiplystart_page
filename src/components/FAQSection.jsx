import { useState } from 'react';

const faqs = [
    {
        q: '¿Realmente no pago nada hasta que llegue el producto?',
        a: 'Correcto. Tu pedido se despacha sin pago previo. Solo pagas cuando lo recibes y verificas que todo esté en orden.'
    },
    {
        q: '¿Cuánto tarda el envío?',
        a: 'Caracas y zona metropolitana: 24 horas. Interior del país: 24 a 48 horas. Todos los envíos son GRATIS.'
    },
    {
        q: '¿Qué métodos de pago aceptan al momento de recibir?',
        a: 'Efectivo (USD y Bs), Pago Móvil, Zelle, Binance y Zinli. Todos los precios se calculan a Tasa BCV del día.'
    },
    {
        q: '¿Puedo devolver el producto si no me gusta?',
        a: 'Sí. Si el producto no es lo que esperabas, el motorizado se lo lleva de vuelta sin costo alguno para ti.'
    },
    {
        q: '¿El envío es realmente gratis?',
        a: 'Sí, envío 100% gratis en todo el territorio nacional. Sin costos ocultos ni mínimos de compra.'
    },
    {
        q: '¿A qué tasa calculan los precios en bolívares?',
        a: 'Todos los precios se calculan a Tasa BCV del día, publicada por el Banco Central de Venezuela.'
    }
];

function AccordionItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full py-5 px-1 text-left group"
                aria-expanded={isOpen}
            >
                <span className="text-[15px] sm:text-base font-semibold text-soft-black pr-4 group-hover:text-brand-blue transition-colors">
                    {faq.q}
                </span>
                <span className={`material-symbols-outlined text-brand-blue shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-sm text-gray-600 leading-relaxed pb-5 px-1">
                        {faq.a}
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * FAQSection — Accordion FAQ about COD payments
 * Resolves top buyer objections for Venezuelan COD e-commerce.
 */
export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-16 px-6">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-blue text-center mb-2">
                    Preguntas Frecuentes
                </h2>
                <p className="text-gray-500 text-center text-sm mb-10">
                    Todo lo que necesitas saber sobre el pago contraentrega
                </p>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 sm:px-8">
                    {faqs.map((faq, i) => (
                        <AccordionItem
                            key={i}
                            faq={faq}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
