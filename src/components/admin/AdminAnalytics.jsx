import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * AdminAnalytics Component
 * @description Sales analytics dashboard for dropshipping business.
 */
export default function AdminAnalytics() {
    const { formatPrice } = useCurrency();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        try {
            // Fetch orders
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch products
            const { data: products } = await supabase
                .from('products')
                .select('*');

            const allOrders = orders || [];
            const allProducts = products || [];

            // Calculate stats
            const totalRevenue = allOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

            const totalOrders = allOrders.length;
            const pendingOrders = allOrders.filter(o => o.status === 'pending_whatsapp').length;
            const confirmedOrders = allOrders.filter(o => o.status === 'confirmed').length;
            const shippedOrders = allOrders.filter(o => o.status === 'shipped').length;
            const deliveredOrders = allOrders.filter(o => o.status === 'delivered').length;
            const cancelledOrders = allOrders.filter(o => o.status === 'cancelled').length;

            // Top products by orders
            const productCounts = {};
            allOrders.forEach(o => {
                const name = o.product_name || 'Desconocido';
                productCounts[name] = (productCounts[name] || 0) + parseInt(o.quantity || 1);
            });
            const topProducts = Object.entries(productCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);

            // Low stock products
            const lowStock = allProducts.filter(p => p.stock <= (p.low_stock_threshold || 5) && p.is_active);

            // Products with no orders
            const orderedProductNames = new Set(allOrders.map(o => o.product_name));
            const noOrders = allProducts.filter(p => p.is_active && !orderedProductNames.has(p.name));

            setStats({
                totalRevenue,
                totalOrders,
                pendingOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                topProducts,
                lowStock,
                noOrders,
                totalProducts: allProducts.length,
                activeProducts: allProducts.filter(p => p.is_active).length,
            });
        } catch (err) {
            console.error('Analytics error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-display text-brand-blue">Analytics</h2>
                <p className="text-gray-500 text-sm">Métricas de tu negocio dropshipping</p>
            </div>

            {/* Revenue + Orders Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Ingreso Total" value={formatPrice(stats.totalRevenue)} icon="payments" color="green" />
                <StatCard label="Total Pedidos" value={stats.totalOrders} icon="receipt_long" color="blue" />
                <StatCard label="Productos Activos" value={`${stats.activeProducts}/${stats.totalProducts}`} icon="inventory_2" color="purple" />
                <StatCard label="Pendientes" value={stats.pendingOrders} icon="schedule" color="yellow" />
            </div>

            {/* Order Pipeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-blue text-[20px]">local_shipping</span>
                    Pipeline de Pedidos
                </h3>
                <div className="grid grid-cols-5 gap-2">
                    {[
                        { label: 'Pendiente', value: stats.pendingOrders, color: 'bg-yellow-400' },
                        { label: 'Confirmado', value: stats.confirmedOrders, color: 'bg-blue-400' },
                        { label: 'Enviado', value: stats.shippedOrders, color: 'bg-purple-400' },
                        { label: 'Entregado', value: stats.deliveredOrders, color: 'bg-green-400' },
                        { label: 'Cancelado', value: stats.cancelledOrders, color: 'bg-red-400' },
                    ].map(stage => (
                        <div key={stage.label} className="text-center">
                            <div className={`${stage.color} text-white rounded-xl py-4 mb-2`}>
                                <p className="text-2xl font-bold">{stage.value}</p>
                            </div>
                            <p className="text-xs font-medium text-gray-500">{stage.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-blue text-[20px]">trending_up</span>
                        Top Productos
                    </h3>
                    {stats.topProducts.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">Sin pedidos aún</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.topProducts.map(([name, count], i) => (
                                <div key={name} className="flex items-center gap-3">
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        #{i + 1}
                                    </span>
                                    <span className="text-sm text-gray-700 truncate flex-1">{name}</span>
                                    <span className="text-sm font-bold text-brand-blue shrink-0">{count} uds</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500 text-[20px]">warning</span>
                        Stock Bajo ({stats.lowStock.length})
                    </h3>
                    {stats.lowStock.length === 0 ? (
                        <p className="text-sm text-green-500 text-center py-4 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Todo el stock está bien
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {stats.lowStock.map(p => (
                                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-700 truncate">{p.name}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {p.stock} uds
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50',
        yellow: 'text-yellow-600 bg-yellow-50',
        purple: 'text-purple-600 bg-purple-50',
    };
    const [textColor, bgColor] = colors[color].split(' ');

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <div className={`${bgColor} p-1.5 rounded-lg`}>
                    <span className={`material-symbols-outlined ${textColor} text-[18px]`}>{icon}</span>
                </div>
            </div>
            <p className={`text-2xl font-bold font-display ${textColor}`}>{value}</p>
        </div>
    );
}
