import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import useIsMobile from '../../hooks/useIsMobile';
import ConfirmModal from './ConfirmModal';
import { 
    Users, ShoppingBag, DollarSign, TrendingUp, 
    Search, MessageCircle, Trash2, MapPin, 
    Phone, Award, Clock, ArrowUpRight, UserCheck, ShieldCheck
} from 'lucide-react';

/**
 * CustomersManager Component
 * Modern, full-width dashboard aggregating customer data, KPIs, and order histories.
 */
export default function CustomersManager() {
    const { formatPrice } = useCurrency();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'repeat', 'single'
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            setLoading(true);
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Aggregate by Phone Number (primary customer identifier)
            const customerMap = new Map();

            (orders || []).forEach(order => {
                if (!order.user_phone) return;

                const phone = order.user_phone.trim();

                if (!customerMap.has(phone)) {
                    customerMap.set(phone, {
                        id: phone,
                        name: order.user_name || 'Cliente',
                        phone: order.user_phone,
                        ci: order.user_ci || 'N/A',
                        locations: new Set(),
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrderDate: order.created_at,
                        lastProduct: order.product_name,
                        status: 'active'
                    });
                }

                const customer = customerMap.get(phone);
                customer.totalOrders += 1;
                customer.totalSpent += (Number(order.total_price) || 0);
                if (order.city || order.state) {
                    customer.locations.add(`${order.city || ''}, ${order.state || ''}`.replace(/^,\s*|,\s*$/g, ''));
                }

                if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
                    customer.lastOrderDate = order.created_at;
                    customer.name = order.user_name || customer.name;
                    customer.ci = order.user_ci || customer.ci;
                    customer.lastProduct = order.product_name || customer.lastProduct;
                }
            });

            const customersList = Array.from(customerMap.values()).map(c => ({
                ...c,
                location: Array.from(c.locations).filter(Boolean).join(' • ') || 'Venezuela',
            }));

            setCustomers(customersList);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }

    // ── Delete customer (deletes all their orders) ──
    async function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('user_phone', deleteTarget.phone);

            if (error) throw error;
            fetchCustomers();
        } catch (err) {
            console.error('Error deleting customer:', err);
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }

    // Metrics calculations
    const stats = useMemo(() => {
        const totalCustomers = customers.length;
        const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
        const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
        const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;
        const avgLTV = totalCustomers > 0 ? (totalRevenue / totalCustomers) : 0;

        return {
            totalCustomers,
            totalRevenue,
            repeatCustomers,
            repeatRate,
            avgLTV
        };
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            // Filter by type
            if (filterType === 'repeat' && c.totalOrders <= 1) return false;
            if (filterType === 'single' && c.totalOrders > 1) return false;

            // Search query
            if (!searchTerm) return true;
            const lower = searchTerm.toLowerCase();
            return (
                c.name.toLowerCase().includes(lower) ||
                c.phone.includes(lower) ||
                (c.ci && c.ci.toLowerCase().includes(lower)) ||
                (c.location && c.location.toLowerCase().includes(lower))
            );
        });
    }, [customers, searchTerm, filterType]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <div className="w-10 h-10 border-3 border-[#0A2463]/20 border-t-[#0A2463] rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold text-gray-500">Cargando base de datos de clientes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black font-display text-gray-950 flex items-center gap-2.5">
                        <Users className="w-7 h-7 text-[#0A2463]" />
                        <span>Base de Datos de Clientes</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        Historial acumulado de compradores, compras recurrentes y métricas de LTV.
                    </p>
                </div>
            </div>

            {/* Top KPI Metrics Row (Full Width 4-Card Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Customers */}
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Total Compradores</p>
                        <p className="text-2xl font-black text-gray-950 mt-1">{stats.totalCustomers}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mt-2">
                            <UserCheck className="w-3 h-3" /> Clientes registrados
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0A2463] shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                {/* Total Revenue LTV */}
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Ingresos Acumulados</p>
                        <p className="text-2xl font-black text-emerald-700 mt-1">{formatPrice(stats.totalRevenue)}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                            <DollarSign className="w-3 h-3" /> Facturación COD
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                {/* Repeat Customers */}
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Clientes Recurrentes</p>
                        <p className="text-2xl font-black text-gray-950 mt-1">
                            {stats.repeatCustomers} <span className="text-xs text-gray-400 font-bold">({stats.repeatRate}%)</span>
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mt-2">
                            <Award className="w-3 h-3" /> +1 Pedido realizado
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </div>

                {/* Avg LTV */}
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">LTV Promedio / Cliente</p>
                        <p className="text-2xl font-black text-gray-950 mt-1">{formatPrice(stats.avgLTV)}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-2">
                            <ArrowUpRight className="w-3 h-3" /> Ticket acumulado
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filter Pills & Full-Width Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3.5 rounded-3xl border border-gray-200 shadow-xs">
                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: `Todos (${stats.totalCustomers})` },
                        { id: 'repeat', label: `Recurrentes (${stats.repeatCustomers})` },
                        { id: 'single', label: `Nuevos (${stats.totalCustomers - stats.repeatCustomers})` }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilterType(f.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                                filterType === f.id
                                    ? 'bg-[#0A2463] text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Search Box */}
                <div className="relative flex-1 md:max-w-md">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono, CI o ciudad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0A2463] outline-none transition-all"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Card List */}
            {isMobile ? (
                <div className="space-y-3">
                    {filteredCustomers.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center text-gray-500">
                            No se encontraron clientes con ese criterio.
                        </div>
                    ) : (
                        filteredCustomers.map(customer => (
                            <div key={customer.id} className="bg-white rounded-3xl border border-gray-200 shadow-xs p-5 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0A2463] text-white flex items-center justify-center font-black text-base shadow-xs">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-gray-950 text-sm">{customer.name}</p>
                                            <p className="text-xs text-gray-500 font-mono font-bold">CI: {customer.ci}</p>
                                        </div>
                                    </div>
                                    <span className="text-base font-black text-emerald-700">
                                        {formatPrice(customer.totalSpent)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</p>
                                        <p className="font-mono font-bold text-gray-800">{customer.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pedidos</p>
                                        <p className="font-bold text-[#0A2463]">{customer.totalOrders} pedidos</p>
                                    </div>
                                    <div className="col-span-2 mt-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Ubicación</p>
                                        <p className="text-gray-700 truncate">{customer.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                                    <a
                                        href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Escribir por WhatsApp</span>
                                    </a>
                                    <button
                                        onClick={() => setDeleteTarget(customer)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                                        title="Eliminar cliente"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Desktop Table View (Full Screen Width) */
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-200/80 text-[11px] uppercase text-gray-500 font-black tracking-wider">
                                    <th className="py-4 px-5">Cliente</th>
                                    <th className="py-4 px-5">Contacto</th>
                                    <th className="py-4 px-5">Ubicación</th>
                                    <th className="py-4 px-5 text-center">Pedidos</th>
                                    <th className="py-4 px-5 text-right">Total Gastado (LTV)</th>
                                    <th className="py-4 px-5 text-right">Última Compra</th>
                                    <th className="py-4 px-5 text-center w-28">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs font-medium">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-gray-400 font-bold">
                                            No se encontraron clientes registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                                            {/* Cliente */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0A2463] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-extrabold text-gray-950 text-sm truncate">{customer.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-mono font-bold">CI: {customer.ci}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contacto & WhatsApp */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl font-mono font-bold text-xs transition-colors cursor-pointer"
                                                        title="Abrir chat en WhatsApp"
                                                    >
                                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>{customer.phone}</span>
                                                    </a>
                                                </div>
                                            </td>

                                            {/* Ubicación */}
                                            <td className="py-4 px-5 text-gray-700">
                                                <div className="flex items-center gap-1.5 max-w-[240px] truncate" title={customer.location}>
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <span className="truncate">{customer.location}</span>
                                                </div>
                                            </td>

                                            {/* Pedidos */}
                                            <td className="py-4 px-5 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                                                        customer.totalOrders > 1 
                                                            ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-500/20' 
                                                            : 'bg-blue-50 text-blue-800'
                                                    }`}>
                                                        {customer.totalOrders} {customer.totalOrders === 1 ? 'pedido' : 'pedidos'}
                                                    </span>
                                                    {customer.totalOrders > 1 && (
                                                        <span className="text-[9px] font-extrabold text-purple-600 uppercase tracking-tight mt-0.5">
                                                            Frecuente
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Total Gastado (LTV) */}
                                            <td className="py-4 px-5 text-right font-black text-sm text-emerald-700 tabular-nums">
                                                {formatPrice(customer.totalSpent)}
                                            </td>

                                            {/* Última Compra */}
                                            <td className="py-4 px-5 text-right text-gray-500 font-mono text-xs">
                                                <div className="flex items-center justify-end gap-1 text-gray-600">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{new Date(customer.lastOrderDate).toLocaleDateString('es-VE')}</span>
                                                </div>
                                            </td>

                                            {/* Acciones */}
                                            <td className="py-4 px-5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <a
                                                        href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                                                        title="Contactar por WhatsApp"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => setDeleteTarget(customer)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                                        title="Eliminar cliente y sus pedidos"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="¿Eliminar cliente?"
                message={`Se eliminarán "${deleteTarget?.name || ''}" y todos sus ${deleteTarget?.totalOrders || 0} pedidos permanentemente de la base de datos.`}
                confirmText={deleting ? 'Eliminando...' : 'Sí, eliminar cliente'}
                cancelText="Cancelar"
                confirmColor="bg-red-600 hover:bg-red-700"
                icon="delete_forever"
                iconBg="bg-red-100 text-red-600"
            />
        </div>
    );
}
