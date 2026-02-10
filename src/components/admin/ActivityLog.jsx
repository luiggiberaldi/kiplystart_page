import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

/**
 * ActivityLog Component
 * @description Shows recent admin actions from the activity_log table.
 */
export default function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    async function fetchLogs() {
        try {
            const { data, error } = await supabase
                .from('activity_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            setLogs(data || []);
        } catch (err) {
            console.error('Error fetching activity logs:', err);
        } finally {
            setLoading(false);
        }
    }

    const actionIcons = {
        'bulk_price_update': { icon: 'price_change', color: 'text-blue-500', bg: 'bg-blue-50' },
        'bulk_stock_update': { icon: 'inventory', color: 'text-yellow-500', bg: 'bg-yellow-50' },
        'product_create': { icon: 'add_circle', color: 'text-green-500', bg: 'bg-green-50' },
        'product_update': { icon: 'edit', color: 'text-purple-500', bg: 'bg-purple-50' },
        'product_delete': { icon: 'delete', color: 'text-red-500', bg: 'bg-red-50' },
        'order_status': { icon: 'local_shipping', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    };

    const actionLabels = {
        'bulk_price_update': 'Actualización masiva de precios',
        'bulk_stock_update': 'Actualización masiva de stock',
        'product_create': 'Producto creado',
        'product_update': 'Producto actualizado',
        'product_delete': 'Producto eliminado',
        'order_status': 'Estado de pedido cambiado',
    };

    function formatTime(ts) {
        const d = new Date(ts);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Justo ahora';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
        return d.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-display text-brand-blue">Registro de Actividad</h2>
                <p className="text-gray-500 text-sm">Historial de cambios en tu tienda</p>
            </div>

            {logs.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                    <span className="material-symbols-outlined text-[48px] text-gray-200 mb-3 block">history</span>
                    <p className="text-gray-400 text-sm">No hay actividad registrada aún</p>
                    <p className="text-gray-300 text-xs mt-1">Las acciones aparecerán aquí automáticamente</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {logs.map(log => {
                            const cfg = actionIcons[log.action] || { icon: 'info', color: 'text-gray-500', bg: 'bg-gray-50' };
                            return (
                                <div key={log.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className={`${cfg.bg} p-2 rounded-lg shrink-0 mt-0.5`}>
                                        <span className={`material-symbols-outlined ${cfg.color} text-[20px]`}>{cfg.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {actionLabels[log.action] || log.action}
                                        </p>
                                        {log.details && (
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {log.details.updated && `${log.details.updated} actualizados`}
                                                {log.details.errors > 0 && ` · ${log.details.errors} errores`}
                                                {log.details.source && ` · Fuente: ${log.details.source}`}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">{formatTime(log.created_at)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
