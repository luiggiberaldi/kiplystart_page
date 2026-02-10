import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

/**
 * AdminSettings - Persists all config to Supabase via SettingsContext
 */
export default function AdminSettings() {
    const { settings, saveSettings, loaded } = useSettings();
    const [local, setLocal] = useState(settings);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (loaded) setLocal(settings);
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

    if (!loaded) {
        return (
            <div className="flex justify-center p-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-display text-brand-blue">Configuración</h2>
                    <p className="text-gray-500 text-sm">Parámetros del negocio &bull; Guardado en la nube</p>
                </div>
                <div className="flex items-center gap-3">
                    {dirty && (
                        <button onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Deshacer
                        </button>
                    )}
                    <button onClick={handleSave} disabled={saving || !dirty}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${status === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : status === 'error'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-[#E63946] text-white hover:bg-red-700 shadow-lg shadow-red-500/20'
                            }`}>
                        <span className="material-symbols-outlined text-[18px]">
                            {saving ? 'sync' : status === 'success' ? 'check_circle' : status === 'error' ? 'error' : 'cloud_upload'}
                        </span>
                        {saving ? 'Guardando...' : status === 'success' ? '¡Guardado!' : status === 'error' ? 'Error al guardar' : dirty ? 'Guardar Cambios' : 'Sin cambios'}
                    </button>
                </div>
            </div>

            {/* Unsaved changes banner */}
            {dirty && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]">warning</span>
                    <span className="text-sm text-amber-700 font-medium">Tienes cambios sin guardar</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ===== PRICING FORMULA ===== */}
                <SettingsCard icon="payments" title="Fórmula de Precios" subtitle="Cálculo automático de precio de venta">
                    <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg font-mono">
                        precio = ceil(max(costo + envío + ganancia, sugerido))
                    </p>
                    <SettingInput label="Costo de Envío ($)" value={local.shipping_cost}
                        onChange={v => handleChange('shipping_cost', parseFloat(v) || 0)} type="number" prefix="$" />
                    <SettingInput label="Margen de Ganancia ($)" value={local.profit_margin}
                        onChange={v => handleChange('profit_margin', parseFloat(v) || 0)} type="number" prefix="$" />
                    <SettingInput label="Multiplicador Compare At" value={local.compare_at_multiplier}
                        onChange={v => handleChange('compare_at_multiplier', parseFloat(v) || 1)} type="number" prefix="×" step="0.1" />
                    <SettingInput label="Sufijo Compare At" value={local.compare_at_suffix}
                        onChange={v => handleChange('compare_at_suffix', v)} type="text" />
                </SettingsCard>

                {/* ===== BUNDLES & STOCK ===== */}
                <SettingsCard icon="sell" title="Bundles y Stock" subtitle="Descuentos por cantidad y alertas de inventario">
                    <SettingInput label="Descuento Bundle 2x (%)" value={local.bundle_2_discount}
                        onChange={v => handleChange('bundle_2_discount', parseInt(v) || 0)} type="number" suffix="%" />
                    <SettingInput label="Descuento Bundle 3x (%)" value={local.bundle_3_discount}
                        onChange={v => handleChange('bundle_3_discount', parseInt(v) || 0)} type="number" suffix="%" />
                    <SettingInput label="Umbral Stock Bajo" value={local.low_stock_threshold}
                        onChange={v => handleChange('low_stock_threshold', parseInt(v) || 0)} type="number" />
                    <SettingToggle label="Desactivar productos sin stock"
                        value={local.auto_deactivate_oos} onChange={v => handleChange('auto_deactivate_oos', v)} />
                    <SettingToggle label="Notificar stock bajo"
                        value={local.notify_low_stock} onChange={v => handleChange('notify_low_stock', v)} />
                </SettingsCard>

                {/* ===== STORE INFO ===== */}
                <SettingsCard icon="storefront" title="Info de Tienda" subtitle="Datos visibles en la tienda y comunicaciones">
                    <SettingInput label="Nombre de la Tienda" value={local.store_name}
                        onChange={v => handleChange('store_name', v)} type="text" prefix="🏪" />
                    <SettingInput label="Moneda" value={local.currency}
                        onChange={v => handleChange('currency', v)} type="text" prefix="💱" />
                    <SettingInput label="Email Administrador" value={local.admin_email}
                        onChange={v => handleChange('admin_email', v)} type="email" prefix="✉️" placeholder="tu@email.com" />
                </SettingsCard>

                {/* ===== CHANNELS ===== */}
                <SettingsCard icon="share" title="Canales de Contacto" subtitle="Canales de comunicación con clientes">
                    <SettingInput label="WhatsApp Recepción" value={local.whatsapp_number}
                        onChange={v => handleChange('whatsapp_number', v)} type="text" prefix="📱" placeholder="+584121234567" />
                    <SettingInput label="Instagram" value={local.instagram_handle}
                        onChange={v => handleChange('instagram_handle', v)} type="text" prefix="@" placeholder="tu.tienda" />
                </SettingsCard>

                {/* ===== EXCHANGE RATE ===== */}
                <SettingsCard icon="currency_exchange" title="Tasa de Cambio" subtitle="Configuración de conversión USD → Bs">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Modo</label>
                        <div className="flex gap-2">
                            <button type="button"
                                onClick={() => handleChange('rate_mode', 'auto')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border ${local.rate_mode === 'auto'
                                    ? 'bg-brand-blue text-white border-brand-blue'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined text-[16px] align-middle mr-1">cloud_sync</span>
                                Automático (API)
                            </button>
                            <button type="button"
                                onClick={() => handleChange('rate_mode', 'manual')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border ${local.rate_mode === 'manual'
                                    ? 'bg-brand-blue text-white border-brand-blue'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined text-[16px] align-middle mr-1">edit</span>
                                Manual
                            </button>
                        </div>
                    </div>
                    {local.rate_mode === 'manual' && (
                        <SettingInput label="Tasa Manual (Bs por $)" value={local.manual_rate}
                            onChange={v => handleChange('manual_rate', parseFloat(v) || 0)} type="number" prefix="Bs" step="0.01" />
                    )}
                    {local.rate_mode === 'auto' && (
                        <SettingInput label="Cache de Tasa (horas)" value={local.rate_cache_hours}
                            onChange={v => handleChange('rate_cache_hours', parseInt(v) || 4)} type="number" suffix="hrs" />
                    )}
                    <SettingToggle label="Mostrar precios en Bs" value={local.show_bs}
                        onChange={v => handleChange('show_bs', v)} />
                    <p className="text-[10px] text-gray-400 leading-tight">
                        Automático: Google Script → pydolarve → rafnixg (3 APIs con fallback). Manual: usas la tasa que ingreses.
                    </p>
                </SettingsCard>
            </div>
        </div>
    );
}

/* === Sub-components === */

function SettingsCard({ icon, title, subtitle, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-blue text-[20px]">{icon}</span>
                    {title}
                </h3>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function SettingInput({ label, value, onChange, type, prefix, suffix, step, placeholder }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
            <div className="relative">
                {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">{prefix}</span>}
                <input type={type} step={step} value={value}
                    onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    className={`w-full ${prefix ? 'pl-9' : 'pl-4'} ${suffix ? 'pr-9' : 'pr-4'} py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-colors`} />
                {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">{suffix}</span>}
            </div>
        </div>
    );
}

function SettingToggle({ label, value, onChange }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-gray-700 font-medium">{label}</span>
            <button type="button" onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-brand-blue' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition-transform duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </label>
    );
}
