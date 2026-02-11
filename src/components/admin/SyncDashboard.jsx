import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * SyncDashboard Component
 * @description Load scraper JSON report, show price/stock discrepancies, apply bulk updates.
 */
export default function SyncDashboard() {
    const { formatPrice } = useCurrency();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedStock, setSelectedStock] = useState([]);

    function handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                setReport(data);
                setSelectedPrices(data.precios_desactualizados?.map((_, i) => i) || []);
                setSelectedStock(data.stock_desactualizados?.map((_, i) => i) || []);
                showMsg('success', `✅ Reporte cargado: ${data.total_dropanas || 0} productos escaneados`);
            } catch (err) {
                showMsg('error', 'Error al parsear el archivo JSON');
            }
        };
        reader.readAsText(file);
    }

    async function applyPriceUpdates() {
        if (!report?.precios_desactualizados) return;
        setApplying(true);

        const items = report.precios_desactualizados.filter((_, i) => selectedPrices.includes(i));
        let updated = 0, errors = 0;

        for (const item of items) {
            const { error } = await supabase
                .from('products')
                .update({ price: item.precio_kiplystart_ideal })
                .ilike('name', `%${item.name_kiplystart}%`);

            if (error) errors++;
            else updated++;
        }

        // Log activity
        await supabase.from('activity_log').insert({
            action: 'bulk_price_update',
            entity_type: 'product',
            details: { updated, errors, total: items.length, source: 'scraper_sync' }
        });

        showMsg('success', `✅ ${updated} precios actualizados${errors > 0 ? `, ${errors} errores` : ''}`);
        setApplying(false);
    }

    async function applyStockUpdates() {
        if (!report?.stock_desactualizados) return;
        setApplying(true);

        const items = report.stock_desactualizados.filter((_, i) => selectedStock.includes(i));
        let updated = 0, errors = 0;

        for (const item of items) {
            const { error } = await supabase
                .from('products')
                .update({ stock: item.stock_dropanas })
                .ilike('name', `%${item.name}%`);

            if (error) errors++;
            else updated++;
        }

        await supabase.from('activity_log').insert({
            action: 'bulk_stock_update',
            entity_type: 'product',
            details: { updated, errors, total: items.length, source: 'scraper_sync' }
        });

        showMsg('success', `✅ ${updated} stocks actualizados${errors > 0 ? `, ${errors} errores` : ''}`);
        setApplying(false);
    }

    function showMsg(type, text) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    }

    function togglePrice(idx) {
        setSelectedPrices(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    }

    function toggleStock(idx) {
        setSelectedStock(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold font-display text-brand-blue">Sincronización DroPanas</h2>
                    <p className="text-gray-500 text-xs md:text-sm">Carga el reporte del scraper para sincronizar precios y stock</p>
                </div>
            </div>

            {/* Flash Message */}
            {message && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* File Upload */}
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-brand-blue/40 transition-colors">
                <span className="material-symbols-outlined text-[48px] text-gray-300 mb-3 block">upload_file</span>
                <p className="text-sm text-gray-500 mb-3">Arrastra el archivo <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">reporte_dropanas_*.json</code> aquí</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-[#0D2E7A] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">folder_open</span>
                    Seleccionar Archivo
                    <input type="file" accept=".json" onChange={handleFileLoad} className="hidden" />
                </label>
            </div>

            {/* Report Loaded */}
            {report && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SyncCard label="Escaneados" value={report.total_dropanas} icon="search" color="blue" />
                        <SyncCard label="Sincronizados" value={report.sincronizados} icon="check_circle" color="green" />
                        <SyncCard label="Precios Mal" value={report.precios_desactualizados?.length || 0} icon="price_change" color="red" />
                        <SyncCard label="Stock Mal" value={report.stock_desactualizados?.length || 0} icon="inventory" color="yellow" />
                    </div>

                    {/* New Products */}
                    {report.nuevos?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-500">new_releases</span>
                                    <h3 className="font-bold text-gray-900">Productos Nuevos en DroPanas ({report.nuevos.length})</h3>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                                {report.nuevos.map((p, i) => (
                                    <div key={i} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-gray-50">
                                        <span className="text-gray-700">{p.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-brand-blue font-bold">${p.precio_venta_ideal}</span>
                                            <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Discrepancies */}
                    {report.precios_desactualizados?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500">price_change</span>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Precios Desactualizados ({report.precios_desactualizados.length})</h3>
                                </div>
                                <button
                                    onClick={applyPriceUpdates}
                                    disabled={applying || selectedPrices.length === 0}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E63946] text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[16px]">sync</span>
                                    Actualizar {selectedPrices.length} Precios
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-3 text-left w-8">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPrices.length === report.precios_desactualizados.length}
                                                    onChange={() => {
                                                        if (selectedPrices.length === report.precios_desactualizados.length) {
                                                            setSelectedPrices([]);
                                                        } else {
                                                            setSelectedPrices(report.precios_desactualizados.map((_, i) => i));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left">Producto</th>
                                            <th className="px-4 py-3 text-right">Actual</th>
                                            <th className="px-4 py-3 text-right">Ideal</th>
                                            <th className="px-4 py-3 text-right">Diff</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {report.precios_desactualizados.map((p, i) => (
                                            <tr key={i} className={`hover:bg-gray-50 ${selectedPrices.includes(i) ? 'bg-blue-50/50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" checked={selectedPrices.includes(i)} onChange={() => togglePrice(i)} className="rounded" />
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{p.name_kiplystart}</td>
                                                <td className="px-4 py-3 text-right text-red-500 font-mono">${p.precio_kiplystart_actual}</td>
                                                <td className="px-4 py-3 text-right text-green-600 font-bold font-mono">${p.precio_kiplystart_ideal}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.diferencia > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                        {p.diferencia > 0 ? '+' : ''}{p.diferencia}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Stock Discrepancies */}
                    {report.stock_desactualizados?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500">inventory</span>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Stock Desactualizado ({report.stock_desactualizados.length})</h3>
                                </div>
                                <button
                                    onClick={applyStockUpdates}
                                    disabled={applying || selectedStock.length === 0}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E63946] text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[16px]">sync</span>
                                    Actualizar {selectedStock.length} Stocks
                                </button>
                            </div>
                            <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left w-8">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStock.length === report.stock_desactualizados.length}
                                                    onChange={() => {
                                                        if (selectedStock.length === report.stock_desactualizados.length) {
                                                            setSelectedStock([]);
                                                        } else {
                                                            setSelectedStock(report.stock_desactualizados.map((_, i) => i));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left">Producto</th>
                                            <th className="px-4 py-3 text-right">KiplyStart</th>
                                            <th className="px-4 py-3 text-right">DroPanas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {report.stock_desactualizados.map((p, i) => (
                                            <tr key={i} className={`hover:bg-gray-50 ${selectedStock.includes(i) ? 'bg-blue-50/50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" checked={selectedStock.includes(i)} onChange={() => toggleStock(i)} className="rounded" />
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 max-w-[250px] truncate">{p.name}</td>
                                                <td className="px-4 py-3 text-right text-red-500 font-mono">{p.stock_kiplystart}</td>
                                                <td className="px-4 py-3 text-right text-green-600 font-bold font-mono">{p.stock_dropanas}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function SyncCard({ label, value, icon, color }) {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50',
        yellow: 'text-yellow-600 bg-yellow-50',
    };
    const [textColor, bgColor] = colors[color].split(' ');

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
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
