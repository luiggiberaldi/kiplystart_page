import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { findLocalTracking } from '../../lib/dropanasTrackingStore';

export default function TrackingWidget({ initialQuery = '' }) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
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

        try {
            const cleanQuery = query.trim();
            const cleanDigits = cleanQuery.replace(/\D/g, '');
            const cleanDp = cleanQuery.replace(/^[dD][pP]-?/, '');

            // 1. Check in DroPanas Real Tracking Registry
            const registryMatch = findLocalTracking(cleanQuery);
            if (registryMatch) {
                setTrackingData(registryMatch);
                setLoading(false);
                return;
            }

            // 2. Check in Supabase orders table
            let orFilters = [`order_id.ilike.%${cleanQuery}%`];
            if (cleanDigits.length >= 7) {
                orFilters.push(`user_phone.ilike.%${cleanDigits}%`);
            }
            if (/^\d+$/.test(cleanDp)) {
                orFilters.push(`order_id.ilike.%DP${cleanDp}%`);
            }

            const { data: orders, error: dbErr } = await supabase
                .from('orders')
                .select('*')
                .or(orFilters.join(','))
                .order('created_at', { ascending: false })
                .limit(1);

            if (orders && orders.length > 0) {
                const ord = orders[0];
                let history = [];
                let notesObj = {};
                try {
                    notesObj = ord.notes ? JSON.parse(ord.notes) : {};
                    history = notesObj.historial || [];
                } catch {
                    // Notes not JSON
                }

                if (!history.length) {
                    history = [
                        { status: 'Recibido', descripcion: 'Pedido registrado en sistema', created_at: ord.created_at }
                    ];
                    if (ord.status === 'delivered' || ord.status === 'Entregado') {
                        history.push({ status: 'Entregado', descripcion: 'Pedido entregado y confirmado', created_at: ord.updated_at || ord.created_at });
                    }
                }

                setTrackingData({
                    order_id: ord.order_id,
                    dropanas_order_id: notesObj.dropanas_id || ord.order_id,
                    guide_number: ord.order_id.startsWith('DP') ? ord.order_id : `DP-${ord.order_id}`,
                    customer_name: ord.user_name || 'Cliente KiplyStart',
                    customer_phone: ord.user_phone || '',
                    current_status: ord.status || 'En proceso',
                    delivery_address: ord.delivery_address || 'Dirección de entrega',
                    city: ord.city || '',
                    state: ord.state || '',
                    product_name: ord.product_name || 'Artículos KiplyStart',
                    total_usd: ord.total_price || 0,
                    novelty: notesObj.novedad || null,
                    history
                });
            } else {
                setError(`No encontramos ningún pedido registrado con "${cleanQuery}". Verifica los datos o consulta a nuestro equipo por WhatsApp.`);
            }
        } catch (err) {
            console.error('Error buscando tracking:', err);
            setError('Ocurrió un error al consultar el rastreo. Por favor intenta más tarde.');
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

    // Calculate timeline step from status
    const getStatusStep = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('entregado') || s.includes('pagado') || s.includes('completado')) return 4;
        if (s.includes('reparto') || s.includes('camino') || s.includes('tránsito') || s.includes('transito') || s.includes('devolución') || s.includes('novedad')) return 3;
        if (s.includes('preparacion') || s.includes('preparación') || s.includes('generada') || s.includes('bodega') || s.includes('despachado')) return 2;
        return 1;
    };

    const currentStep = getStatusStep(trackingData?.current_status);
    const isReturnedOrNovelty = (trackingData?.current_status || '').toLowerCase().includes('devoluci') || (trackingData?.current_status || '').toLowerCase().includes('novedad') || (trackingData?.current_status || '').toLowerCase().includes('cancel');

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A2463]/10 text-[#0A2463] mb-4">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight">
                    Rastrea Tu Pedido en Tiempo Real
                </h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base font-medium">
                    Ingresa tu número de guía (ej: <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">DP28377</span> o <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">DP29695</span>) o teléfono
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
                        placeholder="Ej: DP28377, DP29695 o 04149489704..."
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
            {trackingData && (
                <div className="border-2 border-gray-200 rounded-3xl p-6 sm:p-8 bg-slate-50/90 shadow-md animate-fadeIn">
                    {/* Order Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Número de Guía Oficial</span>
                            <p className="text-xl md:text-2xl font-black text-gray-950 mt-0.5">
                                {trackingData.guide_number || trackingData.order_id}
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Estado Logístico Real</span>
                            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border mt-1 ${
                                isReturnedOrNovelty 
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : currentStep === 4 
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                        : 'bg-blue-100 text-blue-900 border-blue-300'
                            }`}>
                                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                                    isReturnedOrNovelty ? 'bg-amber-600' : currentStep === 4 ? 'bg-emerald-600' : 'bg-blue-600'
                                }`}></span>
                                {trackingData.current_status}
                            </div>
                        </div>
                    </div>

                    {/* Novelty / Incident Alert if applicable */}
                    {trackingData.novelty && (
                        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-xs font-bold flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">warning</span>
                            <div>
                                <span className="font-extrabold uppercase">Nota de Entrega / Novedad:</span> {trackingData.novelty}
                            </div>
                        </div>
                    )}

                    {/* Visual Progress Steps */}
                    <div className="py-8">
                        <div className="grid grid-cols-4 gap-2 relative">
                            {/* Connecting Line */}
                            <div className="absolute top-5 left-[12%] right-[12%] h-1.5 bg-gray-200 -z-0 rounded-full">
                                <div
                                    className={`h-full transition-all duration-700 rounded-full ${
                                        isReturnedOrNovelty ? 'bg-amber-500' : 'bg-emerald-600'
                                    }`}
                                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                ></div>
                            </div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">1. Recibido</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Confirmado</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">2. En Bodega</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Empacado</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                    currentStep >= 3 
                                        ? isReturnedOrNovelty ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    <span className="material-symbols-outlined text-xl">
                                        {isReturnedOrNovelty ? 'assignment_late' : 'local_shipping'}
                                    </span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">
                                    {isReturnedOrNovelty ? '3. Novedad' : '3. En Reparto'}
                                </span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Ruta Nacional</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 4 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-xl">home</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">4. Entregado</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Pago Contra Entrega</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed History Timeline (Real Events) */}
                    {Array.isArray(trackingData.history) && trackingData.history.length > 0 && (
                        <div className="mt-4 pt-6 border-t border-gray-200">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-4">
                                Historial Real de Movimientos ({trackingData.history.length} eventos)
                            </h4>
                            <div className="space-y-3">
                                {trackingData.history.slice().reverse().map((h, i) => (
                                    <div key={h.id || i} className="flex items-start gap-3 text-xs bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                                        <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                                            (h.status || '').toLowerCase().includes('devoluci') || (h.status || '').toLowerCase().includes('novedad') 
                                                ? 'bg-amber-500' 
                                                : 'bg-emerald-500'
                                        }`}></span>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="font-extrabold text-gray-950 text-sm">{h.status}</span>
                                                <span className="text-gray-500 font-semibold text-[11px]">
                                                    {h.created_at ? new Date(h.created_at).toLocaleString('es-VE') : ''}
                                                </span>
                                            </div>
                                            {h.descripcion && (
                                                <p className="text-gray-600 mt-1 font-medium">{h.descripcion}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-xs text-gray-700 mt-6 bg-white p-4 rounded-2xl border">
                        <div>
                            <p className="font-bold text-gray-900">Destinatario:</p>
                            <p className="font-extrabold text-gray-950 text-sm mt-0.5">{trackingData.customer_name}</p>
                            {trackingData.customer_phone && (
                                <p className="text-gray-600 font-medium">📱 {trackingData.customer_phone}</p>
                            )}
                            <p className="text-gray-500 mt-1 leading-relaxed">{trackingData.delivery_address}</p>
                            {trackingData.city && (
                                <p className="text-gray-500 font-semibold">{trackingData.city}, {trackingData.state}</p>
                            )}
                        </div>
                        <div className="md:text-right">
                            <p className="font-bold text-gray-900">Artículo / Paquete:</p>
                            <p className="font-extrabold text-gray-950 mt-0.5">{trackingData.product_name}</p>
                            <p className="font-bold text-emerald-700 text-sm mt-1">Total: ${trackingData.total_usd?.toFixed(2)} USD</p>
                            <p className="text-gray-500 text-[11px] mt-0.5 font-medium">Pago Contra Entrega (Tasa Oficial BCV)</p>
                        </div>
                    </div>

                    {/* WhatsApp Logistics Support */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-gray-600 font-medium">¿Tienes dudas con tu entrega o necesitas reprogramar?</span>
                        <a
                            href={`https://wa.me/584124340546?text=${encodeURIComponent(`Hola KiplyStart, necesito información sobre mi guía ${trackingData.guide_number}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            <span>Contactar Soporte por WhatsApp</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
