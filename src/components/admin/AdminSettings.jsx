import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useCurrency } from '../../context/CurrencyContext';
import { supabase } from '../../lib/supabaseClient';
import { 
    Save, RotateCcw, CheckCircle2, AlertTriangle, 
    DollarSign, Percent, Store, Phone, 
    Instagram, Mail, Coins, ShieldCheck, 
    Sparkles, RefreshCw, Layers, Flame, Calculator,
    Zap, ArrowRight
} from 'lucide-react';

export default function AdminSettings() {
    const { settings, saveSettings, loaded } = useSettings();
    const { exchangeRate } = useCurrency();
    const [local, setLocal] = useState(settings);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [dirty, setDirty] = useState(false);

    // Bulk Recalculation State
    const [recalculating, setRecalculating] = useState(false);
    const [recalcProgress, setRecalcProgress] = useState(0);
    const [recalcResult, setRecalcResult] = useState(null);

    useEffect(() => {
        if (loaded) {
            setLocal(settings);
            setDirty(false);
        }
    }, [loaded, settings]);

    function handleChange(key, value) {
        setLocal(prev => ({ ...prev, [key]: value }));
        setDirty(true);
        setStatus(null);
    }

    async function handleSave() {
        setSaving(true);
        try {
            await saveSettings(local);
            setStatus('success');
            setDirty(false);
            setTimeout(() => setStatus(null), 4000);
        } catch (err) {
            console.error('Save failed:', err);
            setStatus('error');
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        setLocal(settings);
        setDirty(false);
        setStatus(null);
    }

    // Recalculates all products in the database using the new formula
    async function handleBulkRecalculate() {
        if (!window.confirm(`¿Deseas recalcular y actualizar los precios de venta de todo el catálogo en Supabase usando Costo de Envío ($${local.shipping_cost}) y Margen ($${local.profit_margin})?`)) {
            return;
        }

        setRecalculating(true);
        setRecalcProgress(0);
        setRecalcResult(null);

        try {
            // First save the settings
            await saveSettings(local);
            setDirty(false);

            // Fetch all products
            const { data: products, error } = await supabase
                .from('products')
                .select('id, name, dropanas_price, price, compare_at_price');

            if (error) throw error;

            const toUpdate = products.filter(p => p.dropanas_price && p.dropanas_price > 0);
            let updatedCount = 0;

            for (let i = 0; i < toUpdate.length; i++) {
                const prod = toUpdate[i];
                const newPrice = Math.ceil(prod.dropanas_price + (local.shipping_cost || 8) + (local.profit_margin || 6));
                const newCompareAt = parseFloat((newPrice * (local.compare_at_multiplier || 1.4)).toFixed(0)) + 0.90;

                await supabase.from('products').update({
                    price: newPrice,
                    compare_at_price: newCompareAt,
                    bundle_2_discount: local.bundle_2_discount || 10,
                    bundle_3_discount: local.bundle_3_discount || 20
                }).eq('id', prod.id);

                updatedCount++;
                setRecalcProgress(Math.round(((i + 1) / toUpdate.length) * 100));
            }

            setRecalcResult({
                success: true,
                count: updatedCount,
                total: products.length
            });

            setTimeout(() => setRecalcResult(null), 7000);
        } catch (err) {
            console.error('Error recalculating prices:', err);
            setRecalcResult({ success: false, message: err.message });
        } finally {
            setRecalculating(false);
        }
    }

    if (!loaded) {
        return (
            <div className="flex justify-center p-16">
                <div className="w-10 h-10 border-3 border-[#0A2463]/20 border-t-[#0A2463] rounded-full animate-spin" />
            </div>
        );
    }

    // Example calculation for visual helper
    const exampleCost = 10;
    const exampleSalePrice = Math.ceil(exampleCost + (local.shipping_cost || 6) + (local.profit_margin || 5));
    const exampleCompareAt = Math.round(exampleSalePrice * (local.compare_at_multiplier || 1.4));

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header & Main Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200/80">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                        Configuración del Negocio
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Ajusta márgenes de ganancia, canales de WhatsApp y parámetros de tasa oficial
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {dirty && (
                        <button 
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Deshacer</span>
                        </button>
                    )}

                    <button 
                        onClick={handleSave} 
                        disabled={saving || !dirty}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-lg cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                            status === 'success'
                                ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                                : status === 'error'
                                    ? 'bg-red-600 text-white shadow-red-600/25'
                                    : dirty
                                        ? 'bg-brand-red hover:bg-red-700 text-white shadow-brand-red/25'
                                        : 'bg-slate-200 text-slate-500 shadow-none'
                        }`}
                    >
                        {saving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Guardando Cambios...</span>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>¡Configuración Guardada!</span>
                            </>
                        ) : status === 'error' ? (
                            <>
                                <AlertTriangle className="w-4 h-4" />
                                <span>Error al guardar</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{dirty ? 'Guardar Cambios' : 'Todo al Día'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Recalculate Feedback Alert */}
            {recalcResult && (
                <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 animate-slideUp ${
                    recalcResult.success 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                    {recalcResult.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <div>
                        <p className="text-xs sm:text-sm font-black">
                            {recalcResult.success 
                                ? `¡Precios actualizados con éxito! Se recalcularon ${recalcResult.count} productos del catálogo.`
                                : `Error al recalcular: ${recalcResult.message}`}
                        </p>
                    </div>
                </div>
            )}

            {/* Unsaved Changes Banner */}
            {dirty && (
                <div className="bg-amber-50 border-2 border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 animate-slideUp">
                    <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-xs sm:text-sm font-extrabold">Tienes modificaciones pendientes por guardar</p>
                            <p className="text-[11px] text-amber-700 font-medium">Recuerda hacer clic en "Guardar Cambios" para guardar los parámetros globales.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer shrink-0"
                    >
                        Guardar Ahora
                    </button>
                </div>
            )}

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* ===== 1. PRICING FORMULA ===== */}
                <SettingsCard 
                    icon={Calculator} 
                    title="Fórmula y Márgenes de Precios" 
                    subtitle="Estructura de costos para calcular el precio final al consumidor"
                >
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                            <span>Simulación con producto de $10 USD:</span>
                            <span className="text-emerald-700 font-black">${exampleSalePrice} USD Venta</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-mono">
                            Precio = ${exampleCost} (costo) + ${local.shipping_cost} (envío) + ${local.profit_margin} (ganancia) = <strong className="text-gray-900">${exampleSalePrice} USD</strong> (Tachado: ${exampleCompareAt})
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SettingInput 
                            label="Costo Estimado de Envío" 
                            value={local.shipping_cost}
                            onChange={v => handleChange('shipping_cost', parseFloat(v) || 0)} 
                            type="number" 
                            prefix="$" 
                            suffix="USD"
                        />
                        <SettingInput 
                            label="Margen de Ganancia Neto" 
                            value={local.profit_margin}
                            onChange={v => handleChange('profit_margin', parseFloat(v) || 0)} 
                            type="number" 
                            prefix="$" 
                            suffix="USD"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SettingInput 
                            label="Multiplicador Precio Tachado" 
                            value={local.compare_at_multiplier}
                            onChange={v => handleChange('compare_at_multiplier', parseFloat(v) || 1)} 
                            type="number" 
                            prefix="×" 
                            step="0.1" 
                        />
                        <SettingInput 
                            label="Sufijo Decimales Tachado" 
                            value={local.compare_at_suffix}
                            onChange={v => handleChange('compare_at_suffix', v)} 
                            type="text" 
                            placeholder=".90"
                        />
                    </div>

                    {/* ⚡ Bulk Recalculate Button */}
                    <div className="pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleBulkRecalculate}
                            disabled={recalculating}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A2463] to-blue-900 hover:from-blue-900 hover:to-[#0A2463] text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                        >
                            {recalculating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Recalculando Catálogo ({recalcProgress}%)...</span>
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span>Aplicar y Recalcular Precios de Todos los Productos</span>
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed">
                            Aplica la fórmula actual a los 212 productos sincronizados con DroPanas de una sola vez.
                        </p>
                    </div>
                </SettingsCard>

                {/* ===== 2. BUNDLES & STOCK ===== */}
                <SettingsCard 
                    icon={Percent} 
                    title="Ofertas de Bundles y Stock" 
                    subtitle="Configuración de descuentos por volumen y alertas de inventario"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SettingInput 
                            label="Descuento Pack 2X" 
                            value={local.bundle_2_discount}
                            onChange={v => handleChange('bundle_2_discount', parseInt(v) || 0)} 
                            type="number" 
                            suffix="%" 
                        />
                        <SettingInput 
                            label="Descuento Pack 3X" 
                            value={local.bundle_3_discount}
                            onChange={v => handleChange('bundle_3_discount', parseInt(v) || 0)} 
                            type="number" 
                            suffix="%" 
                        />
                    </div>

                    <SettingInput 
                        label="Umbral de Alerta de Stock Bajo" 
                        value={local.low_stock_threshold}
                        onChange={v => handleChange('low_stock_threshold', parseInt(v) || 0)} 
                        type="number" 
                        suffix="unidades"
                    />

                    <div className="pt-2 space-y-3 border-t border-gray-100">
                        <SettingToggle 
                            label="Ocultar o pausar productos sin stock" 
                            desc="Los productos con 0 unidades no se mostrarán como disponibles para compra"
                            value={local.auto_deactivate_oos} 
                            onChange={v => handleChange('auto_deactivate_oos', v)} 
                        />
                        <SettingToggle 
                            label="Notificar cuando el stock esté bajo" 
                            desc="Muestra badge de urgencia en la tarjeta y ficha del producto"
                            value={local.notify_low_stock} 
                            onChange={v => handleChange('notify_low_stock', v)} 
                        />
                    </div>
                </SettingsCard>

                {/* ===== 3. CONTACT & WHATSAPP ===== */}
                <SettingsCard 
                    icon={Phone} 
                    title="Canales Oficiales de Contacto" 
                    subtitle="Números y redes donde los clientes confirman sus órdenes COD"
                >
                    <SettingInput 
                        label="WhatsApp Receptor de Pedidos (Formato Internacional)" 
                        value={local.whatsapp_number}
                        onChange={v => handleChange('whatsapp_number', v)} 
                        type="text" 
                        prefix="📱" 
                        placeholder="+584124340546" 
                    />
                    <SettingInput 
                        label="Usuario de Instagram" 
                        value={local.instagram_handle}
                        onChange={v => handleChange('instagram_handle', v)} 
                        type="text" 
                        prefix="@" 
                        placeholder="kiplystart" 
                    />
                </SettingsCard>

                {/* ===== 4. EXCHANGE RATE BCV ===== */}
                <SettingsCard 
                    icon={Coins} 
                    title="Conversión Monetaria y Tasa Oficial BCV" 
                    subtitle="Control de la tasa de cambio utilizada para el Pago Móvil"
                >
                    <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <div>
                                <p className="text-xs font-extrabold text-[#0A2463]">Tasa Oficial BCV en Vivo</p>
                                <p className="text-[11px] text-blue-700">DolarAPI Venezuela Oficial</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-[#0A2463] tabular-nums">
                            {exchangeRate ? `Bs. ${exchangeRate.toFixed(2)}` : 'Cargando...'}
                        </span>
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                            Modo de Tasa de Cambio
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                            <button 
                                type="button"
                                onClick={() => handleChange('rate_mode', 'auto')}
                                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border-2 flex items-center justify-center gap-2 cursor-pointer ${
                                    local.rate_mode === 'auto'
                                        ? 'bg-[#0A2463] text-white border-[#0A2463] shadow-md'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Automático (BCV API)</span>
                            </button>

                            <button 
                                type="button"
                                onClick={() => handleChange('rate_mode', 'manual')}
                                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border-2 flex items-center justify-center gap-2 cursor-pointer ${
                                    local.rate_mode === 'manual'
                                        ? 'bg-[#0A2463] text-white border-[#0A2463] shadow-md'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <span>Manual</span>
                            </button>
                        </div>
                    </div>

                    {local.rate_mode === 'manual' && (
                        <SettingInput 
                            label="Tasa Manual Fijada (Bs por $1 USD)" 
                            value={local.manual_rate}
                            onChange={v => handleChange('manual_rate', parseFloat(v) || 0)} 
                            type="number" 
                            prefix="Bs." 
                            step="0.01" 
                        />
                    )}

                    <div className="pt-2 border-t border-gray-100">
                        <SettingToggle 
                            label="Mostrar precios bimonetarios en Bolívares (Bs)" 
                            desc="Si está activo, cada producto mostrará su precio en USD y en Bs a la tasa oficial"
                            value={local.show_bs} 
                            onChange={v => handleChange('show_bs', v)} 
                        />
                    </div>
                </SettingsCard>

                {/* ===== 5. STORE IDENTITY ===== */}
                <SettingsCard 
                    icon={Store} 
                    title="Identidad de la Tienda" 
                    subtitle="Información general de la marca KiplyStart"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SettingInput 
                            label="Nombre de la Tienda" 
                            value={local.store_name}
                            onChange={v => handleChange('store_name', v)} 
                            type="text" 
                            prefix="🏪" 
                        />
                        <SettingInput 
                            label="Moneda Base" 
                            value={local.currency}
                            onChange={v => handleChange('currency', v)} 
                            type="text" 
                            prefix="💱" 
                        />
                    </div>
                    <SettingInput 
                        label="Email de Notificaciones Administrativas" 
                        value={local.admin_email}
                        onChange={v => handleChange('admin_email', v)} 
                        type="email" 
                        prefix="✉️" 
                        placeholder="tu@email.com" 
                    />
                </SettingsCard>
            </div>
        </div>
    );
}

/* === Clean Sub-components === */

function SettingsCard({ icon: Icon, title, subtitle, children }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0A2463] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-extrabold text-base text-gray-950 tracking-tight">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5 font-medium">{subtitle}</p>}
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function SettingInput({ label, value, onChange, type = "text", prefix, suffix, step, placeholder }) {
    return (
        <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">
                        {prefix}
                    </span>
                )}
                <input 
                    type={type} 
                    step={step} 
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)} 
                    placeholder={placeholder}
                    className={`w-full ${prefix ? 'pl-10' : 'pl-4'} ${suffix ? 'pr-16' : 'pr-4'} py-3 bg-slate-50 border-2 border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-950 placeholder:text-gray-400 focus:bg-white focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/10 outline-none transition-all`} 
                />
                {suffix && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
}

function SettingToggle({ label, desc, value, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-gray-200">
            <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 block">{label}</span>
                {desc && <span className="text-[11px] text-gray-500 block mt-0.5 leading-snug">{desc}</span>}
            </div>
            <button 
                type="button" 
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer ${
                    value ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
                aria-label={label}
            >
                <span className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md transform ring-0 transition-transform duration-200 ease-in-out ${
                    value ? 'translate-x-5' : 'translate-x-0'
                }`} />
            </button>
        </div>
    );
}
