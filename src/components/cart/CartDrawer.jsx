import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { supabase } from '../../lib/supabaseClient';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import PriceDual from '../PriceDual';
import CODField from '../cod/CODField';
import { ZONES, getSavedCustomer, saveCustomer, clearSavedCustomer } from '../cod/codData';
import { trackInitiateCheckout, trackPurchase } from '../../lib/fbPixelEvents';

const EMPTY_FORM = { name: '', ci: '', phone: '', state: '', city: '', address: '', ref: '' };

export default function CartDrawer() {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateBundleSets,
        cartTotal,
        cartCount,
        getCartKey,
        clearCart
    } = useCart();

    const { formatUSD, formatBs, exchangeRate, showBs } = useCurrency();

    // COD Form state
    const [step, setStep] = useState(0); // 0=cart, 1=personal, 2=delivery
    const [returning, setReturning] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState(false);
    const formRef = useRef(null);

    // Reset form when drawer closes
    useEffect(() => {
        if (isCartOpen) {
            const saved = getSavedCustomer();
            if (saved?.name) {
                setFormData(prev => ({ ...prev, ...saved }));
                setReturning(true);
            }
        } else {
            setStep(0);
            setSuccess(false);
            setErrors({});
            setTouched({});
        }
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    /* ===== Field helpers ===== */
    const selectedZone = ZONES.find(z => z.state === formData.state);
    const deliveryTime = selectedZone?.delivery || '';

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'state') next.city = '';
            return next;
        });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }

    function handleBlur(name) { setTouched(prev => ({ ...prev, [name]: true })); }

    function getFieldStatus(name) {
        if (!touched[name] && !errors[name]) return 'idle';
        if (errors[name]) return 'error';
        const v = formData[name]?.trim();
        if (name === 'phone') return v && v.length >= 10 ? 'valid' : 'idle';
        return v ? 'valid' : 'idle';
    }

    function fieldBorder(name) {
        const s = getFieldStatus(name);
        if (s === 'error') return 'border-red-400 ring-2 ring-red-100';
        if (s === 'valid') return 'border-green-400 ring-2 ring-green-50';
        return 'border-gray-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-50';
    }

    /* ===== Validation ===== */
    function goToStep2() {
        const e = {};
        if (!formData.name.trim()) e.name = 'Requerido';
        if (!formData.ci.trim()) e.ci = 'Requerido';
        if (!formData.phone.trim()) e.phone = 'Requerido';
        else if (formData.phone.length < 10) e.phone = 'Verifica el número';
        setErrors(e);
        if (Object.keys(e).length === 0) { setErrors({}); setTouched({}); setStep(2); }
    }

    /* ===== Submit ===== */
    async function handleSubmit(e) {
        e.preventDefault();
        const err = {};
        if (!formData.state) err.state = 'Selecciona un estado';
        if (!formData.city) err.city = 'Selecciona una ciudad';
        if (!formData.address.trim()) err.address = 'La dirección es obligatoria';
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setLoading(true);
        try {
            saveCustomer(formData);

            // Generate order_id: KS-YYYYMMDD-XXXX
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
            const rand = Math.floor(1000 + Math.random() * 9000);
            const orderId = `KS-${datePart}-${rand}`;

            // Insert each cart item as a separate order row (same orderId groups them)
            for (const item of cartItems) {
                const sets = item.bundleSets || 1;
                const lineTotal = (item.bundleTotal || item.price) * sets;
                const unitPrice = item.price;

                await supabase.from('orders').insert({
                    order_id: orderId,
                    user_name: formData.name,
                    user_phone: formData.phone,
                    user_ci: formData.ci,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: (item.bundleSize || 1) * sets,
                    bundle_type: item.bundleSize || 1,
                    unit_price: unitPrice,
                    total_price: lineTotal,
                    city: formData.city,
                    state: formData.state,
                    delivery_address: formData.address,
                    delivery_ref: formData.ref || null,
                    status: 'pending_whatsapp'
                });
            }

            setSuccess(true);
            trackPurchase(orderId, cartItems, cartTotal);

            // Build WhatsApp message with all cart items
            const bsLine = exchangeRate ? `\n💱 *En Bs:* ${formatBs(cartTotal)}` : '';
            const itemsList = cartItems.map(item => {
                const sets = item.bundleSets || 1;
                const totalUnits = (item.bundleSize || 1) * sets;
                let bundleLabel;

                if (item.bundleType === 'quantity') {
                    const freeUnits = Math.floor(totalUnits / 3);
                    bundleLabel = freeUnits > 0
                        ? `${totalUnits}u (${freeUnits} Gratis)`
                        : `${totalUnits} Unidad${totalUnits > 1 ? 'es' : ''}`;
                } else {
                    if (item.bundleSize > 1) {
                        bundleLabel = `Pack ${item.bundleSize}u (-${item.discountPct}%)`;
                    } else if (item.discountPct > 0) {
                        bundleLabel = `${sets}u (-${item.discountPct}%)`;
                    } else {
                        bundleLabel = `${sets} Unidad${sets > 1 ? 'es' : ''}`;
                    }
                }
                const lineTotal = (item.bundleTotal || item.price) * sets;
                return `• ${item.name} — ${bundleLabel} — ${formatUSD(lineTotal)}`;
            }).join('\n');

            const message =
                `Hola, deseo confirmar mi pedido en KiplyStart.\n\n` +
                `DETALLES DEL PEDIDO\n` +
                `ID: ${orderId}\n` +
                `${itemsList}\n` +
                `Total: ${formatUSD(cartTotal)}${bsLine}\n\n` +
                `DATOS DE ENVÍO\n` +
                `Nombre: ${formData.name}\n` +
                `CI: ${formData.ci}\n` +
                `Teléfono: ${formData.phone}\n` +
                `Dirección: ${formData.city}, ${formData.state}\n` +
                `Dirección exacta: ${formData.address}\n` +
                (formData.ref ? `Referencia: ${formData.ref}\n` : '') +
                `\nEspero su confirmación para el despacho.`;

            const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567';
            setTimeout(() => {
                window.location.href = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
                clearCart();
            }, 1200);
        } catch (err) {
            console.error('Submission error:', err);
            setLoading(false);
            setSuccess(false);
        }
    }

    function clearSaved() {
        clearSavedCustomer();
        setFormData({ ...EMPTY_FORM });
        setReturning(false);
    }

    const fieldProps = { formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus };

    /* ===== Success overlay ===== */
    if (success) {
        return (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-scaleIn">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600 text-[40px] animate-checkmark">check_circle</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-brand-blue mb-2">¡Pedido Enviado!</h3>
                    <p className="text-sm text-gray-500">Redirigiendo a WhatsApp...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center sm:justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full sm:h-full shadow-2xl flex flex-col animate-slide-in-right sm:rounded-none">
                {/* Header */}
                <div className="p-3 md:p-4 border-b flex items-center justify-between bg-brand-blue text-white shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[20px] shrink-0">
                            {step === 0 ? 'shopping_bag' : 'local_shipping'}
                        </span>
                        <h2 className="text-base font-bold font-display truncate">
                            {step === 0 ? `Tu Carrito (${cartItems.length})` : 'Envío Rápido y Seguro'}
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0 ml-2"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Stepper indicator (only when in form steps) */}
                {step > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue/95 shrink-0">
                        <StepPill active={step === 1} done={step > 1} icon={step > 1 ? 'check_circle' : 'person'} label="Tus datos" />
                        <div className={`h-[2px] flex-1 rounded ${step > 1 ? 'bg-white' : 'bg-white/20'}`} />
                        <StepPill active={step === 2} icon="location_on" label="Envío" />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {step === 0 && (
                        /* ===== STEP 0: Cart Items ===== */
                        <div className="p-4 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                                    <ShoppingBag size={64} className="mb-4 text-gray-200" />
                                    <p className="text-lg font-medium">Tu carrito está vacío</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 text-brand-blue hover:underline"
                                    >
                                        Seguir comprando
                                    </button>
                                </div>
                            ) : (
                                cartItems.map(item => {
                                    const cartKey = getCartKey(item);
                                    const sets = item.bundleSets || 1;
                                    const totalUnits = (item.bundleSize || 1) * sets;
                                    const lineTotal = (item.bundleTotal || item.price) * sets;
                                    const hasDiscount = item.discountPct > 0;
                                    const isQuantityBundle = item.bundleType === 'quantity';
                                    const freeQuantityUnits = isQuantityBundle ? Math.floor(totalUnits / 3) : 0;
                                    const originalLineTotal = item.price * totalUnits;

                                    return (
                                        <div key={cartKey} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex gap-3">
                                                <div className="w-20 h-20 bg-white rounded-md overflow-hidden shrink-0 border border-gray-200">
                                                    <img
                                                        src={item.image_url || item.images?.[0]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div>
                                                        <h3 className="font-medium text-sm text-soft-black line-clamp-2 leading-tight">
                                                            {item.name}
                                                        </h3>
                                                        {isQuantityBundle ? (
                                                            freeQuantityUnits > 0 ? (
                                                                <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                                                                    {totalUnits}u · ¡{freeQuantityUnits} GRATIS! 🎁
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block mt-1 text-gray-500 text-[10px] font-medium">
                                                                    {totalUnits} Unidad{totalUnits > 1 ? 'es' : ''}
                                                                </span>
                                                            )
                                                        ) : hasDiscount ? (
                                                            <span className="inline-block mt-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                                {totalUnits}u · {item.discountPct}% OFF
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block mt-1 text-gray-500 text-[10px] font-medium">
                                                                {totalUnits > 1 ? `${totalUnits} Unidades` : '1 Unidad'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-end justify-between mt-2">
                                                        <div>
                                                            {hasDiscount && (
                                                                <span className="text-[11px] text-gray-400 line-through block">
                                                                    ${originalLineTotal.toFixed(2)}
                                                                </span>
                                                            )}
                                                            <span className="text-sm font-bold text-brand-blue">
                                                                ${lineTotal.toFixed(2)}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1">
                                                                <button
                                                                    onClick={() => updateBundleSets(cartKey, totalUnits - 1)}
                                                                    className="p-0.5 hover:bg-gray-100 rounded-full text-gray-500"
                                                                    disabled={totalUnits <= 1}
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="text-sm font-semibold w-4 text-center">{totalUnits}</span>
                                                                <button
                                                                    onClick={() => updateBundleSets(cartKey, totalUnits + 1)}
                                                                    className="p-0.5 hover:bg-gray-100 rounded-full text-brand-blue"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(cartKey)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                aria-label="Eliminar"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {step === 1 && (
                        /* ===== STEP 1: Personal Data ===== */
                        <div className="p-4 md:p-6">
                            {/* Cart summary compact */}
                            <CartSummaryCompact cartItems={cartItems} cartTotal={cartTotal}
                                formatUSD={formatUSD} formatBs={formatBs} showBs={showBs} exchangeRate={exchangeRate} />

                            <div className="space-y-3.5 animate-fadeIn">
                                {returning && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-brand-blue p-3 rounded-xl border border-blue-100">
                                        <span className="material-symbols-outlined text-[18px]">waving_hand</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">¡Hola de nuevo, {formData.name.split(' ')[0]}!</p>
                                            <p className="text-[10px] text-blue-400">Tus datos están guardados</p>
                                        </div>
                                        <button onClick={clearSaved} className="text-[10px] text-blue-400 hover:text-blue-600 underline shrink-0">
                                            Cambiar
                                        </button>
                                    </div>
                                )}

                                <h4 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-1">
                                    <span className="material-symbols-outlined text-brand-blue text-[18px]">badge</span>
                                    Datos Personales
                                </h4>

                                <CODField label="Nombre Completo" icon="person" name="name"
                                    error={errors.name} status={getFieldStatus('name')} borderClass={fieldBorder('name')}>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        className="flex-1 outline-none text-sm bg-transparent"
                                        placeholder="Pedro Pérez" />
                                </CODField>

                                <CODField label="Cédula / ID" icon="id_card" name="ci"
                                    error={errors.ci} status={getFieldStatus('ci')} borderClass={fieldBorder('ci')}>
                                    <input type="text" name="ci" value={formData.ci} onChange={handleChange}
                                        onBlur={() => handleBlur('ci')}
                                        className="flex-1 outline-none text-sm bg-transparent"
                                        placeholder="V-12345678" />
                                </CODField>

                                <CODField label="Teléfono (WhatsApp)" icon="phone_iphone" name="phone"
                                    error={errors.phone} status={getFieldStatus('phone')} borderClass={fieldBorder('phone')}>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        onBlur={() => handleBlur('phone')}
                                        className="flex-1 outline-none text-sm bg-transparent"
                                        placeholder="04241234567" />
                                </CODField>

                                <div className="pt-2">
                                    <button type="button" onClick={goToStep2}
                                        className="w-full bg-brand-blue text-white font-display font-bold text-base py-3.5 rounded-xl shadow-lg shadow-brand-blue/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:brightness-110">
                                        Continuar
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        /* ===== STEP 2: Delivery ===== */
                        <div className="p-4 md:p-6">
                            <CartSummaryCompact cartItems={cartItems} cartTotal={cartTotal}
                                formatUSD={formatUSD} formatBs={formatBs} showBs={showBs} exchangeRate={exchangeRate} />

                            <form onSubmit={handleSubmit} ref={formRef}>
                                <div className="space-y-3.5 animate-fadeIn">
                                    <button type="button" onClick={() => { setStep(1); setErrors({}); }}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue transition-colors -mt-1 mb-1">
                                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                        Volver
                                    </button>

                                    <h4 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-1">
                                        <span className="material-symbols-outlined text-brand-blue text-[18px]">location_on</span>
                                        Dirección de Envío
                                    </h4>

                                    <CODField label="Estado" icon="map" name="state"
                                        error={errors.state} status={getFieldStatus('state')} borderClass={fieldBorder('state')}>
                                        <select name="state" value={formData.state} onChange={handleChange}
                                            onBlur={() => handleBlur('state')}
                                            className="flex-1 outline-none text-sm bg-transparent appearance-none cursor-pointer">
                                            <option value="">Selecciona tu estado...</option>
                                            {ZONES.map(z => (
                                                <option key={z.state} value={z.state}>{z.state}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined text-gray-300 text-[18px]">expand_more</span>
                                    </CODField>

                                    {formData.state && (
                                        <div className="animate-fadeIn">
                                            <CODField label="Ciudad" icon="location_city" name="city"
                                                error={errors.city} status={getFieldStatus('city')} borderClass={fieldBorder('city')}>
                                                <select name="city" value={formData.city} onChange={handleChange}
                                                    onBlur={() => handleBlur('city')}
                                                    className="flex-1 outline-none text-sm bg-transparent appearance-none cursor-pointer">
                                                    <option value="">Selecciona tu ciudad...</option>
                                                    {(selectedZone?.cities || []).map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <span className="material-symbols-outlined text-gray-300 text-[18px]">expand_more</span>
                                            </CODField>
                                        </div>
                                    )}

                                    {deliveryTime && formData.city && (
                                        <div className="flex items-center gap-2 bg-green-50 text-green-700 p-2.5 rounded-xl border border-green-100 animate-fadeIn">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                                            <p className="text-xs font-medium">
                                                Entrega estimada: <strong>{deliveryTime}</strong>
                                            </p>
                                        </div>
                                    )}

                                    <CODField label="Dirección Exacta" icon="home" name="address"
                                        error={errors.address} status={getFieldStatus('address')} borderClass={fieldBorder('address')}>
                                        <textarea name="address" value={formData.address} onChange={handleChange}
                                            onBlur={() => handleBlur('address')} rows="2"
                                            className="flex-1 outline-none text-sm bg-transparent resize-none"
                                            placeholder="Av. Principal, Edif. Azul, Piso 2, Apto 2B" />
                                    </CODField>

                                    <CODField label="Punto de Referencia" icon="pin_drop" name="ref" optional
                                        borderClass="border-gray-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-50">
                                        <input type="text" name="ref" value={formData.ref} onChange={handleChange}
                                            className="flex-1 outline-none text-sm bg-transparent"
                                            placeholder="Frente a la panadería..." />
                                    </CODField>

                                    <div className="pt-2 pb-1">
                                        <button type="submit" disabled={loading}
                                            className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-display font-bold text-base py-3.5 rounded-xl shadow-lg shadow-green-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                            {loading ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <WhatsAppIcon />
                                                    Completar Pedido por WhatsApp
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-xs">lock</span>
                                            Tus datos están protegidos y encriptados
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer — only on cart view (step 0) with items */}
                {step === 0 && cartItems.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 font-medium">Total Estimado:</span>
                            <div className="text-right">
                                <span className="text-xl font-bold text-brand-blue block">
                                    ${cartTotal.toFixed(2)}
                                </span>
                                {showBs && exchangeRate && (
                                    <span className="text-[11px] text-gray-400 font-mono block">{formatBs(cartTotal)}</span>
                                )}
                                <span className="text-xs text-gray-500">Envío Gratis</span>
                            </div>
                        </div>
                        <button
                            onClick={() => { trackInitiateCheckout(cartItems, cartTotal); setStep(1); }}
                            className="w-full bg-brand-blue hover:brightness-110 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-blue/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[15px]"
                        >
                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                            <span>Completar Pedido</span>
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-2">
                            ✓ Pago contra entrega · Envío gratis
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ===== Tiny helpers ===== */

function StepPill({ active, done, icon, label }) {
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors
            ${active ? 'bg-white text-brand-blue' : 'bg-white/20 text-white/70'}`}>
            <span className="material-symbols-outlined text-[14px]">{icon}</span>
            {label}
        </div>
    );
}

function CartSummaryCompact({ cartItems, cartTotal, formatUSD, formatBs, showBs, exchangeRate }) {
    return (
        <div className="mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100">
            {cartItems.map((item, idx) => {
                const sets = item.bundleSets || 1;
                const totalUnits = (item.bundleSize || 1) * sets;
                const lineTotal = (item.bundleTotal || item.price) * sets;
                const isQuantityBundle = item.bundleType === 'quantity';
                const freeUnits = isQuantityBundle ? Math.floor(totalUnits / 3) : 0;

                return (
                    <div key={idx} className={`flex gap-3 ${idx > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 p-0.5 shrink-0">
                            <img src={item.image_url || item.images?.[0]} alt={item.name}
                                className="w-full h-full object-contain rounded" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-brand-blue truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500">
                                {isQuantityBundle && freeUnits > 0 ? (
                                    <span className="text-purple-600 font-bold">
                                        {totalUnits}u (¡{freeUnits} Gratis!)
                                    </span>
                                ) : (
                                    <>
                                        Cantidad: {totalUnits}
                                        {item.bundleSize > 1 && ` (${item.bundleSize}x)`}
                                    </>
                                )}
                            </p>
                            <span className="font-bold text-brand-red text-sm">{formatUSD(lineTotal)}</span>
                        </div>
                    </div>
                );
            })}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-600">Total:</span>
                <div className="text-right">
                    <span className="font-bold text-brand-red text-lg">{formatUSD(cartTotal)}</span>
                    {showBs && exchangeRate && (
                        <span className="text-[10px] text-gray-400 font-mono ml-2">{formatBs(cartTotal)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.4 0-4.612-.812-6.383-2.175l-.447-.355-3.102 1.04 1.04-3.102-.355-.447A9.943 9.943 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
);
