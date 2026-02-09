import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * DashboardStats Component
 * @description
 * Overview metrics for admin dashboard
 */
export default function DashboardStats() {
    const { formatPrice } = useCurrency();
    const [stats, setStats] = useState({
        total_products: 0,
        active_products: 0,
        inventory_value: 0,
        low_stock_count: 0,
        pending_orders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            // Fetch products stats
            const { data: products, error: prodError } = await supabase
                .from('products')
                .select('*');

            if (prodError) throw prodError;

            const total = products.length;
            const active = products.filter(p => p.is_active).length;
            const lowStock = products.filter(p => p.stock <= (p.low_stock_threshold || 5)).length;

            // Calculate total inventory value
            const inventoryValue = products.reduce((acc, curr) => {
                return acc + (curr.price * (curr.stock || 0));
            }, 0);

            // Fetch orders stats
            const { data: orders, error: ordError } = await supabase
                .from('orders')
                .select('*')
                .eq('status', 'pending_whatsapp');

            const pending = orders?.length || 0;

            setStats({
                total_products: total,
                active_products: active,
                inventory_value: inventoryValue,
                low_stock_count: lowStock,
                pending_orders: pending
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            label: 'Total Productos',
            value: stats.total_products,
            icon: 'inventory_2',
            color: 'text-brand-blue',
            bg: 'bg-blue-50'
        },
        {
            label: 'Valor Inventario',
            value: formatPrice(stats.inventory_value), // New metric
            icon: 'payments',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Stock Bajo',
            value: stats.low_stock_count,
            icon: 'warning',
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
        {
            label: 'Pedidos Pendientes',
            value: stats.pending_orders,
            icon: 'shopping_cart',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                        <div className={`${card.bg} p-2 rounded-lg`}>
                            <span className={`material-symbols-outlined ${card.color} text-[24px]`}>{card.icon}</span>
                        </div>
                    </div>
                    <p className={`text-2xl font-bold font-display ${card.color}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
