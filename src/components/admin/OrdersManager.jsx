import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * OrdersManager Component
 * @description
 * Manage COD orders from customers
 */
export default function OrdersManager() {
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

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
            fetchOrders(); // Refresh
        } catch (error) {
            alert('Error actualizando pedido: ' + error.message);
        }
    }

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    const statusOptions = [
        { value: 'all', label: 'Todos', count: orders.length },
        { value: 'pending_whatsapp', label: 'Pendiente', count: orders.filter(o => o.status === 'pending_whatsapp').length },
        { value: 'confirmed', label: 'Confirmado', count: orders.filter(o => o.status === 'confirmed').length },
        { value: 'shipped', label: 'Enviado', count: orders.filter(o => o.status === 'shipped').length },
        { value: 'delivered', label: 'Entregado', count: orders.filter(o => o.status === 'delivered').length }
    ];

    const statusColors = {
        'pending_whatsapp': 'bg-yellow-100 text-yellow-700',
        'confirmed': 'bg-blue-100 text-blue-700',
        'shipped': 'bg-purple-100 text-purple-700',
        'delivered': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700'
    };

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {statusOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setFilterStatus(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === opt.value
                            ? 'bg-brand-blue text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {opt.label} ({opt.count})
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                    No hay pedidos {filterStatus !== 'all' && `con estado "${statusOptions.find(o => o.value === filterStatus)?.label}"`}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-brand-blue">Pedido #{order.id}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[order.status]}`}>
                                            {statusOptions.find(s => s.value === order.status)?.label || order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString('es-VE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
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
                                    {order.user_ci && <p className="text-xs text-gray-500">CI: {order.user_ci}</p>}
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
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-500 mr-2">Cambiar estado:</p>
                                {['confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => updateOrderStatus(order.id, status)}
                                        disabled={order.status === status}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${order.status === status
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {statusOptions.find(s => s.value === status)?.label || status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
