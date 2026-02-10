/**
 * Política de Privacidad
 * @description Página legal de privacidad de KiplyStart C.A.
 */

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacidad() {
    return (
        <div className="bg-background-light text-soft-black font-display min-h-screen">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-brand-blue text-[28px] md:text-[32px] font-bold mb-8">Política de Privacidad</h1>
                <p className="text-xs text-gray-400 mb-8">Última actualización: 9 de febrero de 2026</p>

                <div className="prose prose-sm max-w-none space-y-6 text-soft-black font-body text-[15px] leading-relaxed">

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">1. Responsable del Tratamiento</h2>
                        <p><strong>KiplyStart C.A.</strong>, con domicilio en Valencia, Estado Carabobo, Venezuela, es responsable del tratamiento de sus datos personales.</p>
                        <p>Email de contacto: <a href="mailto:luiggiberaldi94@gmail.com" className="text-steel-blue hover:underline">luiggiberaldi94@gmail.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">2. Datos que Recopilamos</h2>
                        <p>Recopilamos únicamente los datos necesarios para procesar sus pedidos:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Nombre completo:</strong> Para identificar al destinatario de la entrega.</li>
                            <li><strong>Número de teléfono:</strong> Para coordinar la entrega y enviar actualizaciones del pedido.</li>
                            <li><strong>Dirección de entrega:</strong> Para realizar el envío del producto.</li>
                            <li><strong>Correo electrónico:</strong> Para comunicaciones relacionadas con su pedido (cuando es proporcionado).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">3. Finalidad del Tratamiento</h2>
                        <p>Sus datos personales son utilizados exclusivamente para:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Procesar y entregar sus pedidos.</li>
                            <li>Comunicarnos con usted sobre el estado de su compra.</li>
                            <li>Gestionar devoluciones o reclamos.</li>
                            <li>Cumplir con obligaciones legales aplicables.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">4. Compartición con Terceros</h2>
                        <p><strong>No compartimos, vendemos ni alquilamos sus datos personales a terceros.</strong></p>
                        <p>Los datos de entrega podrán ser compartidos únicamente con el servicio de mensajería correspondiente para ejecutar la entrega de su pedido.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">5. Cookies y Tecnologías de Rastreo</h2>
                        <p>Actualmente <strong>no utilizamos cookies, pixels de seguimiento ni herramientas de analítica</strong> en nuestro sitio web. Si esto cambia en el futuro, actualizaremos esta política y le notificaremos.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">6. Seguridad de los Datos</h2>
                        <p>Implementamos medidas de seguridad técnicas para proteger sus datos:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Conexión cifrada (HTTPS/SSL) en todo el sitio.</li>
                            <li>Base de datos con acceso restringido y políticas de seguridad a nivel de fila (RLS).</li>
                            <li>No almacenamos datos bancarios ni de tarjetas de crédito.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">7. Sus Derechos</h2>
                        <p>Usted tiene derecho a:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Acceder</strong> a sus datos personales almacenados.</li>
                            <li><strong>Rectificar</strong> datos incorrectos o incompletos.</li>
                            <li><strong>Eliminar</strong> sus datos de nuestra base (salvo obligaciones legales).</li>
                            <li><strong>Oponerse</strong> al tratamiento de sus datos para fines no esenciales.</li>
                        </ul>
                        <p className="mt-2">Para ejercer cualquiera de estos derechos, envíe un email a <a href="mailto:luiggiberaldi94@gmail.com" className="text-steel-blue hover:underline">luiggiberaldi94@gmail.com</a> con el asunto "Solicitud de Datos Personales".</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">8. Retención de Datos</h2>
                        <p>Conservamos sus datos personales mientras sean necesarios para cumplir con las finalidades descritas, o según lo requieran las leyes venezolanas aplicables.</p>
                    </section>

                    <section>
                        <h2 className="text-brand-blue text-lg font-bold font-display mb-2">9. Modificaciones</h2>
                        <p>Nos reservamos el derecho de actualizar esta política. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
