import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * CustomersManager Component
 *Aggregates order data to display a list of unique customers.
 */
export default function CustomersManager() {
    const { formatPrice } = useCurrency();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                // Skip if no phone (shouldn't happen for valid orders) or if deleted (optional, but let's include all history for now)
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
                        status: 'active' // could be based on recency
                    });
                }

                const customer = customerMap.get(phone);
                customer.totalOrders += 1;
                customer.totalSpent += (order.total_price || 0);
                customer.locations.add(`${order.city}, ${order.state}`);

                // Keep most recent name/CI if changed
                if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
                    customer.lastOrderDate = order.created_at;
                    customer.name = order.user_name;
                    customer.ci = order.user_ci || customer.ci;
                }
            });

            // Convert map to array
            const customersList = Array.from(customerMap.values()).map(c => ({
                ...c,
                location: Array.from(c.locations).join(' | '), // Join unique locations
            }));

            setCustomers(customersList);

        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-display text-brand-blue mb-1">Clientes</h2>
                    <p className="text-gray-500 text-sm">Base de datos de compradores ({customers.length})</p>
                </div>

                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o CI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-blue-50 outline-none w-64 md:w-80"
                    />
                </div>
            </div>

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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
