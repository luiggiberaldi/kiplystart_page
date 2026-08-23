import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import useLiveVisitors from '../../hooks/useLiveVisitors';
import VisitorMap from './VisitorMap';
import { 
    Users, Eye, Package, ShoppingBag, 
    AlertTriangle, XCircle, ShoppingCart, 
    TrendingUp, Sparkles, Globe, X, Plus, RefreshCw, Layers
} from 'lucide-react';

export default function DashboardStats({ onNavigate }) {
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
    const [showVisitorsModal, setShowVisitorsModal] = useState(false);

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

    const formatPath = (path) => {
        if (path === '/') return 'Página de Inicio';
        if (path === '/catalogo') return 'Catálogo';
        if (path.startsWith('/producto/')) {
            const slug = path.replace('/producto/', '');
            return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return path;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                        <div className="h-8 bg-gray-200 rounded w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    const uniqueCountries = [...new Set(visitors.map(v => v.country).filter(Boolean))];

    return (
        <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Live Visitors Card */}
                <div 
                    onClick={() => setShowVisitorsModal(true)}
                    className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Visitantes en Vivo</span>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative">
                            <Users className="w-5 h-5" />
                            {liveCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-950 tabular-nums">{liveCount}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">En tiempo real</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Toca para ver países y páginas activas</p>
                </div>

                {/* 2. Page Views Card */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Visitas Hoy</span>
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0A2463] flex items-center justify-center">
                            <Eye className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-950 tabular-nums">{stats.views_today}</span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">+{stats.views_week} esta semana</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{stats.views_month} visitas acumuladas este mes</p>
                </div>

                {/* 3. Catalog Products Card */}
                <div 
                    onClick={() => onNavigate && onNavigate('productos')}
                    className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Catálogo Activo</span>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-950 tabular-nums">{stats.active_products}</span>
                        <span className="text-xs font-bold text-gray-500">/ {stats.total_products} productos</span>
                    </div>
                    <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.total_products > 0 ? (stats.active_products / stats.total_products) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                {/* 4. Orders Pending Card */}
                <div 
                    onClick={() => onNavigate && onNavigate('pedidos')}
                    className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-500">Pedidos COD Pendientes</span>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stats.pending_orders > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-black tabular-nums ${stats.pending_orders > 0 ? 'text-amber-600' : 'text-gray-950'}`}>
                            {stats.pending_orders}
                        </span>
                        <span className="text-xs font-bold text-gray-500">de {stats.total_orders} pedidos totales</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Por confirmar vía WhatsApp / DroPanas</p>
                </div>
            </div>

            {/* Quick Secondary Stats & Inventory Health */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500">Añadidos al Carrito Hoy</p>
                            <p className="text-xl font-black text-gray-950 tabular-nums">{stats.cart_adds_today}</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">Intención</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500">Pocas Unidades (Stock Bajo)</p>
                            <p className="text-xl font-black text-amber-600 tabular-nums">{stats.low_stock_count}</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">Atención</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                            <XCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500">Agotados (Sin Stock)</p>
                            <p className="text-xl font-black text-red-600 tabular-nums">{stats.out_of_stock}</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">0 unidades</span>
                </div>
            </div>

            {/* Visitor Map Frame */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0A2463] flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-gray-950">Mapa de Tráfico Global en Vivo</h3>
                            <p className="text-xs text-gray-500">Ubicación geográfica de los compradores navegando KiplyStart</p>
                        </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{visitors.length} Sesiones Activas</span>
                    </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <VisitorMap visitors={visitors} />
                </div>
            </div>

            {/* Visitor Modal */}
            {showVisitorsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowVisitorsModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-scaleIn" onClick={e => e.stopPropagation()}>
                        <div className="bg-[#0A2463] px-6 py-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                <Users className="w-5 h-5 text-emerald-400" />
                                <h3 className="font-extrabold text-base">Visitantes en Vivo ({visitors.length})</h3>
                            </div>
                            <button onClick={() => setShowVisitorsModal(false)} className="text-white/70 hover:text-white p-1 rounded-lg cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                            <div>
                                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Países de Origen</h4>
                                <div className="space-y-2">
                                    {uniqueCountries.map(code => {
                                        const count = visitors.filter(v => v.country === code).length;
                                        const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
                                        return (
                                            <div key={code} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-gray-200">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-xl">{flag}</span>
                                                    <span className="font-bold text-gray-800">{code}</span>
                                                </div>
                                                <span className="font-black text-gray-950 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-xs">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Páginas que están viendo</h4>
                                <div className="space-y-2">
                                    {[...new Set(visitors.map(v => v.path))].map(path => {
                                        const count = visitors.filter(v => v.path === path).length;
                                        return (
                                            <div key={path} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-gray-200">
                                                <span className="text-xs font-bold text-gray-800 truncate">{formatPath(path)}</span>
                                                <span className="bg-[#0A2463] text-white text-xs font-black px-2.5 py-1 rounded-xl">
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
            )}
        </div>
    );
}
