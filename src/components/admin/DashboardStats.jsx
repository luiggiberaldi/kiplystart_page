import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import useLiveVisitors from '../../hooks/useLiveVisitors';

/**
 * DashboardStats Component (v3.0 — with Analytics)
 * @description
 * Overview metrics for dropshipping + live visitor analytics.
 */
export default function DashboardStats() {
    const { formatPrice } = useCurrency();
    const { liveCount } = useLiveVisitors();
    const [stats, setStats] = useState({
        total_products: 0,
        active_products: 0,
        low_stock_count: 0,
        out_of_stock: 0,
        pending_orders: 0,
        total_orders: 0,
        views_today: 0,
        views_week: 0,
        views_month: 0,
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

            // Page views — today, this week, this month
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            const [
                { count: viewsToday },
                { count: viewsWeek },
                { count: viewsMonth },
            ] = await Promise.all([
                supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
                supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
                supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
            ]);

            setStats({
                total_products: total,
                active_products: active,
                low_stock_count: lowStock,
                out_of_stock: outOfStock,
                pending_orders: pending,
                total_orders: allOrders.length,
                views_today: viewsToday || 0,
                views_week: viewsWeek || 0,
                views_month: viewsMonth || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                        <div className="h-8 bg-gray-100 rounded w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            label: 'En Vivo',
            value: liveCount,
            icon: 'radio_button_checked',
            color: liveCount > 0 ? 'text-green-600' : 'text-gray-400',
            bg: liveCount > 0 ? 'bg-green-50' : 'bg-gray-50',
            pulse: liveCount > 0,
            subtitle: liveCount === 1 ? 'visitante ahora' : 'visitantes ahora'
        },
        {
            label: 'Visitas Hoy',
            value: stats.views_today,
            icon: 'visibility',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            subtitle: `${stats.views_week} esta semana`
        },
        {
            label: 'Productos',
            value: `${stats.active_products}/${stats.total_products}`,
            icon: 'inventory_2',
            color: 'text-brand-blue',
            bg: 'bg-blue-50'
        },
        {
            label: 'Pedidos Pend.',
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                        <div className={`${card.bg} p-1.5 md:p-2 rounded-lg relative`}>
                            <span className={`material-symbols-outlined ${card.color} text-[18px] md:text-[22px]`}>{card.icon}</span>
                            {card.pulse && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white" />
                                </span>
                            )}
                        </div>
                    </div>
                    <p className={`text-xl md:text-2xl font-bold font-display ${card.color}`}>{card.value}</p>
                    {card.subtitle && (
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">{card.subtitle}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
