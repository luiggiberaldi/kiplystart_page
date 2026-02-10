/**
 * Términos y Condiciones
 * @description Página legal con términos de uso de KiplyStart C.A.
 */

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terminos() {
    return (
        <div className="bg-background-light text-soft-black font-display min-h-screen">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-brand-blue text-[28px] md:text-[32px] font-bold mb-8">Términos y Condiciones</h1>
                <p className="text-xs text-gray-400 mb-8">Última actualización: 9 de febrero de 2026</p>

                <div className="prose prose-sm max-w-none space-y-6 text-soft-black font-body text-[15px] leading-relaxed">

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">1. Información General</h2>
                        <p>Este sitio web es operado por <strong>KiplyStart C.A.</strong>, con domicilio en Valencia, Estado Carabobo, Venezuela. Al acceder y utilizar este sitio, usted acepta estos términos y condiciones en su totalidad.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">2. Edad Mínima</h2>
                        <p>Para realizar compras en KiplyStart, el usuario debe ser mayor de <strong>18 años</strong>. Al realizar un pedido, usted declara tener la edad legal para celebrar este tipo de transacciones.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">3. Productos y Precios</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Los precios se muestran en <strong>dólares americanos (USD)</strong> y pueden visualizarse en bolívares (VES) según la tasa BCV del día.</li>
                            <li>Los precios están sujetos a cambio sin previo aviso.</li>
                            <li>Las imágenes de los productos son referenciales y pueden variar ligeramente del producto físico.</li>
                            <li>Todos los productos están sujetos a disponibilidad de inventario.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">4. Métodos de Pago</h2>
                        <p>Aceptamos los siguientes métodos de pago:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Pago al Recibir (Contra Entrega):</strong> Efectivo en USD o Bolívares al momento de la entrega.</li>
                            <li><strong>Transferencia Bancaria / Pago Móvil:</strong> Previo a la entrega, con comprobante enviado por WhatsApp.</li>
                            <li><strong>Binance (USDT):</strong> Pago en criptomoneda previo a la entrega.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">5. Envíos y Tiempos de Entrega</h2>
                        <p>Los envíos se realizan a través de mensajería contra entrega. Los tiempos estimados son:</p>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-3">
                            <table className="w-full text-sm">
                                <thead className="bg-brand-blue/5">
                                    <tr>
                                        <th className="text-left px-4 py-2 font-bold text-brand-blue">Zona</th>
                                        <th className="text-left px-4 py-2 font-bold text-brand-blue">Tiempo Estimado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr><td className="px-4 py-2">Distrito Capital (Caracas)</td><td className="px-4 py-2">24 horas</td></tr>
                                    <tr><td className="px-4 py-2">Miranda (Los Teques, Guatire, Guarenas)</td><td className="px-4 py-2">24 horas</td></tr>
                                    <tr><td className="px-4 py-2">La Guaira</td><td className="px-4 py-2">24 horas</td></tr>
                                    <tr><td className="px-4 py-2">Carabobo (Valencia, San Diego, Guacara)</td><td className="px-4 py-2">24 – 48 horas</td></tr>
                                    <tr><td className="px-4 py-2">Aragua (Maracay, Turmero, Cagua)</td><td className="px-4 py-2">24 – 48 horas</td></tr>
                                    <tr><td className="px-4 py-2">Lara (Barquisimeto)</td><td className="px-4 py-2">24 – 48 horas</td></tr>
                                    <tr><td className="px-4 py-2">Yaracuy (San Felipe)</td><td className="px-4 py-2">24 – 48 horas</td></tr>
                                    <tr><td className="px-4 py-2">Zulia (Maracaibo)</td><td className="px-4 py-2">24 – 48 horas</td></tr>
                                    <tr><td className="px-4 py-2">Resto de Venezuela</td><td className="px-4 py-2">Variable (mensajería tradicional)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">Los tiempos se contabilizan a partir de la generación de la guía de envío. Pueden variar por causas ajenas a KiplyStart.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">6. Política de Devoluciones</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>El cliente dispone de <strong>15 días calendario</strong> a partir de la recepción del producto para solicitar una devolución.</li>
                            <li>Las devoluciones aplican únicamente como <strong>cambio de artículo</strong>. No se realizan reembolsos en dinero.</li>
                            <li>El producto debe encontrarse en su empaque original, sin usar y sin daños.</li>
                            <li>El <strong>costo de envío de devolución corre por cuenta de KiplyStart</strong>.</li>
                            <li>Para iniciar una devolución, contacte a nuestro equipo por WhatsApp.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">7. Limitación de Responsabilidad</h2>
                        <p>KiplyStart no se hace responsable por daños indirectos derivados del uso de los productos. Nuestra responsabilidad se limita al valor del producto adquirido.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">8. Modificaciones</h2>
                        <p>KiplyStart C.A. se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en este sitio.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">9. Contacto</h2>
                        <p>Para consultas sobre estos términos, contáctenos por:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Email: <a href="mailto:luiggiberaldi94@gmail.com" className="text-steel-blue hover:underline">luiggiberaldi94@gmail.com</a></li>
                            <li>WhatsApp: Lunes a Viernes, 9:00 AM – 6:00 PM</li>
                        </ul>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
