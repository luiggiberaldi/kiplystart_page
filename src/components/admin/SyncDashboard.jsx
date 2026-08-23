import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../context/CurrencyContext';
import { slugify } from '../../utils/slugify';
import { fetchAllDroPanasCatalog, compareDroPanasWithSupabase } from '../../lib/dropanasApi';
import { 
    RefreshCw, Sparkles, CheckCircle2, AlertTriangle, 
    Layers, Package, Download, EyeOff, Search, 
    Check, Clock, DollarSign, Boxes, FileJson, 
    ChevronDown, ChevronUp, ExternalLink, ShieldAlert, 
    ArrowRight, Tag, Activity
} from 'lucide-react';

const LAST_SYNC_KEY = 'kiply_dropanas_last_sync_report';

export default function SyncDashboard() {
    const { formatPrice } = useCurrency();
    
    // State
    const [report, setReport] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(null);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('nuevos');
    const [searchTerm, setSearchTerm] = useState('');
    const [showManualJson, setShowManualJson] = useState(false);

    // Selected Items State
    const [selectedNew, setSelectedNew] = useState([]);
    const [selectedEliminados, setSelectedEliminados] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedStock, setSelectedStock] = useState([]);

    // Load cached report on mount if exists
    useEffect(() => {
        try {
            const cached = localStorage.getItem(LAST_SYNC_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                setReport(parsed);
                initSelections(parsed);
            }
        } catch {
            // Ignore cache read errors
        }
    }, []);

    function initSelections(data) {
        if (!data) return;
        setSelectedNew(data.nuevos?.map((_, i) => i) || []);
        setSelectedEliminados(data.eliminados?.map((_, i) => i) || []);
        setSelectedPrices(data.precios_desactualizados?.map((_, i) => i) || []);
        setSelectedStock(data.stock_desactualizados?.map((_, i) => i) || []);
    }

    function showMsg(type, text) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 6000);
    }

    // ─── ⚡ 1-Click Live DroPanas Synchronization ────────────────────────
    async function handleLiveSync() {
        try {
            setSyncing(true);
            setSyncProgress({ percentage: 10, message: 'Consultando productos en KiplyStart...' });

            // 1. Fetch current local products from Supabase
            const { data: kiplyProducts, error: kiplyErr } = await supabase
                .from('products')
                .select('*');

            if (kiplyErr) throw kiplyErr;

            // 2. Fetch DroPanas API live catalog with progress callback
            setSyncProgress({ percentage: 25, message: 'Conectando con la bodega DroPanas...' });
            const droCatalog = await fetchAllDroPanasCatalog({
                onProgress: (p) => {
                    const mappedPct = 25 + Math.round((p.percentage * 0.65));
                    setSyncProgress({
                        percentage: Math.min(mappedPct, 90),
                        message: p.message
                    });
                }
            });

            // 3. Compare catalogs using standard business rules
            setSyncProgress({ percentage: 95, message: 'Analizando discrepancias y catalogando...' });
            const comparison = compareDroPanasWithSupabase(droCatalog, kiplyProducts || [], {
                shippingCost: 8,
                profitMargin: 6,
                markup: 1.4
            });

            setReport(comparison);
            initSelections(comparison);

            // Auto-switch to most actionable tab
            if (comparison.nuevos?.length > 0) setActiveTab('nuevos');
            else if (comparison.eliminados?.length > 0) setActiveTab('eliminados');
            else if (comparison.precios_desactualizados?.length > 0) setActiveTab('precios');
            else setActiveTab('activos');

            // Save to localStorage for quick restoration
            try {
                localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(comparison));
            } catch {}

            // Log activity
            await supabase.from('activity_log').insert({
                action: 'live_dropanas_sync',
                entity_type: 'catalog',
                details: {
                    total_dropanas: comparison.total_dropanas,
                    total_kiplystart: comparison.total_kiplystart,
                    nuevos: comparison.nuevos.length,
                    eliminados: comparison.eliminados.length,
                    precios_mal: comparison.precios_desactualizados.length,
                    stock_mal: comparison.stock_desactualizados.length
                }
            });

            showMsg('success', `⚡ Sincronización en vivo completada: ${comparison.total_dropanas} productos escaneados.`);
        } catch (err) {
            console.error('Live Sync Error:', err);
            showMsg('error', `Error en sincronización en vivo: ${err.message}`);
        } finally {
            setSyncing(false);
            setSyncProgress(null);
        }
    }

    // ─── 📁 Fallback: Load Scraper JSON File ──────────────────────────────
    function handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                setReport(data);
                initSelections(data);
                try {
                    localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(data));
                } catch {}
                showMsg('success', `✅ Reporte JSON cargado: ${data.total_dropanas || 0} productos analizados.`);
                setShowManualJson(false);
            } catch {
                showMsg('error', 'Error al parsear el archivo JSON');
            }
        };
        reader.readAsText(file);
    }

    // ─── 🆕 Import New Products ──────────────────────────────────────────
    async function importNewProducts(indicesToImport = null) {
        if (!report?.nuevos?.length) return;
        setApplying(true);

        const targets = indicesToImport !== null 
            ? indicesToImport 
            : selectedNew;

        const items = report.nuevos.filter((_, i) => targets.includes(i));
        let imported = 0, errors = 0;

        let counter = 0;
        for (const item of items) {
            counter++;
            const baseSlug = slugify(item.name);
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            
            const productData = {
                name: item.name,
                slug: `${baseSlug}-${randomCode}`,
                description: item.description || '<p>Producto con garantía y despacho rápido a toda Venezuela.</p>',
                price: item.precio_venta_ideal || 0,
                compare_at_price: item.compare_at_ideal || null,
                stock: item.stock || 0,
                images: item.images || [],
                category: 'Nuevos',
                is_active: item.stock > 0 && item.images && item.images.length > 0,
                dropanas_price: item.precio_proveedor || 0,
                dropanas_url: item.url || `https://dropanas.com/details/product/${item.dropanas_id}`,
                featured: false
            };

            const { error } = await supabase.from('products').insert(productData);

            if (error) {
                console.error('Import error:', error);
                errors++;
            } else {
                imported++;
            }
        }

        await supabase.from('activity_log').insert({
            action: 'bulk_import_products',
            entity_type: 'product',
            details: { imported, errors, total: items.length, source: 'dropanas_sync' }
        });

        // Update local report state
        const remainingNuevos = report.nuevos.filter((_, i) => !targets.includes(i));
        const updatedReport = { ...report, nuevos: remainingNuevos };
        setReport(updatedReport);
        setSelectedNew([]);
        try { localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(updatedReport)); } catch {}

        showMsg('success', `✅ ${imported} producto(s) importado(s) exitosamente a tu catálogo${errors > 0 ? `, ${errors} errores` : ''}.`);
        setApplying(false);
    }

    // ─── 🔴 Deactivate Out of Stock Products ─────────────────────────────
    async function deactivateProducts(indicesToDeactivate = null) {
        if (!report?.eliminados?.length) return;
        setApplying(true);

        const targets = indicesToDeactivate !== null 
            ? indicesToDeactivate 
            : selectedEliminados;

        const items = report.eliminados.filter((_, i) => targets.includes(i));
        let updated = 0, errors = 0;

        for (const item of items) {
            const { error } = await supabase
                .from('products')
                .update({ is_active: false })
                .eq('id', item.id);

            if (error) {
                console.error('Deactivate error:', error);
                errors++;
            } else {
                updated++;
            }
        }

        await supabase.from('activity_log').insert({
            action: 'bulk_deactivate_products',
            entity_type: 'product',
            details: { updated, errors, total: items.length, source: 'dropanas_sync' }
        });

        const remainingEliminados = report.eliminados.filter((_, i) => !targets.includes(i));
        const updatedReport = { ...report, eliminados: remainingEliminados };
        setReport(updatedReport);
        setSelectedEliminados([]);
        try { localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(updatedReport)); } catch {}

        showMsg('success', `⏸️ ${updated} producto(s) agotado(s) pausado(s) en la tienda para proteger tus ventas.`);
        setApplying(false);
    }

    // ─── 🟡 Apply Price Updates ──────────────────────────────────────────
    async function applyPriceUpdates(indicesToUpdate = null) {
        if (!report?.precios_desactualizados?.length) return;
        setApplying(true);

        const targets = indicesToUpdate !== null ? indicesToUpdate : selectedPrices;
        const items = report.precios_desactualizados.filter((_, i) => targets.includes(i));
        let updated = 0, errors = 0;

        for (const item of items) {
            const updatePayload = {
                price: item.precio_kiplystart_ideal,
                dropanas_price: item.precio_proveedor
            };
            if (item.compare_at_ideal) {
                updatePayload.compare_at_price = item.compare_at_ideal;
            }

            const { error } = await supabase
                .from('products')
                .update(updatePayload)
                .eq('id', item.id);

            if (error) errors++;
            else updated++;
        }

        await supabase.from('activity_log').insert({
            action: 'bulk_price_update',
            entity_type: 'product',
            details: { updated, errors, total: items.length, source: 'dropanas_sync' }
        });

        const remainingPrices = report.precios_desactualizados.filter((_, i) => !targets.includes(i));
        const updatedReport = { ...report, precios_desactualizados: remainingPrices };
        setReport(updatedReport);
        setSelectedPrices([]);
        try { localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(updatedReport)); } catch {}

        showMsg('success', `💰 ${updated} precio(s) ajustado(s) a la fórmula ideal de KiplyStart.`);
        setApplying(false);
    }

    // ─── 📦 Apply Stock Updates ──────────────────────────────────────────
    async function applyStockUpdates(indicesToUpdate = null) {
        if (!report?.stock_desactualizados?.length) return;
        setApplying(true);

        const targets = indicesToUpdate !== null ? indicesToUpdate : selectedStock;
        const items = report.stock_desactualizados.filter((_, i) => targets.includes(i));
        let updated = 0, errors = 0;

        for (const item of items) {
            const { error } = await supabase
                .from('products')
                .update({ stock: item.stock_dropanas, is_active: item.stock_dropanas > 0 })
                .eq('id', item.id);

            if (error) errors++;
            else updated++;
        }

        await supabase.from('activity_log').insert({
            action: 'bulk_stock_update',
            entity_type: 'product',
            details: { updated, errors, total: items.length, source: 'dropanas_sync' }
        });

        const remainingStock = report.stock_desactualizados.filter((_, i) => !targets.includes(i));
        const updatedReport = { ...report, stock_desactualizados: remainingStock };
        setReport(updatedReport);
        setSelectedStock([]);
        try { localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(updatedReport)); } catch {}

        showMsg('success', `📦 ${updated} inventario(s) de stock sincronizado(s) con la bodega.`);
        setApplying(false);
    }

    // ─── Filtered Items Memo ─────────────────────────────────────────────
    const filteredNuevos = useMemo(() => {
        if (!report?.nuevos) return [];
        if (!searchTerm) return report.nuevos;
        const q = searchTerm.toLowerCase();
        return report.nuevos.filter(p => p.name.toLowerCase().includes(q));
    }, [report?.nuevos, searchTerm]);

    const filteredEliminados = useMemo(() => {
        if (!report?.eliminados) return [];
        if (!searchTerm) return report.eliminados;
        const q = searchTerm.toLowerCase();
        return report.eliminados.filter(p => p.name.toLowerCase().includes(q));
    }, [report?.eliminados, searchTerm]);

    const filteredPrecios = useMemo(() => {
        if (!report?.precios_desactualizados) return [];
        if (!searchTerm) return report.precios_desactualizados;
        const q = searchTerm.toLowerCase();
        return report.precios_desactualizados.filter(p => (p.name || '').toLowerCase().includes(q));
    }, [report?.precios_desactualizados, searchTerm]);

    const filteredStock = useMemo(() => {
        if (!report?.stock_desactualizados) return [];
        if (!searchTerm) return report.stock_desactualizados;
        const q = searchTerm.toLowerCase();
        return report.stock_desactualizados.filter(p => (p.name || '').toLowerCase().includes(q));
    }, [report?.stock_desactualizados, searchTerm]);

    const filteredSincronizados = useMemo(() => {
        if (!report?.sincronizados) return [];
        if (!searchTerm) return report.sincronizados;
        const q = searchTerm.toLowerCase();
        return report.sincronizados.filter(p => (p.name || '').toLowerCase().includes(q));
    }, [report?.sincronizados, searchTerm]);

    const counts = {
        nuevos: report?.nuevos?.length || 0,
        eliminados: report?.eliminados?.length || 0,
        precios: report?.precios_desactualizados?.length || 0,
        stock: report?.stock_desactualizados?.length || 0,
        activos: report?.sincronizados?.length || 0
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200/80">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight flex items-center gap-2.5">
                        <span>Sincronización DroPanas</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200">
                            <Sparkles className="w-3 h-3" /> Live API
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Compara en vivo el catálogo de la bodega con tu tienda, detecta productos nuevos, agotados y precios desactualizados
                    </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={handleLiveSync}
                        disabled={syncing || applying}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A2463] hover:bg-[#081c4d] active:scale-95 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-900/10 cursor-pointer transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                        <span>{syncing ? 'Sincronizando Catálogo...' : '⚡ Sincronizar en Vivo'}</span>
                    </button>

                    <button
                        onClick={() => setShowManualJson(!showManualJson)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 shadow-xs cursor-pointer transition-all"
                        title="Opciones de archivo JSON manual"
                    >
                        <FileJson className="w-4 h-4 text-gray-500" />
                        <span className="hidden sm:inline">Cargar JSON</span>
                        {showManualJson ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                </div>
            </div>

            {/* Flash Message */}
            {message && (
                <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-fadeIn ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                    <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-2">×</button>
                </div>
            )}

            {/* Live Syncing Progress Card */}
            {syncing && syncProgress && (
                <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-sm space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#0A2463] flex items-center gap-2">
                            <Activity className="w-4 h-4 animate-pulse text-blue-600" />
                            {syncProgress.message}
                        </span>
                        <span className="text-gray-500 font-mono">{syncProgress.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${syncProgress.percentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Collapsible Manual JSON Dropzone */}
            {showManualJson && (
                <div className="bg-slate-50/70 rounded-3xl border-2 border-dashed border-gray-300 p-6 text-center animate-fadeIn space-y-3">
                    <FileJson className="w-10 h-10 text-gray-400 mx-auto" />
                    <div>
                        <p className="text-sm font-bold text-gray-800">Cargar reporte JSON generado por Scraper</p>
                        <p className="text-xs text-gray-500 mt-0.5">Arrastra el archivo <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[11px]">reporte_dropanas_*.json</code></p>
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-gray-200 text-gray-800 rounded-2xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                        <span>Seleccionar Archivo Local</span>
                        <input type="file" accept=".json" onChange={handleFileLoad} className="hidden" />
                    </label>
                </div>
            )}

            {/* KPI Summary Cards */}
            {report && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    <SyncStatCard 
                        label="Nuevos en Bodega" 
                        value={counts.nuevos} 
                        icon={<Sparkles className="w-4 h-4 text-purple-600" />} 
                        badge="Por Publicar"
                        color="purple"
                        active={activeTab === 'nuevos'}
                        onClick={() => setActiveTab('nuevos')}
                    />
                    <SyncStatCard 
                        label="Agotados / Inactivos" 
                        value={counts.eliminados} 
                        icon={<EyeOff className="w-4 h-4 text-rose-600" />} 
                        badge="Pausar en Tienda"
                        color="rose"
                        active={activeTab === 'eliminados'}
                        onClick={() => setActiveTab('eliminados')}
                    />
                    <SyncStatCard 
                        label="Precios Desactualizados" 
                        value={counts.precios} 
                        icon={<DollarSign className="w-4 h-4 text-amber-600" />} 
                        badge="Margen Ganancia"
                        color="amber"
                        active={activeTab === 'precios'}
                        onClick={() => setActiveTab('precios')}
                    />
                    <SyncStatCard 
                        label="Stock Desactualizado" 
                        value={counts.stock} 
                        icon={<Boxes className="w-4 h-4 text-blue-600" />} 
                        badge="Inventario"
                        color="blue"
                        active={activeTab === 'stock'}
                        onClick={() => setActiveTab('stock')}
                    />
                    <SyncStatCard 
                        label="Activos & Al Día" 
                        value={counts.activos} 
                        icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} 
                        badge="Sincronizados"
                        color="emerald"
                        active={activeTab === 'activos'}
                        onClick={() => setActiveTab('activos')}
                    />
                </div>
            )}

            {/* Report Content Body */}
            {!report ? (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-[#0A2463] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-gray-900">Catálogo listo para sincronizar</h3>
                        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1">
                            Presiona el botón <strong>«⚡ Sincronizar en Vivo»</strong> para consultar en tiempo real el inventario de DroPanas y compararlo con tu tienda.
                        </p>
                    </div>
                    <button
                        onClick={handleLiveSync}
                        disabled={syncing}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A2463] hover:bg-[#081c4d] text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-900/15 cursor-pointer active:scale-95 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Sincronizar Catálogo Ahora</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Tab Navigation & Search Bar */}
                    <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white p-2.5 rounded-2xl border border-gray-200">
                        {/* Tab Pills */}
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'nuevos', label: 'Nuevos en DroPanas', count: counts.nuevos, color: 'text-purple-700 bg-purple-50' },
                                { id: 'eliminados', label: 'Agotados / Pausar', count: counts.eliminados, color: 'text-rose-700 bg-rose-50' },
                                { id: 'precios', label: 'Precios', count: counts.precios, color: 'text-amber-700 bg-amber-50' },
                                { id: 'stock', label: 'Stock', count: counts.stock, color: 'text-blue-700 bg-blue-50' },
                                { id: 'activos', label: 'Activos & Al Día', count: counts.activos, color: 'text-emerald-700 bg-emerald-50' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'bg-[#0A2463] text-white shadow-xs'
                                            : 'text-gray-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                                        activeTab === tab.id ? 'bg-white/20 text-white' : tab.color
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search in Tab */}
                        <div className="relative min-w-[220px]">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Filtrar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0A2463] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* TAB 1: NUEVOS PRODUCTOS */}
                    {activeTab === 'nuevos' && (
                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-purple-50/20">
                                <div>
                                    <h3 className="font-black text-base text-gray-950 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-600" />
                                        <span>Productos Nuevos en DroPanas ({filteredNuevos.length})</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Disponibles en bodega con stock e imágenes listas para publicar con fórmula KiplyStart
                                    </p>
                                </div>

                                {filteredNuevos.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => importNewProducts()}
                                            disabled={applying || selectedNew.length === 0}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Importar Seleccionados ({selectedNew.length})</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredNuevos.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="font-bold text-sm text-gray-800">¡Tu catálogo está 100% al día!</p>
                                    <p className="text-xs text-gray-400 mt-0.5">No hay productos nuevos pendientes por importar de DroPanas.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                    {/* Select all header */}
                                    <div className="px-5 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-black text-gray-500 uppercase tracking-wider">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedNew.length === report.nuevos.length && report.nuevos.length > 0}
                                                onChange={() => {
                                                    if (selectedNew.length === report.nuevos.length) setSelectedNew([]);
                                                    else setSelectedNew(report.nuevos.map((_, i) => i));
                                                }}
                                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                                            />
                                            <span>Seleccionar Todos ({report.nuevos.length})</span>
                                        </label>
                                        <span>Fórmula: Costo + $8 Envío + $6 Ganancia</span>
                                    </div>

                                    {filteredNuevos.map((p, idx) => {
                                        const originalIndex = report.nuevos.indexOf(p);
                                        const isSelected = selectedNew.includes(originalIndex);

                                        return (
                                            <div 
                                                key={p.dropanas_id || idx}
                                                className={`p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors ${
                                                    isSelected ? 'bg-purple-50/40' : ''
                                                }`}
                                            >
                                                <div className="flex items-start sm:items-center gap-3.5 overflow-hidden">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedNew(prev => 
                                                                prev.includes(originalIndex) 
                                                                    ? prev.filter(i => i !== originalIndex) 
                                                                    : [...prev, originalIndex]
                                                            );
                                                        }}
                                                        className="w-4 h-4 mt-1 sm:mt-0 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                                                    />

                                                    {p.images && p.images[0] ? (
                                                        <img 
                                                            src={p.images[0]} 
                                                            alt={p.name} 
                                                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white shrink-0" 
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                                                            <Package className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}

                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="font-extrabold text-sm text-gray-900 truncate">
                                                            {p.name}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                                            <span className="text-gray-500">
                                                                Proveedor: <strong>${p.precio_proveedor}</strong>
                                                            </span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="text-purple-700 font-bold">
                                                                Ganancia Est: +${p.ganancia_estimada}
                                                            </span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                                                                Stock: {p.stock} un.
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0 shrink-0">
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-[#0A2463] tabular-nums">
                                                            ${p.precio_venta_ideal}
                                                        </p>
                                                        {p.compare_at_ideal && (
                                                            <p className="text-[11px] text-gray-400 line-through">
                                                                ${p.compare_at_ideal}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => importNewProducts([originalIndex])}
                                                        disabled={applying}
                                                        className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-black cursor-pointer transition-colors"
                                                    >
                                                        Importar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: AGOTADOS / DESCONTINUADOS */}
                    {activeTab === 'eliminados' && (
                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-rose-50/20">
                                <div>
                                    <h3 className="font-black text-base text-gray-950 flex items-center gap-2">
                                        <EyeOff className="w-4 h-4 text-rose-600" />
                                        <span>Productos Agotados en DroPanas ({filteredEliminados.length})</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Estos productos siguen activos en KiplyStart pero en DroPanas ya no tienen stock. Pausalos para evitar pedidos no despachables.
                                    </p>
                                </div>

                                {filteredEliminados.length > 0 && (
                                    <button
                                        onClick={() => deactivateProducts()}
                                        disabled={applying || selectedEliminados.length === 0}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <EyeOff className="w-3.5 h-3.5" />
                                        <span>Pausar Seleccionados ({selectedEliminados.length})</span>
                                    </button>
                                )}
                            </div>

                            {filteredEliminados.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="font-bold text-sm text-gray-800">¡Ningún producto activo está agotado!</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Todos tus productos publicados tienen inventario confirmado en la bodega.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                    <div className="px-5 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-black text-gray-500 uppercase tracking-wider">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedEliminados.length === report.eliminados.length && report.eliminados.length > 0}
                                                onChange={() => {
                                                    if (selectedEliminados.length === report.eliminados.length) setSelectedEliminados([]);
                                                    else setSelectedEliminados(report.eliminados.map((_, i) => i));
                                                }}
                                                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                                            />
                                            <span>Seleccionar Todos ({report.eliminados.length})</span>
                                        </label>
                                        <span>Acción Recomendada: Pausar en Tienda</span>
                                    </div>

                                    {filteredEliminados.map((p, idx) => {
                                        const originalIndex = report.eliminados.indexOf(p);
                                        const isSelected = selectedEliminados.includes(originalIndex);

                                        return (
                                            <div 
                                                key={p.id || idx}
                                                className={`p-4 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors ${
                                                    isSelected ? 'bg-rose-50/40' : ''
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedEliminados(prev => 
                                                                prev.includes(originalIndex) 
                                                                    ? prev.filter(i => i !== originalIndex) 
                                                                    : [...prev, originalIndex]
                                                            );
                                                        }}
                                                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer shrink-0"
                                                    />

                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="font-extrabold text-sm text-gray-900 truncate">
                                                            {p.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-gray-500">Categoría: {p.category || 'General'}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md">
                                                                Stock Bodega: 0 un.
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="font-bold text-gray-700 text-sm">
                                                        {formatPrice(p.price)}
                                                    </span>
                                                    <button
                                                        onClick={() => deactivateProducts([originalIndex])}
                                                        disabled={applying}
                                                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black cursor-pointer transition-colors"
                                                    >
                                                        Pausar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: PRECIOS & STOCK */}
                    {activeTab === 'precios' && (
                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-amber-50/20">
                                <div>
                                    <h3 className="font-black text-base text-gray-950 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-amber-600" />
                                        <span>Precios Desactualizados ({filteredPrecios.length})</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Productos donde el costo del proveedor varió y requieren ajuste de precio de venta
                                    </p>
                                </div>

                                {filteredPrecios.length > 0 && (
                                    <button
                                        onClick={() => applyPriceUpdates()}
                                        disabled={applying || selectedPrices.length === 0}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Actualizar Precios ({selectedPrices.length})</span>
                                    </button>
                                )}
                            </div>

                            {filteredPrecios.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="font-bold text-sm text-gray-800">¡Precios 100% alineados!</p>
                                    <p className="text-xs text-gray-400 mt-0.5">No hay discrepancias con los costos actuales del proveedor.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-[11px] font-black text-gray-500 uppercase tracking-wider sticky top-0">
                                            <tr>
                                                <th className="p-4 w-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPrices.length === report.precios_desactualizados.length}
                                                        onChange={() => {
                                                            if (selectedPrices.length === report.precios_desactualizados.length) setSelectedPrices([]);
                                                            else setSelectedPrices(report.precios_desactualizados.map((_, i) => i));
                                                        }}
                                                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                                                    />
                                                </th>
                                                <th className="p-4">Producto</th>
                                                <th className="p-4 text-right">Costo Proveedor</th>
                                                <th className="p-4 text-right">Precio Actual</th>
                                                <th className="p-4 text-right">Precio Ideal KiplyStart</th>
                                                <th className="p-4 text-right">Ganancia Est.</th>
                                                <th className="p-4 text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredPrecios.map((p, idx) => {
                                                const originalIndex = report.precios_desactualizados.indexOf(p);
                                                const isSelected = selectedPrices.includes(originalIndex);

                                                return (
                                                    <tr key={p.id || idx} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-amber-50/40' : ''}`}>
                                                        <td className="p-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => {
                                                                    setSelectedPrices(prev => 
                                                                        prev.includes(originalIndex) 
                                                                            ? prev.filter(i => i !== originalIndex) 
                                                                            : [...prev, originalIndex]
                                                                    );
                                                                }}
                                                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="p-4 font-extrabold text-gray-900 max-w-[280px] truncate">
                                                            {p.name}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-bold text-gray-600">
                                                            ${p.precio_proveedor}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-bold text-rose-600 line-through">
                                                            ${p.precio_actual}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-black text-emerald-700 text-sm">
                                                            ${p.precio_kiplystart_ideal}
                                                        </td>
                                                        <td className="p-4 text-right font-bold text-purple-700">
                                                            +${p.ganancia_estimada}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => applyPriceUpdates([originalIndex])}
                                                                disabled={applying}
                                                                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-extrabold cursor-pointer"
                                                            >
                                                                Aplicar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 4: STOCK DESACTUALIZADO */}
                    {activeTab === 'stock' && (
                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-blue-50/20">
                                <div>
                                    <h3 className="font-black text-base text-gray-950 flex items-center gap-2">
                                        <Boxes className="w-4 h-4 text-blue-600" />
                                        <span>Stock Desactualizado ({filteredStock.length})</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Productos donde el inventario en tienda difiere de la existencia real en bodega DroPanas
                                    </p>
                                </div>

                                {filteredStock.length > 0 && (
                                    <button
                                        onClick={() => applyStockUpdates()}
                                        disabled={applying || selectedStock.length === 0}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Sincronizar Stocks ({selectedStock.length})</span>
                                    </button>
                                )}
                            </div>

                            {filteredStock.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="font-bold text-sm text-gray-800">¡Inventario 100% al día!</p>
                                    <p className="text-xs text-gray-400 mt-0.5">El stock de tus productos coincide con el físico disponible en bodega.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-[11px] font-black text-gray-500 uppercase tracking-wider sticky top-0">
                                            <tr>
                                                <th className="p-4 w-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStock.length === report.stock_desactualizados.length}
                                                        onChange={() => {
                                                            if (selectedStock.length === report.stock_desactualizados.length) setSelectedStock([]);
                                                            else setSelectedStock(report.stock_desactualizados.map((_, i) => i));
                                                        }}
                                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="p-4">Producto</th>
                                                <th className="p-4 text-right">Stock en Tienda</th>
                                                <th className="p-4 text-right">Stock en Bodega DroPanas</th>
                                                <th className="p-4 text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredStock.map((p, idx) => {
                                                const originalIndex = report.stock_desactualizados.indexOf(p);
                                                const isSelected = selectedStock.includes(originalIndex);

                                                return (
                                                    <tr key={p.id || idx} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}>
                                                        <td className="p-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => {
                                                                    setSelectedStock(prev => 
                                                                        prev.includes(originalIndex) 
                                                                            ? prev.filter(i => i !== originalIndex) 
                                                                            : [...prev, originalIndex]
                                                                    );
                                                                }}
                                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="p-4 font-extrabold text-gray-900 max-w-[320px] truncate">
                                                            {p.name}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-bold text-rose-600">
                                                            {p.stock_actual} un.
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-black text-emerald-700 text-sm">
                                                            {p.stock_dropanas} un.
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => applyStockUpdates([originalIndex])}
                                                                disabled={applying}
                                                                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-extrabold cursor-pointer"
                                                            >
                                                                Actualizar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 5: ACTIVOS & SINCRONIZADOS */}
                    {activeTab === 'activos' && (
                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/20">
                                <div>
                                    <h3 className="font-black text-base text-gray-950 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Productos Activos & Sincronizados ({filteredSincronizados.length})</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Productos que están activos en tienda con precio y stock al día con DroPanas
                                    </p>
                                </div>
                            </div>

                            {filteredSincronizados.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <p className="text-xs">No hay productos en esta sección.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                    {filteredSincronizados.map((p, idx) => (
                                        <div key={p.id || idx} className="p-4 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                            <div className="space-y-0.5 min-w-0">
                                                <p className="font-extrabold text-sm text-gray-900 truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Categoría: {p.category || 'General'}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl text-xs">
                                                    Stock: {p.stock} un.
                                                </span>
                                                <span className="text-[#0A2463] font-black text-sm">
                                                    {formatPrice(p.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SyncStatCard({ label, value, icon, badge, color, active, onClick }) {
    const colorClasses = {
        purple: active ? 'ring-2 ring-purple-500 bg-purple-50/40' : 'hover:border-purple-200',
        rose: active ? 'ring-2 ring-rose-500 bg-rose-50/40' : 'hover:border-rose-200',
        amber: active ? 'ring-2 ring-amber-500 bg-amber-50/40' : 'hover:border-amber-200',
        blue: active ? 'ring-2 ring-blue-500 bg-blue-50/40' : 'hover:border-blue-200',
        emerald: active ? 'ring-2 ring-emerald-500 bg-emerald-50/40' : 'hover:border-emerald-200',
    };

    return (
        <button
            onClick={onClick}
            className={`bg-white p-4 rounded-3xl border border-gray-200 shadow-xs text-left cursor-pointer transition-all active:scale-95 ${
                colorClasses[color] || ''
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-2xl bg-slate-50 border border-gray-100">
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    {badge}
                </span>
            </div>
            <p className="text-2xl font-black text-gray-950 tabular-nums">
                {value}
            </p>
            <p className="text-xs font-bold text-gray-500 mt-0.5 truncate">
                {label}
            </p>
        </button>
    );
}

