import { useState } from 'react';
import { getOrderTracking } from '../../lib/dropanasApi';
import { supabase } from '../../lib/supabaseClient';

export default function TrackingWidget({ initialQuery = '' }) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [localOrder, setLocalOrder] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        const query = searchQuery.trim();
        if (!query) {
            setError('Por favor ingresa un número de pedido o teléfono');
            return;
        }

        setLoading(true);
        setError('');
        setTrackingData(null);
        setLocalOrder(null);

        try {
            // 1. Check local order in Supabase by order_number or user_phone
            const { data: orders, error: dbError } = await supabase
                .from('orders')
                .select('*')
                .or(`order_number.eq.${query},user_phone.ilike.%${query}%`)
                .order('created_at', { ascending: false })
                .limit(1);

            let matchedOrder = orders && orders.length > 0 ? orders[0] : null;
            setLocalOrder(matchedOrder);

            // 2. Query DroPanas Tracking API
            const trackingLookupId = matchedOrder ? (matchedOrder.dropanas_order_id || matchedOrder.order_number) : query;
            const apiRes = await getOrderTracking(trackingLookupId);

            if (apiRes.success && apiRes.data) {
                setTrackingData(apiRes.data);
            } else if (!matchedOrder) {
                setError('No encontramos ningún pedido con ese número o teléfono. Verifica los datos e intenta nuevamente.');
            }
        } catch (err) {
            console.error('Error buscando tracking:', err);
            if (!localOrder) {
                setError('Ocurrió un error al consultar el rastreo. Por favor intenta más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('entregado') || s.includes('completado')) return 4;
        if (s.includes('reparto') || s.includes('camino') || s.includes('ruta')) return 3;
        if (s.includes('bodega') || s.includes('despachado') || s.includes('guia') || s.includes('transito')) return 2;
        return 1; // Recibido / Procesando
    };

    const currentStep = getStatusStep(trackingData?.estado || localOrder?.status);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-navy/10 text-brand-navy mb-4">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Rastrea Tu Pedido en Tiempo Real
                </h2>
                <p className="text-gray-500 mt-2 text-sm md:text-base">
                    Ingresa tu número de orden (ej: <span className="font-semibold text-gray-700">KS-20260822-4921</span>) o tu teléfono
                </p>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Número de orden o teléfono celular..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 outline-none transition-all text-base font-medium"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-brand-navy hover:bg-brand-navy/90 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-brand-navy/20 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Buscando...</span>
                        </>
                    ) : (
                        <>
                            <span>Rastrear</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 flex items-center gap-3 mb-6 text-sm">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Result Card */}
            {(trackingData || localOrder) && (
                <div className="border border-gray-100 rounded-2xl p-6 bg-slate-50/70 animate-fade-in">
                    {/* Order Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Número de Orden</span>
                            <p className="text-lg md:text-xl font-extrabold text-gray-900">
                                {localOrder?.order_number || trackingData?.referencia || searchQuery}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Estado Actual</span>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {trackingData?.estado || localOrder?.status || 'Procesando En Bodega'}
                            </div>
                        </div>
                    </div>

                    {/* Visual Progress Steps */}
                    <div className="py-8">
                        <div className="grid grid-cols-4 gap-2 relative">
                            {/* Connecting Line */}
                            <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-gray-200 -z-0">
                                <div
                                    className="h-full bg-brand-red transition-all duration-700"
                                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                ></div>
                            </div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 1 ? 'bg-brand-red text-white shadow-md shadow-brand-red/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800 mt-2">Recibido</span>
                                <span className="text-[10px] text-gray-400 hidden sm:block">Confirmado</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 2 ? 'bg-brand-red text-white shadow-md shadow-brand-red/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800 mt-2">En Bodega</span>
                                <span className="text-[10px] text-gray-400 hidden sm:block">Empaque y Guía</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 3 ? 'bg-brand-red text-white shadow-md shadow-brand-red/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800 mt-2">En Camino</span>
                                <span className="text-[10px] text-gray-400 hidden sm:block">Ruta Nacional</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 4 ? 'bg-green-600 text-white shadow-md shadow-green-600/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-lg">home</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800 mt-2">Entregado</span>
                                <span className="text-[10px] text-gray-400 hidden sm:block">Pago al Recibir</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200/80 text-sm text-gray-600">
                        <div>
                            <p className="font-semibold text-gray-900">Destinatario:</p>
                            <p>{localOrder?.user_name || trackingData?.cliente_nombre || 'Cliente KiplyStart'}</p>
                            <p className="text-xs text-gray-400 mt-1">{localOrder?.delivery_address || trackingData?.direccion}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="font-semibold text-gray-900">Método de Pago:</p>
                            <p className="text-green-700 font-bold">Pago Contra Entrega (Tasa BCV)</p>
                            <p className="text-xs text-gray-400 mt-1">Primero revisas tu paquete, luego pagas</p>
                        </div>
                    </div>

                    {/* WhatsApp Logistics Support */}
                    <div className="mt-6 pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-gray-500">¿Tienes dudas con tu entrega o necesitas reprogramar?</span>
                        <a
                            href="https://wa.me/584124340546?text=Hola%20KiplyStart,%20necesito%20asistencia%20con%20mi%20pedido"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-green-600 hover:text-green-700"
                        >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            <span>Contactar Logística por WhatsApp</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
