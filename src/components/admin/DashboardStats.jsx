import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * DashboardStats Component (v2.0 — Dropshipping)
 * @description
 * Overview metrics optimized for dropshipping business model.
 * No inventory value (we don't own stock). Focus on products, orders, sync status.
 */
export default function DashboardStats() {
    const { formatPrice } = useCurrency();
    const [stats, setStats] = useState({
        total_products: 0,
        active_products: 0,
        low_stock_count: 0,
        out_of_stock: 0,
        pending_orders: 0,
        total_orders: 0,
        last_activity: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            // Products
            const { data: products } = await supabase.from('products').select('*');
            const prods = products || [];
            const total = prods.length;
            const active = prods.filter(p => p.is_active).length;
            const lowStock = prods.filter(p => p.is_active && p.stock > 0 && p.stock <= (p.low_stock_threshold || 5)).length;
            const outOfStock = prods.filter(p => p.is_active && p.stock === 0).length;

            // Orders
            const { data: orders } = await supabase.from('orders').select('id, status');
            const allOrders = orders || [];
            const pending = allOrders.filter(o => o.status === 'pending_whatsapp').length;

            // Last activity
            const { data: logs } = await supabase
                .from('activity_log')
                .select('created_at, action')
                .order('created_at', { ascending: false })
                .limit(1);

            setStats({
                total_products: total,
                active_products: active,
                low_stock_count: lowStock,
                out_of_stock: outOfStock,
                pending_orders: pending,
                total_orders: allOrders.length,
                last_activity: logs?.[0] || null,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                        <div className="h-8 bg-gray-100 rounded w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            label: 'Productos Activos',
            value: `${stats.active_products} / ${stats.total_products}`,
            icon: 'inventory_2',
            color: 'text-brand-blue',
            bg: 'bg-blue-50'
        },
        {
            label: 'Pedidos Pendientes',
            value: stats.pending_orders,
            icon: 'shopping_cart',
            color: stats.pending_orders > 0 ? 'text-yellow-600' : 'text-green-600',
            bg: stats.pending_orders > 0 ? 'bg-yellow-50' : 'bg-green-50',
            subtitle: `${stats.total_orders} total`
        },
        {
            label: 'Sin Stock',
            value: stats.out_of_stock,
            icon: 'error',
            color: stats.out_of_stock > 0 ? 'text-red-600' : 'text-green-600',
            bg: stats.out_of_stock > 0 ? 'bg-red-50' : 'bg-green-50'
        },
        {
            label: 'Stock Bajo',
            value: stats.low_stock_count,
            icon: 'warning',
            color: stats.low_stock_count > 0 ? 'text-orange-600' : 'text-green-600',
            bg: stats.low_stock_count > 0 ? 'bg-orange-50' : 'bg-green-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                        <div className={`${card.bg} p-2 rounded-lg`}>
                            <span className={`material-symbols-outlined ${card.color} text-[22px]`}>{card.icon}</span>
                        </div>
                    </div>
                    <p className={`text-2xl font-bold font-display ${card.color}`}>{card.value}</p>
                    {card.subtitle && (
                        <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
