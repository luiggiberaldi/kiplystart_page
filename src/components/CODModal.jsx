import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * CODModal Component (Releasit Style)
 * @description
 * High-conversion modal for "Cash on Delivery" orders.
 * Bypasses standard checkout for direct WhatsApp conversion.
 */
export default function CODModal({ isOpen, onClose, product, quantity, totalPrice, selectedBundle }) {
    const [formData, setFormData] = useState({
        name: '',
        ci: '',
        phone: '',
        state: 'Miranda', // Default for now
        city: '',
        address: '',
        ref: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // CRITICAL: Always ensure scroll is unlocked on unmount
    // This handles edge cases where user navigates away (WhatsApp redirect)
    // and browser restores page state via back button
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Return null if modal is closed (but AFTER hooks have run)
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.ci.trim()) newErrors.ci = 'La cédula es obligatoria';
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
        if (formData.phone.length < 10) newErrors.phone = 'Verifica el número';
        if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
        if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            // 1. Save order to Supabase (Optional but recommended for analytics)
            const { data, error } = await supabase
                .from('orders')
                .insert({
                    user_name: formData.name,
                    user_phone: formData.phone,
                    user_ci: formData.ci,
                    product_id: product.id,
                    product_name: product.name,
                    quantity: quantity,
                    bundle_type: selectedBundle, // '1', '2', '3'
                    total_price: totalPrice,
                    delivery_address: `${formData.address}, ${formData.city}, ${formData.state}. Ref: ${formData.ref}`,
                    status: 'pending_whatsapp'
                })
                .select();

            if (error) {
                console.error("Supabase error:", error);
                // Continue anyway to WhatsApp as fallback
            }

            // 2. Build WhatsApp Message
            const orderId = data && data[0] ? `#${data[0].id.toString().padStart(4, '0')}` : 'N/A';
            const bundleText = selectedBundle > 1 ? `(Oferta ${selectedBundle} unidades)` : '';

            const message = `*¡Hola! Quiero confirmar mi pedido KiplyStart!* 🚀\n\n` +
                `📦 *Producto:* ${product.name}\n` +
                `🔢 *Cantidad:* ${quantity} ${bundleText}\n` +
                `💰 *Total a Pagar:* $${Math.ceil(totalPrice)}\n\n` +
                `👤 *Datos de Envío:*\n` +
                ` Nombre: ${formData.name}\n` +
                ` C.I: ${formData.ci}\n` +
                ` Tel: ${formData.phone}\n` +
                ` Dirección: ${formData.city}, ${formData.state}. ${formData.address}\n` +
                ` Ref: ${formData.ref}\n\n` +
                `📍 *ID Pedido:* ${orderId}\n` +
                `_Espero confirmación para el envío. Gracias!_`;

            // 3. Redirect
            const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567';
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;

        } catch (err) {
            console.error("Submission error:", err);
            setLoading(false);
            alert("Hubo un error procesando el pedido. Por favor intenta de nuevo.");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

                {/* Header */}
                <div className="sticky top-0 bg-brand-blue text-white p-3 md:p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[20px] md:text-[24px] shrink-0">local_shipping</span>
                        <h3 className="font-display font-bold text-base md:text-lg truncate">Envío Rápido y Seguro</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white shrink-0 ml-2">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-4 md:p-6">
                    {/* Product Summary */}
                    <div className="flex gap-3 md:gap-4 mb-4 md:mb-6 bg-gray-50 p-2.5 md:p-3 rounded-lg border border-gray-100">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-md border border-gray-200 p-1 flex-shrink-0">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-brand-blue truncate">{product.name}</p>
                            <p className="text-[11px] md:text-xs text-gray-500">Cantidad: {quantity} {selectedBundle > 1 && `(${selectedBundle}x)`}</p>
                            <p className="font-bold text-brand-red text-base md:text-lg">${Math.ceil(totalPrice)}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 font-body">
                        <h4 className="font-bold text-sm md:text-base text-gray-800 border-b pb-2 mb-3 md:mb-4">Datos de Entrega</h4>

                        {/* Name & CI row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none`}
                                    placeholder="Pedro Pérez"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Cédula / ID *</label>
                                <input
                                    type="text"
                                    name="ci"
                                    value={formData.ci}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.ci ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none`}
                                    placeholder="V-12345678"
                                />
                                {errors.ci && <p className="text-red-500 text-[10px] mt-1">{errors.ci}</p>}
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono (WhatsApp) *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none`}
                                placeholder="04241234567"
                            />
                            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                        </div>

                        {/* City & State row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Estado</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-blue outline-none"
                                >
                                    <option>Distrito Capital</option>
                                    <option>Miranda</option>
                                    <option>Carabobo</option>
                                    <option>Aragua</option>
                                    <option>Lara</option>
                                    <option>Zulia</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Ciudad *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none`}
                                    placeholder="Ej: Caracas"
                                />
                                {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Dirección Exacta *</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none`}
                                placeholder="Av. Principal, Edif. Azul, Piso 2, Apto 2B"
                            ></textarea>
                            {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                        </div>

                        {/* Reference */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Punto de Referencia (Opcional)</label>
                            <input
                                type="text"
                                name="ref"
                                value={formData.ref}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                placeholder="Frente a la panadería..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3 md:pt-4 pb-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-red text-white font-display font-bold text-base md:text-lg py-3.5 md:py-4 rounded-xl shadow-lg shadow-brand-red/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Completar Pedido por WhatsApp
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xs">lock</span>
                                Tus datos están protegidos y encriptados.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
