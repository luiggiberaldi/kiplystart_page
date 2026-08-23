import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { findLocalTracking } from '../../lib/dropanasTrackingStore';
import { 
    Search, Truck, Package, CheckCircle2, AlertCircle, XCircle, 
    Clock, MapPin, Phone, User, ArrowRight, MessageCircle, 
    ShieldCheck, Building2, HelpCircle, X
} from 'lucide-react';

export default function TrackingWidget({ initialQuery = '' }) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState('');

    const executeSearch = async (queryStr) => {
        const query = (queryStr !== undefined ? queryStr : searchQuery).trim();
        if (!query) {
            setError('Por favor ingresa tu número de guía (ej: DP28377), número de pedido o teléfono');
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
                        history.push({ status: 'Entregado', descripcion: 'Pedido entregado y verificado', created_at: ord.updated_at || ord.created_at });
                    } else if (ord.status === 'cancelled' || ord.status === 'Cancelado') {
                        history.push({ status: 'Cancelado', descripcion: 'El pedido fue cancelado', created_at: ord.updated_at || ord.created_at });
                    }
                }

                setTrackingData({
                    order_id: ord.order_id,
                    dropanas_order_id: notesObj.dropanas_id || ord.order_id,
                    guide_number: ord.order_id.startsWith('DP') ? ord.order_id : `DP-${ord.order_id}`,
                    carrier: notesObj.transportadora || 'Tealca / Mensajería Express',
                    warehouse: 'MEGABODEGA - CARACAS',
                    shipping_type: ord.shipping_type || 'Contra Entrega',
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
                setError(`No encontramos ningún pedido registrado con "${cleanQuery}". Por favor verifica el número o consúltanos por WhatsApp.`);
            }
        } catch (err) {
            console.error('Error buscando tracking:', err);
            setError('Ocurrió un error al consultar el rastreo. Por favor intenta nuevamente.');
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

    const handleExampleClick = (code) => {
        setSearchQuery(code);
        executeSearch(code);
    };

    // Calculate status type for coloring & banners
    const getStatusCategory = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('cancel')) return 'cancelled';
        if (s.includes('devoluci') || s.includes('novedad')) return 'returned';
        if (s.includes('entregado') || s.includes('pagado') || s.includes('completado')) return 'delivered';
        if (s.includes('reparto') || s.includes('camino') || s.includes('tránsito') || s.includes('transito') || s.includes('origen')) return 'in_transit';
        return 'processing';
    };

    const statusCategory = getStatusCategory(trackingData?.current_status);

    const getStatusStep = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('cancel')) return 0; // Special cancelled state
        if (s.includes('entregado') || s.includes('pagado') || s.includes('completado')) return 4;
        if (s.includes('reparto') || s.includes('camino') || s.includes('tránsito') || s.includes('transito') || s.includes('devolución') || s.includes('novedad')) return 3;
        if (s.includes('preparacion') || s.includes('preparación') || s.includes('generada') || s.includes('bodega') || s.includes('despachado')) return 2;
        return 1;
    };

    const currentStep = getStatusStep(trackingData?.current_status);

    // Event dot color
    const getEventDotColor = (statusStr) => {
        const s = (statusStr || '').toLowerCase();
        if (s.includes('cancel')) return 'bg-rose-500 ring-rose-200';
        if (s.includes('devoluci') || s.includes('novedad')) return 'bg-amber-500 ring-amber-200';
        if (s.includes('entregado') || s.includes('pagado')) return 'bg-emerald-500 ring-emerald-200';
        if (s.includes('camino') || s.includes('reparto') || s.includes('tránsito') || s.includes('transito')) return 'bg-blue-500 ring-blue-200';
        return 'bg-[#0A2463] ring-blue-100';
    };

    // Format date in Venezuelan Spanish cleanly
    const formatTimestamp = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('es-VE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Search Box Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-8 space-y-5">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-[#0A2463] border border-blue-100 shadow-2xs">
                        <Truck className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                        Rastrea Tu Pedido en Tiempo Real
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        Ingresa tu número de guía o teléfono registrado:
                    </p>

                    {/* Example guide buttons */}
                    <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1 text-xs text-gray-500">
                        <span className="font-semibold text-gray-400">Ejemplos rápidos:</span>
                        <button
                            type="button"
                            onClick={() => handleExampleClick('DP28377')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono font-bold px-2.5 py-1 rounded-lg transition-colors border border-gray-200/80 cursor-pointer"
                        >
                            DP28377
                        </button>
                        <button
                            type="button"
                            onClick={() => handleExampleClick('DP29695')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono font-bold px-2.5 py-1 rounded-lg transition-colors border border-gray-200/80 cursor-pointer"
                        >
                            DP29695
                        </button>
                        <button
                            type="button"
                            onClick={() => handleExampleClick('DP24817')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono font-bold px-2.5 py-1 rounded-lg transition-colors border border-gray-200/80 cursor-pointer"
                        >
                            DP24817
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ej: DP28377 o 04149489704..."
                            className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/50 text-gray-950 placeholder-gray-400 focus:bg-white focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/10 outline-none transition-all text-sm sm:text-base font-semibold"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-7 py-4 bg-[#0A2463] hover:bg-[#071630] active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-lg shadow-[#0A2463]/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 cursor-pointer shrink-0"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Buscando...</span>
                            </>
                        ) : (
                            <>
                                <span>Rastrear</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Error Box */}
                {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs sm:text-sm font-medium animate-fadeIn">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-bold">No se encontró el pedido</p>
                            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tracking Result Card */}
            {trackingData && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-8 space-y-6 animate-fadeIn">
                    {/* Top Meta Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                                    Número de Guía Oficial
                                </span>
                                {trackingData.carrier && (
                                    <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-slate-200">
                                        {trackingData.carrier}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-mono mt-1">
                                {trackingData.guide_number || trackingData.order_id}
                            </h3>
                        </div>

                        {/* Status Badge */}
                        <div className="flex flex-col sm:items-end">
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                                Estado Logístico Actual
                            </span>
                            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border shadow-2xs ${
                                statusCategory === 'cancelled'
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : statusCategory === 'returned'
                                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                                        : statusCategory === 'delivered'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                            : 'bg-blue-50 text-blue-900 border-blue-200'
                            }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                    statusCategory === 'cancelled'
                                        ? 'bg-rose-500'
                                        : statusCategory === 'returned'
                                            ? 'bg-amber-500 animate-pulse'
                                            : statusCategory === 'delivered'
                                                ? 'bg-emerald-500'
                                                : 'bg-blue-600 animate-ping'
                                }`}></span>
                                <span>{trackingData.current_status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Context Banner */}
                    {statusCategory === 'cancelled' ? (
                        <div className="bg-rose-50/80 border-2 border-rose-200/90 rounded-2xl p-4 flex items-start gap-3 text-rose-950">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm">
                                <p className="font-black">Pedido Cancelado</p>
                                <p className="text-rose-800 text-xs mt-0.5 leading-relaxed">
                                    Este despacho figura como cancelado. Si deseas reactivarlo o tienes alguna duda, puedes contactar a nuestro equipo de atención por WhatsApp.
                                </p>
                            </div>
                        </div>
                    ) : statusCategory === 'returned' || trackingData.novelty ? (
                        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm">
                                <p className="font-black">Novedad / Retorno en Proceso</p>
                                <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                                    {trackingData.novelty || 'Se registró una novedad en la entrega. El paquete está siendo gestionado por la logística.'}
                                </p>
                            </div>
                        </div>
                    ) : statusCategory === 'delivered' ? (
                        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-950">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm">
                                <p className="font-black">¡Pedido Entregado con Éxito!</p>
                                <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                                    El paquete fue entregado y verificado por el destinatario bajo modalidad Contra Entrega.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-blue-950">
                            <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm">
                                <p className="font-black">Paquete en Tránsito</p>
                                <p className="text-blue-800 text-xs mt-0.5 leading-relaxed">
                                    Tu envío va en camino hacia {trackingData.city || 'tu destino'}. El repartidor se comunicará contigo antes de la entrega.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stepper Progress Bar */}
                    <div className="py-4">
                        <div className="grid grid-cols-4 gap-2 relative">
                            {/* Connecting Background Line */}
                            <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-gray-200 rounded-full -z-0">
                                <div
                                    className={`h-full transition-all duration-700 rounded-full ${
                                        statusCategory === 'cancelled'
                                            ? 'bg-rose-500'
                                            : statusCategory === 'returned'
                                                ? 'bg-amber-500'
                                                : 'bg-emerald-600'
                                    }`}
                                    style={{
                                        width: statusCategory === 'cancelled' 
                                            ? '33%' 
                                            : `${Math.max(0, ((currentStep - 1) / 3) * 100)}%`
                                    }}
                                ></div>
                            </div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                                    currentStep >= 1 || statusCategory === 'cancelled'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-4 ring-emerald-50'
                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                }`}>
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">1. Recibido</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Confirmado</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                                    statusCategory === 'cancelled'
                                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-4 ring-rose-50'
                                        : currentStep >= 2
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-4 ring-emerald-50'
                                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                                }`}>
                                    {statusCategory === 'cancelled' ? (
                                        <XCircle className="w-5 h-5" />
                                    ) : (
                                        <Package className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">
                                    {statusCategory === 'cancelled' ? '2. Cancelado' : '2. En Bodega'}
                                </span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">
                                    {statusCategory === 'cancelled' ? 'Anulado' : 'Empacado'}
                                </span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                                    statusCategory === 'returned'
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-4 ring-amber-50'
                                        : currentStep >= 3
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-4 ring-emerald-50'
                                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                                }`}>
                                    {statusCategory === 'returned' ? (
                                        <AlertCircle className="w-5 h-5" />
                                    ) : (
                                        <Truck className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">
                                    {statusCategory === 'returned' ? '3. Novedad' : '3. En Reparto'}
                                </span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">
                                    {statusCategory === 'returned' ? 'En retorno' : 'Ruta Nacional'}
                                </span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                                    currentStep >= 4
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-4 ring-emerald-50'
                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                }`}>
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black text-gray-900 mt-2">4. Entregado</span>
                                <span className="text-[11px] text-gray-500 hidden sm:block">Pago Contra Entrega</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline History Section */}
                    {Array.isArray(trackingData.history) && trackingData.history.length > 0 && (
                        <div className="pt-6 border-t border-gray-100 space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#0A2463]" />
                                <span>Historial de Movimientos ({trackingData.history.length} eventos)</span>
                            </h4>

                            <div className="space-y-2.5">
                                {trackingData.history.slice().reverse().map((h, idx) => (
                                    <div 
                                        key={idx}
                                        className="bg-slate-50/80 hover:bg-slate-100/80 border border-gray-200/70 rounded-2xl p-3.5 transition-all flex items-start gap-3.5"
                                    >
                                        <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ring-4 ${getEventDotColor(h.status)}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center justify-between gap-1">
                                                <h5 className="font-extrabold text-sm text-gray-950">
                                                    {h.status}
                                                </h5>
                                                <span className="text-[11px] font-semibold text-gray-500">
                                                    {formatTimestamp(h.created_at)}
                                                </span>
                                            </div>
                                            {h.descripcion && (
                                                <p className="text-xs text-gray-600 mt-0.5 font-medium leading-relaxed">
                                                    {h.descripcion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recipient and Package Summary 2-Column Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                        {/* Destinatario Card */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-gray-200/80 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-black text-gray-900 border-b border-gray-200/60 pb-2">
                                <User className="w-4 h-4 text-[#0A2463]" />
                                <span>Datos del Destinatario</span>
                            </div>
                            <div>
                                <p className="font-extrabold text-sm text-gray-950">{trackingData.customer_name}</p>
                                {trackingData.customer_phone && (
                                    <p className="text-xs text-gray-600 font-semibold mt-0.5 flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{trackingData.customer_phone}</span>
                                    </p>
                                )}
                            </div>
                            <div className="text-xs text-gray-600 space-y-0.5 pt-1">
                                <p className="flex items-start gap-1 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                    <span>{trackingData.delivery_address}</span>
                                </p>
                                {trackingData.city && (
                                    <p className="font-bold text-gray-800 pl-4.5">
                                        {trackingData.city}, {trackingData.state}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Package & Payment Card */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-gray-200/80 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-black text-gray-900 border-b border-gray-200/60 pb-2">
                                <Package className="w-4 h-4 text-[#0A2463]" />
                                <span>Detalles del Envío</span>
                            </div>
                            <div>
                                <p className="font-extrabold text-sm text-gray-950 leading-snug">{trackingData.product_name}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="font-black text-base text-emerald-700">
                                        ${trackingData.total_usd?.toFixed(2)} USD
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                                        Tasa Oficial BCV
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-600 pt-1 flex items-center gap-1.5 font-medium">
                                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Modalidad: Pago al Recibir en Efectivo o Pago Móvil</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Support Callout */}
                    <div className="pt-6 border-t border-gray-100 bg-gradient-to-r from-blue-50/50 via-slate-50 to-emerald-50/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-100/80">
                        <div className="text-center sm:text-left space-y-0.5">
                            <p className="font-black text-xs sm:text-sm text-gray-900">
                                ¿Tienes dudas con tu entrega o necesitas reprogramar?
                            </p>
                            <p className="text-xs text-gray-600">
                                Nuestro equipo de soporte logístico te atiende directamente por WhatsApp.
                            </p>
                        </div>
                        <a
                            href={`https://wa.me/584124340546?text=${encodeURIComponent(`Hola KiplyStart, necesito información sobre mi número de guía ${trackingData.guide_number || trackingData.order_id}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-black text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-5 py-3 rounded-2xl shadow-md shadow-emerald-600/25 transition-all shrink-0 cursor-pointer"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Consultar por WhatsApp</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
