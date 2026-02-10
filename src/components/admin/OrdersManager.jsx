import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import { ZONES } from '../cod/codData';

/**
 * OrdersManager Component
 * @description
 * Manage COD orders with professional WhatsApp templates, Soft Delete (Trash Bin), and Restore functionality.
 */
export default function OrdersManager() {
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal State
    const [contactOrder, setContactOrder] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null); // For permanent delete

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

    // Soft Delete: Move to Trash
    async function moveToTrash(orderId) {
        await updateOrderStatus(orderId, 'deleted');
    }

    // Restore: Move back to pending (or previous state if tracked, defaulting to pending_whatsapp)
    async function restoreOrder(orderId) {
        await updateOrderStatus(orderId, 'pending_whatsapp');
    }

    // Hard Delete: Permanent removal
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

    // Empty Trash
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

        // Professional Templates
        const TEMPLATES = {
            confirm:
                `Hola *${user_name}*, te saludamos de *KiplyStart* 🚀\n\n` +
                `Recibimos tu pedido *#${displayId}* de: *${product_name}*.\n` +
                `💰 Total: *${formatPrice(total_price)}*\n\n` +
                `Para proceder con el despacho, ¿nos podrías reconfirmar si esta es tu ubicación exacta?\n` +
                `📍 *${delivery_address}, ${city}, ${state}*\n\n` +
                `Quedamos atentos para enviarlo de inmediato. ¡Gracias!`,

            shipped:
                `¡Hola *${user_name}*! Buenas noticias 🚚💨\n\n` +
                `Tu pedido *#${displayId}* ya ha sido enviado/procesado.\n\n` +
                `⏳ El tiempo estimado de entrega para *${city}, ${state}* es de: *${estimation}* (según nuestra logística).\n\n` +
                `Estaremos monitoreando tu paquete. ¡Gracias por elegir KiplyStart!`,

            delivered:
                `¡Hola *${user_name}*! Esperamos que estés disfrutando tu compra 🌟\n\n` +
                `Vemos que tu pedido *#${displayId}* ha sido entregado exitosamente.\n` +
                `Si tienes alguna duda o necesitas soporte, estamos aquí para ayudarte.\n\n` +
                `¡Gracias por confiar en KiplyStart!`,

            custom:
                `Hola *${user_name}*, te escribo de KiplyStart respecto a tu pedido *#${displayId}*...`
        };

        const message = TEMPLATES[templateType];
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        setContactOrder(null); // Close modal
    };

    /* ===== Filters & Render ===== */
    const filteredOrders = useMemo(() => {
        if (filterStatus === 'deleted') {
            return orders.filter(o => o.status === 'deleted');
        }
        if (filterStatus === 'all') {
            return orders.filter(o => o.status !== 'deleted');
        }
        return orders.filter(o => o.status === filterStatus);
    }, [orders, filterStatus]);

    const statusOptions = [
        { value: 'all', label: 'Todos', count: orders.filter(o => o.status !== 'deleted').length },
        { value: 'pending_whatsapp', label: 'Pendiente', count: orders.filter(o => o.status === 'pending_whatsapp').length },
        { value: 'confirmed', label: 'Confirmado', count: orders.filter(o => o.status === 'confirmed').length },
        { value: 'shipped', label: 'Enviado', count: orders.filter(o => o.status === 'shipped').length },
        { value: 'delivered', label: 'Entregado', count: orders.filter(o => o.status === 'delivered').length },
        { value: 'deleted', label: 'Papelera', count: orders.filter(o => o.status === 'deleted').length } // Trash Bin
    ];

    const statusColors = {
        'pending_whatsapp': 'bg-yellow-100 text-yellow-700',
        'confirmed': 'bg-blue-100 text-blue-700',
        'shipped': 'bg-purple-100 text-purple-700',
        'delivered': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700',
        'deleted': 'bg-gray-200 text-gray-500'
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

    return (
        <div className="space-y-4 relative">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map(opt => (
                        <button key={opt.value} onClick={() => setFilterStatus(opt.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === opt.value ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                            {opt.label} ({opt.count})
                        </button>
                    ))}
                </div>
                {filterStatus === 'deleted' && filteredOrders.length > 0 && (
                    <button onClick={emptyTrash} className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                        Vaciar Papelera
                    </button>
                )}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                    No hay pedidos {filterStatus !== 'all' ? `en "${statusOptions.find(o => o.value === filterStatus)?.label}"` : ''}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map(order => (
                        <div key={order.id} className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${order.status === 'deleted' ? 'border-red-100 bg-red-50/10' : 'border-gray-200'}`}>
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-brand-blue">Pedido #{order.order_id || order.id?.slice(0, 8)}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {statusOptions.find(s => s.value === order.status)?.label || order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-brand-blue">{formatPrice(order.total_price)}</p>
                                    <p className="text-xs text-gray-500">{order.bundle_type}x unidades</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-1">Cliente</p>
                                    <p className="text-sm font-medium">{order.user_name}</p>
                                    <p className="text-sm text-gray-600">{order.user_phone}</p>

                                    {order.status !== 'deleted' && (
                                        <button onClick={() => setContactOrder(order)}
                                            className="inline-flex items-center gap-1.5 mt-2 bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#20bd5a] transition-colors shadow-sm">
                                            <span className="material-symbols-outlined text-[14px]">chat</span>
                                            Contactar
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-1">Producto</p>
                                    <p className="text-sm font-medium">{order.product_name}</p>
                                    <p className="text-xs text-gray-600">Cantidad: {order.quantity}</p>
                                    <p className="text-xs text-gray-600">Precio unitario: {formatPrice(order.unit_price)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-1">Envío</p>
                                    <p className="text-sm">{order.city}, {order.state}</p>
                                    <p className="text-xs text-gray-600 line-clamp-2">{order.delivery_address}</p>
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                                {order.status === 'deleted' ? (
                                    <>
                                        <button onClick={() => restoreOrder(order.id)}
                                            className="px-3 py-1 rounded text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">restore_from_trash</span>
                                            Restaurar
                                        </button>
                                        <div className="flex-1 text-right">
                                            <button
                                                onClick={() => setOrderToDelete(order)}
                                                className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1 ml-auto"
                                                title="Eliminar permanentemente"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                                Eliminar Definitivamente
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-bold text-gray-500 mr-2">Cambiar estado:</p>
                                        {['confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                                            <button key={status} onClick={() => updateOrderStatus(order.id, status)}
                                                disabled={order.status === status}
                                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${order.status === status ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                                                {statusOptions.find(s => s.value === status)?.label || status}
                                            </button>
                                        ))}

                                        <div className="flex-1 text-right">
                                            <button
                                                onClick={() => moveToTrash(order.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                                title="Mover a papelera"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* WhatsApp Templates Modal */}
            {contactOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setContactOrder(null)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-scaleIn">
                        <div className="bg-[#075E54] text-white p-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined">chat</span>
                                Contactar Cliente
                            </h3>
                            <p className="text-xs opacity-80">{contactOrder.user_name} • {contactOrder.user_phone}</p>
                        </div>

                        <div className="p-4 space-y-2">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Selecciona un mensaje:</p>

                            <button onClick={() => sendWhatsApp('confirm')} className="w-full text-left p-3 rounded-xl border hover:bg-green-50 hover:border-green-200 transition-all group">
                                <span className="block font-bold text-sm text-gray-800 group-hover:text-green-800">📋 Confirmar Pedido</span>
                                <span className="block text-xs text-gray-500 mt-1">Solicitar confirmación de dirección y datos.</span>
                            </button>

                            <button onClick={() => sendWhatsApp('shipped')} className="w-full text-left p-3 rounded-xl border hover:bg-blue-50 hover:border-blue-200 transition-all group">
                                <span className="block font-bold text-sm text-gray-800 group-hover:text-blue-800">🚚 Notificar Envío</span>
                                <span className="block text-xs text-gray-500 mt-1">Anunciar envío y tiempo estimado de entrega ({getDeliveryEstimation(contactOrder.state)}).</span>
                            </button>

                            <button onClick={() => sendWhatsApp('delivered')} className="w-full text-left p-3 rounded-xl border hover:bg-purple-50 hover:border-purple-200 transition-all group">
                                <span className="block font-bold text-sm text-gray-800 group-hover:text-purple-800">✨ Notificar Entrega</span>
                                <span className="block text-xs text-gray-500 mt-1">Agradecer compra y confirmar recepción.</span>
                            </button>

                            <button onClick={() => sendWhatsApp('custom')} className="w-full text-left p-3 rounded-xl border hover:bg-gray-100 transition-all">
                                <span className="block font-bold text-sm text-gray-800">💬 Mensaje Personalizado</span>
                                <span className="block text-xs text-gray-500 mt-1">Abrir chat con saludo genérico.</span>
                            </button>
                        </div>

                        <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                            <button onClick={() => setContactOrder(null)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Permanent Delete Confirmation Modal */}
            {orderToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOrderToDelete(null)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-scaleIn p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-red-600 text-[24px]">delete_forever</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">¿Eliminar definitivamente?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Estás a punto de eliminar <strong>permanentemente</strong> el pedido <strong>#{orderToDelete.order_id || orderToDelete.id?.slice(0, 8)}</strong>.
                            <br /><br />
                            <span className="text-red-600 font-bold">Esta acción NO se puede deshacer.</span>
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setOrderToDelete(null)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteOrder}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
