import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import { ZONES } from '../cod/codData';
import { 
    Truck, CheckCircle2, RotateCcw, Trash2, 
    Search, MessageCircle, Clock, 
    Building2, MapPin, User, AlertTriangle, 
    Sparkles, RefreshCw, Layers, ExternalLink
} from 'lucide-react';

export default function OrdersManager() {
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [contactOrder, setContactOrder] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(orderId, newStatus) {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            fetchOrders();
        } catch (error) {
            alert('Error actualizando pedido: ' + error.message);
        }
    }

    /* ===== Delete Logic (Soft & Hard) ===== */
    async function moveToTrash(orderId) {
        await updateOrderStatus(orderId, 'deleted');
    }

    async function restoreOrder(orderId) {
        await updateOrderStatus(orderId, 'pending_whatsapp');
    }

    async function confirmDeleteOrder() {
        if (!orderToDelete) return;
        try {
            const { error } = await supabase.from('orders').delete().eq('id', orderToDelete.id);
            if (error) throw error;
            fetchOrders();
            setOrderToDelete(null);
        } catch (e) {
            alert('Error eliminando permanentemente: ' + e.message);
        }
    }

    async function emptyTrash() {
        if (!window.confirm('¿Estás seguro de que deseas vaciar la papelera? Se eliminarán todos los pedidos en ella de forma permanente.')) return;
        try {
            const { error } = await supabase.from('orders').delete().eq('status', 'deleted');
            if (error) throw error;
            fetchOrders();
        } catch (e) {
            alert('Error vaciando papelera: ' + e.message);
        }
    }

    /* ===== WhatsApp Templates Logic ===== */
    const getCleanPhone = (phone) => {
        if (!phone) return '';
        const p = phone.replace(/\D/g, '');
        return p.startsWith('0') ? '58' + p.substring(1) : p;
    };

    const getDeliveryEstimation = (state) => {
        const zone = ZONES.find(z => z.state === state);
        return zone?.delivery || '24 a 48 horas';
    };

    const sendWhatsApp = (templateType) => {
        if (!contactOrder) return;
        const { user_name, order_id, id, product_name, total_price, city, state, delivery_address } = contactOrder;
        const displayId = order_id || id?.slice(0, 8);
        const phone = getCleanPhone(contactOrder.user_phone);
        const estimation = getDeliveryEstimation(state);

        const TEMPLATES = {
            confirm:
                `Hola *${user_name}*, te saludamos de *KiplyStart* 🚀\n\n` +
                `Recibimos tu pedido *#${displayId}* de: *${product_name}*.\n` +
                `💰 Total con Envío Gratis: *${formatPrice(total_price)}*\n\n` +
                `Para proceder con el despacho por Tealca / DroPanas, ¿nos podrías confirmar tu dirección exacta?\n` +
                `📍 *${delivery_address}, ${city}, ${state}*\n\n` +
                `¡Pagas al recibir! Quedamos atentos para despacharlo de inmediato.`,

            shipped:
                `¡Hola *${user_name}*! Buenas noticias 🚚💨\n\n` +
                `Tu pedido *#${displayId}* ya va en camino.\n\n` +
                `📦 Guía de Despacho: *${displayId}*\n` +
                `⏳ Tiempo estimado de llegada a *${city}, ${state}*: *${estimation}*.\n\n` +
                `Puedes rastrearlo en tiempo real en nuestra web: https://www.kiplystart.com/rastreo\n\n` +
                `¡Gracias por elegir KiplyStart!`,

            delivered:
                `¡Hola *${user_name}*! Esperamos que estés disfrutando tu compra 🌟\n\n` +
                `Vemos que tu pedido *#${displayId}* ha sido entregado exitosamente.\n` +
                `Si tienes alguna duda o necesitas soporte, estamos a tu orden.\n\n` +
                `¡Gracias por confiar en KiplyStart!`,

            custom:
                `Hola *${user_name}*, te escribo de KiplyStart respecto a tu pedido *#${displayId}*...`
        };

        const message = TEMPLATES[templateType];
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        setContactOrder(null);
    };

    /* ===== Helper to detect Carrier & Mode ===== */
    const getCarrierBadge = (order) => {
        const text = `${order.order_id} ${order.delivery_ref || ''} ${order.notes || ''}`.toLowerCase();
        if (text.includes('tealca') || order.order_id === '84714060') {
            return { name: 'Tealca', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        }
        if (text.includes('pídelo') || text.includes('pidelo')) {
            return { name: 'Pídelo y Punto', color: 'bg-amber-100 text-amber-800 border-amber-200' };
        }
        if (text.includes('zoom')) {
            return { name: 'Zoom', color: 'bg-orange-100 text-orange-800 border-orange-200' };
        }
        if (text.includes('mrw')) {
            return { name: 'MRW', color: 'bg-red-100 text-red-800 border-red-200' };
        }
        return { name: 'DroPanas COD', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    };

    /* ===== Filters & Search Logic ===== */
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status match
            let matchesStatus = true;
            if (filterStatus === 'deleted') {
                matchesStatus = order.status === 'deleted';
            } else if (filterStatus === 'all') {
                matchesStatus = order.status !== 'deleted';
            } else if (filterStatus === 'shipped') {
                matchesStatus = order.status === 'shipped' || order.status === 'En camino';
            } else if (filterStatus === 'delivered') {
                matchesStatus = order.status === 'delivered' || order.status === 'Pagado' || order.status === 'Entregado';
            } else if (filterStatus === 'cancelled') {
                matchesStatus = order.status === 'cancelled' || order.status === 'Cancelado' || order.status === 'Devolución';
            } else {
                matchesStatus = order.status === filterStatus;
            }

            if (!matchesStatus) return false;

            // Search query match (Guía Tealca 84714060, DP29695, Cliente, Teléfono)
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const orderIdMatch = (order.order_id || '').toLowerCase().includes(term);
            const nameMatch = (order.user_name || '').toLowerCase().includes(term);
            const phoneMatch = (order.user_phone || '').includes(term);
            const refMatch = (order.delivery_ref || '').toLowerCase().includes(term);
            const prodMatch = (order.product_name || '').toLowerCase().includes(term);

            return orderIdMatch || nameMatch || phoneMatch || refMatch || prodMatch;
        });
    }, [orders, filterStatus, searchTerm]);

    const statusOptions = [
        { value: 'all', label: 'Todos', count: orders.filter(o => o.status !== 'deleted').length },
        { value: 'pending_whatsapp', label: 'Pendiente', count: orders.filter(o => o.status === 'pending_whatsapp' || o.status === 'Pendiente').length },
        { value: 'shipped', label: 'En camino / Tealca', count: orders.filter(o => o.status === 'shipped' || o.status === 'En camino').length },
        { value: 'delivered', label: 'Entregados / Pagados', count: orders.filter(o => o.status === 'delivered' || o.status === 'Pagado' || o.status === 'Entregado').length },
        { value: 'cancelled', label: 'Devolución / Cancelado', count: orders.filter(o => o.status === 'cancelled' || o.status === 'Cancelado' || o.status === 'Devolución').length },
        { value: 'deleted', label: 'Papelera', count: orders.filter(o => o.status === 'deleted').length }
    ];

    if (loading) {
        return (
            <div className="flex justify-center p-16">
                <div className="w-10 h-10 border-3 border-[#0A2463]/20 border-t-[#0A2463] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200/80">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                        Pedidos COD, DroPanas & Tealca
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Supervisa despachos en vivo, números de guía Tealca y coordina con clientes por WhatsApp
                    </p>
                </div>
                <button 
                    onClick={fetchOrders}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 shadow-xs cursor-pointer active:scale-95 transition-all self-start sm:self-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Actualizar Despachos</span>
                </button>
            </div>

            {/* Filter Pills and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                {/* Status Pills */}
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map(opt => (
                        <button 
                            key={opt.value} 
                            onClick={() => setFilterStatus(opt.value)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                                filterStatus === opt.value 
                                    ? 'bg-[#0A2463] text-white shadow-blue-900/20' 
                                    : 'bg-white text-gray-700 hover:bg-slate-100 border border-gray-200'
                            }`}
                        >
                            {opt.label} ({opt.count})
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input 
                        type="text"
                        placeholder="Buscar por Guía (ej: 84714060), cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0A2463] outline-none shadow-xs"
                    />
                </div>
            </div>

            {/* Empty Trash Action */}
            {filterStatus === 'deleted' && filteredOrders.length > 0 && (
                <div className="flex justify-end">
                    <button 
                        onClick={emptyTrash} 
                        className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 text-xs font-bold border border-red-200 rounded-2xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Vaciar Papelera Definitivamente</span>
                    </button>
                </div>
            )}

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-extrabold text-base text-gray-800">No se encontraron pedidos</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {searchTerm ? `No hay resultados para "${searchTerm}"` : 'No hay pedidos en esta sección'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const carrier = getCarrierBadge(order);
                        const isTealca = carrier.name === 'Tealca' || order.order_id === '84714060';

                        return (
                            <div 
                                key={order.id} 
                                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs hover:shadow-md transition-all ${
                                    order.status === 'deleted' 
                                        ? 'border-red-100 bg-red-50/10' 
                                        : isTealca 
                                            ? 'border-blue-200/80 ring-1 ring-blue-500/10' 
                                            : 'border-gray-200'
                                }`}
                            >
                                {/* Top Row: Order ID, Carrier, Date, Price */}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                                            <h4 className="font-black text-base text-gray-950 flex items-center gap-1.5">
                                                <span>Guía / Pedido:</span>
                                                <span className="text-[#0A2463] font-mono font-extrabold">#{order.order_id || order.id?.slice(0, 8)}</span>
                                            </h4>

                                            {/* Carrier Badge */}
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${carrier.color}`}>
                                                <Truck className="w-3 h-3" />
                                                {carrier.name}
                                            </span>

                                            {/* Status Badge */}
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                                                order.status === 'shipped' || order.status === 'En camino'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : order.status === 'delivered' || order.status === 'Pagado'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : order.status === 'cancelled' || order.status === 'Devolución'
                                                            ? 'bg-rose-100 text-rose-800'
                                                            : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {order.status === 'shipped' ? 'En camino' : order.status === 'delivered' ? 'Entregado' : order.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            {new Date(order.created_at).toLocaleDateString('es-VE', { 
                                                year: 'numeric', month: 'short', day: 'numeric', 
                                                hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-950 tabular-nums">
                                            {formatPrice(order.total_price)}
                                        </p>
                                        <p className="text-xs text-emerald-700 font-bold">
                                            Pago Contra Entrega (COD)
                                        </p>
                                    </div>
                                </div>

                                {/* Detail Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-100 text-xs">
                                    {/* Customer Column */}
                                    <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <User className="w-3 h-3" /> Cliente
                                        </p>
                                        <p className="font-extrabold text-gray-900 text-sm">{order.user_name}</p>
                                        <p className="font-mono text-gray-600 font-bold">{order.user_phone}</p>

                                        {order.status !== 'deleted' && (
                                            <button 
                                                onClick={() => setContactOrder(order)}
                                                className="inline-flex items-center gap-1.5 mt-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                <span>Contactar por WhatsApp</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Product Column */}
                                    <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Layers className="w-3 h-3" /> Producto
                                        </p>
                                        <p className="font-extrabold text-gray-900 text-sm">{order.product_name}</p>
                                        <p className="text-gray-600">Cantidad: <strong>{order.quantity || 1} un.</strong></p>
                                        <p className="text-gray-600">Precio unitario: <strong>{formatPrice(order.unit_price || order.total_price)}</strong></p>
                                    </div>

                                    {/* Logistics & Delivery Column */}
                                    <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Despacho & Bodega
                                        </p>
                                        <p className="font-extrabold text-gray-900 text-sm">{order.city}, {order.state}</p>
                                        <p className="text-gray-600 line-clamp-2 leading-relaxed">{order.delivery_address}</p>
                                        {order.delivery_ref && (
                                            <p className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 p-1 rounded-lg">
                                                {order.delivery_ref}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions & Status Toggle */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                                    {order.status === 'deleted' ? (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => restoreOrder(order.id)}
                                                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                <span>Restaurar</span>
                                            </button>
                                            <button
                                                onClick={() => setOrderToDelete(order)}
                                                className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1 ml-2 cursor-pointer"
                                                title="Eliminar permanentemente"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Eliminar Definitivamente</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-[11px] font-extrabold text-gray-500 mr-1">Estado:</span>
                                                {[
                                                    { id: 'pending_whatsapp', label: 'Pendiente' },
                                                    { id: 'shipped', label: 'En camino' },
                                                    { id: 'delivered', label: 'Entregado' },
                                                    { id: 'cancelled', label: 'Cancelado' }
                                                ].map(st => (
                                                    <button 
                                                        key={st.id} 
                                                        onClick={() => updateOrderStatus(order.id, st.id)}
                                                        disabled={order.status === st.id}
                                                        className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                                                            order.status === st.id 
                                                                ? 'bg-slate-200 text-gray-500 cursor-not-allowed' 
                                                                : 'bg-slate-100 hover:bg-slate-200 text-gray-800'
                                                        }`}
                                                    >
                                                        {st.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <a 
                                                    href={`/rastreo?id=${encodeURIComponent(order.order_id)}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2463] hover:underline"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>Rastrear en Vivo</span>
                                                </a>
                                                <button
                                                    onClick={() => moveToTrash(order.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                    title="Mover a papelera"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* WhatsApp Templates Modal */}
            {contactOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setContactOrder(null)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-scaleIn">
                        <div className="bg-[#075E54] text-white p-5">
                            <h3 className="font-extrabold text-lg flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Contactar Cliente por WhatsApp
                            </h3>
                            <p className="text-xs text-white/80 mt-0.5">{contactOrder.user_name} • {contactOrder.user_phone}</p>
                        </div>

                        <div className="p-5 space-y-2.5">
                            <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wider mb-2">Selecciona una plantilla:</p>

                            <button onClick={() => sendWhatsApp('confirm')} className="w-full text-left p-3.5 rounded-2xl border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group cursor-pointer">
                                <span className="block font-black text-xs sm:text-sm text-gray-900 group-hover:text-emerald-800">📋 Confirmar Pedido y Dirección</span>
                                <span className="block text-[11px] text-gray-500 mt-1">Solicita reconfirmación de datos antes de despachar.</span>
                            </button>

                            <button onClick={() => sendWhatsApp('shipped')} className="w-full text-left p-3.5 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all group cursor-pointer">
                                <span className="block font-black text-xs sm:text-sm text-gray-900 group-hover:text-blue-800">🚚 Notificar Envío / Guía Tealca</span>
                                <span className="block text-[11px] text-gray-500 mt-1">Envía el número de guía e instrucciones de rastreo.</span>
                            </button>

                            <button onClick={() => sendWhatsApp('delivered')} className="w-full text-left p-3.5 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all group cursor-pointer">
                                <span className="block font-black text-xs sm:text-sm text-gray-900 group-hover:text-purple-800">✨ Notificar Entrega / Soporte</span>
                                <span className="block text-[11px] text-gray-500 mt-1">Agradece la compra y ofrece soporte.</span>
                            </button>

                            <button onClick={() => sendWhatsApp('custom')} className="w-full text-left p-3.5 rounded-2xl border-2 border-gray-100 hover:bg-slate-50 transition-all cursor-pointer">
                                <span className="block font-black text-xs sm:text-sm text-gray-900">💬 Mensaje Directo</span>
                                <span className="block text-[11px] text-gray-500 mt-1">Abrir chat personalizado en WhatsApp.</span>
                            </button>
                        </div>

                        <div className="p-4 bg-slate-50 text-center border-t border-gray-100">
                            <button onClick={() => setContactOrder(null)} className="text-xs font-extrabold text-gray-600 hover:text-gray-900 cursor-pointer">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {orderToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setOrderToDelete(null)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden p-6 text-center animate-scaleIn">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-extrabold text-base text-gray-950 mb-1">¿Eliminar permanentemente?</h3>
                        <p className="text-xs text-gray-500 mb-5">
                            Estás a punto de eliminar permanentemente la orden <strong>#{orderToDelete.order_id}</strong>. Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setOrderToDelete(null)} className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-extrabold text-gray-700 hover:bg-slate-50 cursor-pointer">
                                Cancelar
                            </button>
                            <button onClick={confirmDeleteOrder} className="flex-1 py-2.5 rounded-2xl bg-red-600 text-white text-xs font-black hover:bg-red-700 shadow-md shadow-red-600/20 cursor-pointer">
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
