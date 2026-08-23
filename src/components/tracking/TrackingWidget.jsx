import { useState, useEffect } from 'react';
import { getOrderTracking } from '../../lib/dropanasApi';
import { supabase } from '../../lib/supabaseClient';

export default function TrackingWidget({ initialQuery = '' }) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [localOrder, setLocalOrder] = useState(null);
    const [error, setError] = useState('');

    const executeSearch = async (queryStr) => {
        const query = (queryStr || searchQuery).trim();
        if (!query) {
            setError('Por favor ingresa un número de guía (ej: DP28377), número de pedido o teléfono');
            return;
        }

        setLoading(true);
        setError('');
        setTrackingData(null);
        setLocalOrder(null);

        try {
            // 1. Check local order in Supabase by order_id or user_phone
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .or(`order_id.eq.${query},user_phone.ilike.%${query}%`)
                .order('created_at', { ascending: false })
                .limit(1);

            const matchedOrder = orders && orders.length > 0 ? orders[0] : null;
            if (matchedOrder) {
                setLocalOrder(matchedOrder);
            }

            // 2. Query DroPanas Tracking (supports DP28377, 28377, KS-...)
            const apiRes = await getOrderTracking(query);

            if (apiRes.success && apiRes.data) {
                setTrackingData(apiRes.data);
            } else if (!matchedOrder) {
                setError(apiRes.message || `No encontramos ningún pedido o guía con el identificador "${query}". Verifica el número e intenta nuevamente.`);
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

    useEffect(() => {
        if (initialQuery) {
            setSearchQuery(initialQuery);
            executeSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        executeSearch();
    };

    // Calculate timeline step from status string
    const currentStatus = (trackingData?.status_actual || trackingData?.estado || localOrder?.status || '').toLowerCase();
    
    const getStatusStep = (status) => {
        if (status.includes('entregado') || status.includes('pagado') || status.includes('completado')) return 4;
        if (status.includes('reparto') || status.includes('camino') || status.includes('tránsito') || status.includes('transito')) return 3;
        if (status.includes('preparacion') || status.includes('generada') || status.includes('bodega') || status.includes('despachado')) return 2;
        return 1; // Pendiente / Recibido
    };

    const currentStep = getStatusStep(currentStatus);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A2463]/10 text-[#0A2463] mb-4">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight">
                    Rastrea Tu Pedido en Tiempo Real
                </h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base font-medium">
                    Ingresa tu número de guía (ej: <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">DP28377</span>), orden o teléfono
                </p>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ej: DP28377, KS-20260822-4921 o teléfono..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-300 bg-white text-gray-950 placeholder-gray-400 focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/15 outline-none transition-all text-base font-semibold shadow-inner"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-[#0A2463] hover:bg-[#071630] active:scale-95 text-white font-extrabold rounded-2xl shadow-xl shadow-[#0A2463]/30 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 cursor-pointer"
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
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 flex items-start gap-3 mb-6 text-sm font-medium">
                    <span className="material-symbols-outlined text-red-600 text-xl shrink-0 mt-0.5">error</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Result Card */}
            {(trackingData || localOrder) && (
                <div className="border-2 border-gray-200 rounded-3xl p-6 sm:p-8 bg-slate-50/90 shadow-md animate-fadeIn">
                    {/* Order Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Número de Guía / Orden</span>
                            <p className="text-xl md:text-2xl font-black text-gray-950 mt-0.5">
                                {trackingData?.numero_guia || localOrder?.order_id || searchQuery.toUpperCase()}
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Estado de Entrega</span>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mt-1 block">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                {trackingData?.status_actual || localOrder?.status || 'En Proceso'}
                            </div>
                        </div>
                    </div>

                    {/* Visual Progress Steps */}
                    <div className="py-8">
                        <div className="grid grid-cols-4 gap-2 relative">
                            {/* Connecting Line */}
                            <div className="absolute top-5 left-[12%] right-[12%] h-1.5 bg-gray-200 -z-0 rounded-full">
                                <div
                                    className="h-full bg-brand-red transition-all duration-700 rounded-full"
                                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                ></div>
                            </div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 1 ? 'bg-brand-red text-white shadow-lg shadow-brand-red/40' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">1. Recibido</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Confirmado</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 2 ? 'bg-brand-red text-white shadow-lg shadow-brand-red/40' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">2. En Bodega</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Empaque y Guía</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 3 ? 'bg-brand-red text-white shadow-lg shadow-brand-red/40' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">3. En Reparto</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Ruta Nacional</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 4 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">home</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">4. Entregado</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Pagas al Recibir</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed History Timeline (from DroPanas) */}
                    {Array.isArray(trackingData?.historial) && trackingData.historial.length > 0 && (
                        <div className="mt-4 pt-6 border-t border-gray-200">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-4">
                                Historial de Movimientos
                            </h4>
                            <div className="space-y-3">
                                {trackingData.historial.slice().reverse().map((h, i) => (
                                    <div key={h.id || i} className="flex items-start gap-3 text-xs bg-white p-3 rounded-xl border border-gray-200">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-bold text-gray-900 text-sm">{h.status}</span>
                                                <span className="text-gray-400 text-[11px]">
                                                    {h.created_at ? new Date(h.created_at).toLocaleString('es-VE') : ''}
                                                </span>
                                            </div>
                                            {h.descripcion && (
                                                <p className="text-gray-600 mt-0.5">{h.descripcion}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-xs text-gray-700 mt-6">
                        <div>
                            <p className="font-bold text-gray-900">Destinatario:</p>
                            <p className="font-semibold text-gray-800">{localOrder?.user_name || 'Cliente KiplyStart'}</p>
                            <p className="text-gray-500 mt-0.5">{localOrder?.delivery_address || localOrder?.city}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="font-bold text-gray-900">Método de Pago:</p>
                            <p className="text-emerald-700 font-extrabold">Pago Contra Entrega (Tasa BCV)</p>
                            <p className="text-gray-500 mt-0.5">Primero revisas tu paquete, luego cancelas</p>
                        </div>
                    </div>

                    {/* WhatsApp Logistics Support */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-gray-600 font-medium">¿Tienes dudas con tu entrega o necesitas reprogramar?</span>
                        <a
                            href="https://wa.me/584124340546?text=Hola%20KiplyStart,%20necesito%20asistencia%20con%20mi%20pedido"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
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
