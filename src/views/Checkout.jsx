/**
 * Checkout View
 * @description
 * Minimal checkout with 3-click flow: Form → Confirm → WhatsApp redirect.
 * Implements cash-on-delivery strategy from TECHNICAL_BRAIN_2026.md.
 * 
 * Brain Validation:
 * - ✅ <3 clics (form submission + WhatsApp)
 * - ✅ Transparent copy: "Pagarás cuando recibas"
 * - ✅ No dark patterns (no hidden fees, no pre-checked boxes)
 * - ✅ Touch-friendly: campos 56px height
 * 
 * Lines: ~280
 * @returns {JSX.Element} Checkout page
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567';

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('product');

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // Fetch product details
    useEffect(() => {
        async function fetchProduct() {
            if (!productId) return;

            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            setProduct(data);
        }
        fetchProduct();
    }, [productId]);

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle quantity changes (with bounds)
    const incrementQuantity = () => {
        if (quantity < product?.stock) {
            setQuantity(q => q + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    /**
     * Create order in Supabase and redirect to WhatsApp
     * @param {Event} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            setOrderError(null);
            // 1. Insert order into Supabase
            const { data, error } = await supabase
                .from('orders')
                .insert({
                    user_phone: formData.phone,
                    product_id: productId,
                    quantity: quantity,
                    total_price: product.price * quantity,
                    delivery_address: formData.address,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            // 2. Generate WhatsApp message
            const message = `Hola! Quiero confirmar mi pedido:\n\n- Producto: ${product.name}\n- Cantidad: ${quantity}\n- Precio Total: $${(product.price * quantity).toFixed(2)}\n- Nombre: ${formData.name}\n- Dirección: ${formData.address}\n\nNúmero de orden: ${data.id.substring(0, 8)}`;

            // 3. Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;

        } catch {
            setOrderError('Error al crear el pedido. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-brand-white">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <p className="font-body">Producto no encontrado</p>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="mt-4 text-steel-blue hover:underline"
                    >
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-white">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-12">
                {/* Progress Indicator */}
                <p className="font-sans text-steel-blue mb-8 text-center">
                    Paso 2 de 3: Confirma tus datos
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT: Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="font-sans font-bold text-xl text-brand-blue mb-6">
                            Resumen del Pedido
                        </h2>

                        <div className="flex items-center mb-4">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded mr-4"
                            />
                            <div>
                                <h3 className="font-sans font-semibold">{product.name}</h3>
                                <p className="font-sans text-lg text-brand-blue">
                                    ${product.price?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-body">Cantidad:</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={decrementQuantity}
                                    className="bg-gray-200 w-12 h-12 rounded hover:bg-gray-300 transition"
                                    aria-label="Reducir cantidad"
                                    type="button"
                                >
                                    −
                                </button>
                                <span className="font-sans font-bold text-xl w-12 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    className="bg-gray-200 w-12 h-12 rounded hover:bg-gray-300 transition"
                                    aria-label="Aumentar cantidad"
                                    type="button"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Total Price (Very Prominent) */}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-sans font-bold text-xl">Total:</span>
                                <span className="font-sans font-bold text-price text-brand-blue">
                                    ${(product.price * quantity).toFixed(2)}
                                </span>
                            </div>
                            <p className="font-body text-sm text-gray-600 mt-2">
                                💚 Pagarás cuando recibas el producto
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Checkout Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="font-sans font-bold text-xl text-brand-blue mb-6">
                            Datos de Entrega
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <label className="block font-sans font-medium text-sm mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="María González"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    style={{ minHeight: '56px' }}
                                />
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label className="block font-sans font-medium text-sm mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+58 424 123 4567"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    style={{ minHeight: '56px' }}
                                />
                            </div>

                            {/* Address Input */}
                            <div>
                                <label className="block font-sans font-medium text-sm mb-2">
                                    Dirección de entrega *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Calle, edificio, apartamento..."
                                    required
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                                />
                            </div>

                            {/* Error Message (replaces native alert) */}
                            {orderError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2" role="alert">
                                    <span className="material-symbols-outlined text-brand-red text-[20px]">error</span>
                                    <p className="text-brand-red text-sm font-medium">{orderError}</p>
                                </div>
                            )}

                            {/* Submit Button (Von Restorff: ÚNICO rojo) */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-red text-white font-sans font-bold text-lg py-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ minHeight: '64px' }}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido por WhatsApp'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
