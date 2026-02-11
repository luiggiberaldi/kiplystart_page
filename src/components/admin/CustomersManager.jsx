import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import useIsMobile from '../../hooks/useIsMobile';
import ConfirmModal from './ConfirmModal';

/**
 * CustomersManager Component
 * Aggregates order data to display a list of unique customers.
 */
export default function CustomersManager() {
    const { formatPrice } = useCurrency();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

            // Aggregate by Phone Number (primary identifier)
            const customerMap = new Map();

            orders.forEach(order => {
                if (!order.user_phone) return;

                const phone = order.user_phone.trim();

                if (!customerMap.has(phone)) {
                    customerMap.set(phone, {
                        id: phone,
                        name: order.user_name,
                        phone: order.user_phone,
                        ci: order.user_ci || 'N/A',
                        locations: new Set([`${order.city}, ${order.state}`]),
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrderDate: order.created_at,
                        status: 'active'
                    });
                }

                const customer = customerMap.get(phone);
                customer.totalOrders += 1;
                customer.totalSpent += (order.total_price || 0);
                customer.locations.add(`${order.city}, ${order.state}`);

                if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
                    customer.lastOrderDate = order.created_at;
                    customer.name = order.user_name;
                    customer.ci = order.user_ci || customer.ci;
                }
            });

            const customersList = Array.from(customerMap.values()).map(c => ({
                ...c,
                location: Array.from(c.locations).join(' | '),
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

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        const lowerTerm = searchTerm.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(lowerTerm) ||
            c.phone.includes(lowerTerm) ||
            c.ci.toLowerCase().includes(lowerTerm)
        );
    }, [customers, searchTerm]);

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold font-display text-brand-blue mb-1">Clientes</h2>
                    <p className="text-gray-500 text-sm">Base de datos de compradores ({customers.length})</p>
                </div>

                <div className="relative w-full md:w-auto">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o CI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-blue-50 outline-none"
                    />
                </div>
            </div>

            {/* MOBILE: Card View */}
            {isMobile ? (
                <div className="space-y-3">
                    {filteredCustomers.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                            No se encontraron clientes.
                        </div>
                    ) : (
                        filteredCustomers.map(customer => (
                            <div key={customer.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                {/* Customer info */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm shrink-0">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-800 text-sm truncate">{customer.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>CI: {customer.ci}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                    </a>
                                    <button
                                        onClick={() => setDeleteTarget(customer)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg shrink-0 hover:bg-red-100 transition-colors"
                                        title="Eliminar cliente"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-2.5">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Pedidos</p>
                                        <p className="text-sm font-bold text-brand-blue">{customer.totalOrders}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total</p>
                                        <p className="text-sm font-bold text-green-600">{formatPrice(customer.totalSpent)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Última</p>
                                        <p className="text-xs text-gray-600">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <p className="text-[11px] text-gray-400 mt-2 truncate" title={customer.location}>
                                    📍 {customer.location}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* DESKTOP: Table View */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Contacto</th>
                                    <th className="p-4">Ubicación</th>
                                    <th className="p-4 text-center">Pedidos</th>
                                    <th className="p-4 text-right">Total Gastado</th>
                                    <th className="p-4 text-right">Última Compra</th>
                                    <th className="p-4 text-center w-16">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            No se encontraron clientes.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{customer.name}</p>
                                                        <p className="text-xs text-gray-400">CI: {customer.ci}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px] text-gray-400">call</span>
                                                    {customer.phone}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={customer.location}>
                                                {customer.location}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="px-2 py-1 rounded-md bg-blue-50 text-brand-blue font-bold text-xs">
                                                    {customer.totalOrders}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-green-600">
                                                {formatPrice(customer.totalSpent)}
                                            </td>
                                            <td className="p-4 text-right text-sm text-gray-500">
                                                {new Date(customer.lastOrderDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => setDeleteTarget(customer)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Eliminar cliente"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
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
                title="Eliminar cliente"
                message={`Se eliminará "${deleteTarget?.name || ''}" y todos sus ${deleteTarget?.totalOrders || 0} pedidos permanentemente. Esta acción no se puede deshacer.`}
                confirmText={deleting ? 'Eliminando...' : 'Eliminar cliente'}
                icon="person_remove"
            />
        </div>
    );
}
