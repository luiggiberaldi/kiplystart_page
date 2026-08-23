import { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

/**
 * ProductFAQ Component
 * Removes friction and answers the top 5 questions Venezuelan COD buyers have.
 */
export default function ProductFAQ() {
    const [openIdx, setOpenIdx] = useState(null);

    const faqs = [
        {
            q: '¿Tengo que pagar algo por adelantado para que me envíen el pedido?',
            a: '¡No, absolutamente nada! En KiplyStart no solicitamos ningún pago por adelantado. El 100% del valor de tu compra lo cancelas en tus manos al repartidor cuando recibes tu paquete.'
        },
        {
            q: '¿Cómo se calcula el pago si deseo pagar en Bolívares por Pago Móvil?',
            a: 'Tu monto en Bolívares se calcula exactamente a la Tasa Oficial del Banco Central de Venezuela (BCV) correspondiente al día de la entrega. Puedes transferir por Pago Móvil al instante.'
        },
        {
            q: '¿Cuánto tiempo tarda en llegar mi pedido a mi dirección?',
            a: 'En Caracas contamos con entregas Express en menos de 2 horas. Para el resto de Venezuela (Valencia, Maracay, Barquisimeto, Maracaibo, Lechería, etc.), los envíos se realizan vía Tealca y tardan entre 24 y 48 horas hábiles.'
        },
        {
            q: '¿Qué garantía tengo si el producto llega con algún defecto de fábrica?',
            a: 'Cuentas con Garantía Total de Reposición Inmediata. Si tu producto presenta cualquier falla o daño durante el transporte, te enviamos uno nuevo sin costo extra.'
        },
        {
            q: '¿Puedo pagar en dólares en efectivo al recibir?',
            a: 'Sí, claro. Puedes cancelar en billetes de dólares ($ USD) en efectivo o mediante Pago Móvil / transferencia bancaria según tu preferencia.'
        }
    ];

    const toggle = (idx) => {
        setOpenIdx(openIdx === idx ? null : idx);
    };

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/80 shadow-xs space-y-6">
            <div className="text-center space-y-1.5 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Preguntas Frecuentes</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                    ¿Tienes Dudas sobre tu Pedido?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Resolvemos tus preguntas sobre pagos, envíos y garantía:
                </p>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
                {faqs.map((faq, idx) => {
                    const isOpen = openIdx === idx;
                    return (
                        <div 
                            key={idx}
                            className={`border rounded-2xl transition-all ${
                                isOpen ? 'border-[#0A2463] bg-blue-50/20 shadow-xs' : 'border-gray-200/80 bg-white hover:border-gray-300'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => toggle(idx)}
                                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-extrabold text-sm sm:text-base text-gray-900 cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transform transition-transform duration-200 ${
                                    isOpen ? 'rotate-180 text-[#0A2463]' : ''
                                }`} />
                            </button>

                            {isOpen && (
                                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3 animate-fadeIn">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
