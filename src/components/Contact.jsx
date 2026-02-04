import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); // 'success', 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    { name: formData.name, email: formData.email, message: formData.message }
                ]);

            if (error) throw error;

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div id="contact" className="py-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-dark-card border border-white/5 rounded-2xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                ¿Listo para <br />
                                <span className="text-primary">Iniciar tu Proyecto?</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Cuéntanos sobre tu idea. Nosotros nos encargamos de la tecnología para que tú te enfoques en el negocio.
                            </p>

                            <div className="space-y-4 text-gray-400">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span>hola@kiplystart.com</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <span>+51 999 999 999</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/5">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Tu nombre" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="tu@email.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                                <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="¿Qué estás construyendo?"></textarea>
                            </div>

                            {status === 'success' && (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                                    ¡Mensaje enviado correctamente! Te contactaremos pronto.
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    Error al enviar. Asegúrate de configurar la conexión.
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
