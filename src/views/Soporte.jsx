/**
 * Soporte / Centro de Ayuda
 * @description Página de soporte y contacto de KiplyStart C.A.
 */

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567';

export default function Soporte() {
    const faqs = [
        {
            q: '¿Cómo realizo un pedido?',
            a: 'Selecciona el producto que deseas, haz clic en "Pedir · Pagas al Recibir", completa tus datos de entrega y confirma por WhatsApp. ¡Es así de fácil!'
        },
        {
            q: '¿Cuándo y cómo pago?',
            a: 'Pagas cuando recibes el producto en tu puerta. Aceptamos efectivo (USD o Bs), transferencia bancaria, Pago Móvil y Binance (USDT).'
        },
        {
            q: '¿Puedo verificar el producto antes de pagar?',
            a: 'Sí. Con nuestro sistema de Pago al Recibir, puedes inspeccionar el producto antes de realizar el pago. Si no estás satisfecho, puedes rechazarlo.'
        },
        {
            q: '¿Cuánto tarda la entrega?',
            a: 'En Caracas, Miranda y La Guaira: 24 horas. En Carabobo, Aragua, Lara, Yaracuy y Zulia: 24-48 horas. Resto de Venezuela: tiempos variables.'
        },
        {
            q: '¿Puedo devolver un producto?',
            a: 'Sí, tienes 15 días para solicitar un cambio de artículo. El producto debe estar sin usar y en su empaque original. El envío de devolución corre por nuestra cuenta.'
        },
        {
            q: '¿Hacen envíos a toda Venezuela?',
            a: 'Sí. Tenemos cobertura contra entrega en las principales ciudades y mensajería tradicional para el resto del país.'
        },
        {
            q: '¿Hay reembolso de dinero?',
            a: 'Las devoluciones aplican como cambio de artículo. No realizamos reembolsos en dinero.'
        },
    ];

    return (
        <div className="bg-background-light text-soft-black font-display min-h-screen">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-brand-blue text-[28px] md:text-[32px] font-bold mb-3">Centro de Ayuda</h1>
                <p className="text-gray-500 font-body text-sm mb-10">¿Tienes alguna duda? Estamos aquí para ayudarte.</p>

                {/* Contact Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10 shadow-sm">
                    <h2 className="text-brand-blue text-lg font-bold mb-4">Contáctanos</h2>
                    <div className="space-y-4">
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, necesito ayuda con un pedido')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-[#25D366]/10 rounded-lg hover:bg-[#25D366]/20 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                            </div>
                            <div>
                                <p className="font-bold text-[#25D366] text-sm">WhatsApp</p>
                                <p className="text-gray-500 text-xs">Respuesta rápida · Lun a Vie 9AM – 6PM</p>
                            </div>
                        </a>

                        <a
                            href="mailto:luiggiberaldi94@gmail.com"
                            className="flex items-center gap-4 p-4 bg-brand-blue/5 rounded-lg hover:bg-brand-blue/10 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                                <span className="material-symbols-outlined text-[24px]">mail</span>
                            </div>
                            <div>
                                <p className="font-bold text-brand-blue text-sm">Email</p>
                                <p className="text-gray-500 text-xs">luiggiberaldi94@gmail.com</p>
                            </div>
                        </a>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            <span>Horario de atención: <strong>Lunes a Viernes, 9:00 AM – 6:00 PM</strong></span>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <h2 className="text-brand-blue text-lg font-bold mb-4">Preguntas Frecuentes</h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <details key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                            <summary className="px-5 py-4 font-bold text-sm text-brand-blue cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between list-none">
                                <span>{faq.q}</span>
                                <span className="material-symbols-outlined text-[20px] text-gray-400 group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="px-5 pb-4 text-sm text-gray-600 font-body leading-relaxed border-t border-gray-100 pt-3">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
