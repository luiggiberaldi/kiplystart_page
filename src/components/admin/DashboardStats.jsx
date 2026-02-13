import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import useLiveVisitors from '../../hooks/useLiveVisitors';
import VisitorMap from './VisitorMap';

/**
 * DashboardStats Component (v3.0 — with Analytics)
 * @description
 * Overview metrics for dropshipping + live visitor analytics.
 */
export default function DashboardStats() {
    const { formatPrice } = useCurrency();
    const { liveCount, visitors } = useLiveVisitors();
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
        cart_adds_today: 0,
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
                { count: cartAddsToday }
            ] = await Promise.all([
                supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
                supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
                supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
                supabase.from('cart_events').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
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
                cart_adds_today: cartAddsToday || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }

    const [showVisitorsModal, setShowVisitorsModal] = useState(false);

    // Format path for display (e.g. /producto/reloj-x -> Reloj X)
    const formatPath = (path) => {
        if (path === '/') return 'Inicio';
        if (path === '/catalogo') return 'Catálogo';
        if (path.startsWith('/producto/')) {
            const slug = path.replace('/producto/', '');
            return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return path;
    };

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

    const uniqueCountries = [...new Set(visitors.map(v => v.country).filter(Boolean))];
    const liveSubtitle = uniqueCountries.length > 0
        ? uniqueCountries.map(code => {
            const count = visitors.filter(v => v.country === code).length;
            const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
            return `${flag} ${count}`;
        }).join('  ')
        : (liveCount === 1 ? 'visitante ahora' : 'visitantes ahora');

    const cards = [
        {
            label: 'En Vivo',
            value: liveCount,
            icon: 'radio_button_checked',
            color: liveCount > 0 ? 'text-green-600' : 'text-gray-400',
            bg: liveCount > 0 ? 'bg-green-50' : 'bg-gray-50',
            pulse: liveCount > 0,
            subtitle: liveSubtitle,
            onClick: () => setShowVisitorsModal(true),
            cursor: 'cursor-pointer'
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
        },
        {
            label: 'Agreg. Carrito',
            value: stats.cart_adds_today,
            icon: 'add_shopping_cart',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            subtitle: 'Hoy'
        }
    ];

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        onClick={card.onClick}
                        className={`bg-white/80 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] ${card.cursor || ''}`}
                    >
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

            {/* Visitor Map */}
            <div className="mt-8 mb-6">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="material-symbols-outlined text-gray-700">public</span>
                    <h3 className="text-lg font-bold text-gray-800">Mapa de Visitantes en Vivo</h3>
                </div>
                <VisitorMap visitors={visitors} />
            </div>

            {/* Visitor Breakdown Modal */}
            {
                showVisitorsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowVisitorsModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Visitantes en Vivo</h3>
                                <button onClick={() => setShowVisitorsModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                                {/* By Country */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Por País</h4>
                                    <div className="space-y-2">
                                        {uniqueCountries.map(code => {
                                            const count = visitors.filter(v => v.country === code).length;
                                            const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
                                            return (
                                                <div key={code} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">{flag}</span>
                                                        <span className="font-medium text-gray-700">{code}</span>
                                                    </div>
                                                    <span className="font-bold text-gray-900">{count}</span>
                                                </div>
                                            );
                                        })}

                                        {visitors.filter(v => !v.country).length > 0 && (
                                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-gray-400 text-sm">help</span>
                                                    <span className="font-medium text-gray-500 text-sm">Desconocido / Sin Datos</span>
                                                </div>
                                                <span className="font-bold text-gray-500">{visitors.filter(v => !v.country).length}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* By Page */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Viendo Ahora</h4>
                                    <div className="space-y-2">
                                        {[...new Set(visitors.map(v => v.path))].map(path => {
                                            const count = visitors.filter(v => v.path === path).length;
                                            return (
                                                <div key={path} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        {path.startsWith('/producto/')
                                                            ? <span className="material-symbols-outlined text-brand-blue text-sm shrink-0">shopping_bag</span>
                                                            : <span className="material-symbols-outlined text-gray-400 text-sm shrink-0">public</span>
                                                        }
                                                        <span className="text-sm text-gray-700 truncate">{formatPath(path)}</span>
                                                    </div>
                                                    <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2 py-0.5 rounded-full">
                                                        {count}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
