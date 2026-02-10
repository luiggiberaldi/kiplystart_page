import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCurrency } from '../context/CurrencyContext';
import { ZONES, getSavedCustomer, saveCustomer, clearSavedCustomer } from './cod/codData';
import CODProductSummary from './cod/CODProductSummary';
import CODStepPersonal from './cod/CODStepPersonal';
import CODStepDelivery from './cod/CODStepDelivery';
import CODSuccess from './cod/CODSuccess';

const EMPTY_FORM = { name: '', ci: '', phone: '', state: '', city: '', address: '', ref: '' };

/**
 * CODModal v2 — Stepper + Smart Autofill + Dual Currency
 * Orchestrator only — UI lives in sub-components under /cod
 */
export default function CODModal({ isOpen, onClose, product, quantity, totalPrice, selectedBundle }) {
    const { formatUSD, formatBs, exchangeRate } = useCurrency();

    const [step, setStep] = useState(1);
    const [returning, setReturning] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState(false);
    const formRef = useRef(null);

    /* ===== Lifecycle ===== */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const saved = getSavedCustomer();
            if (saved?.name) { setFormData(prev => ({ ...prev, ...saved })); setReturning(true); }
        } else {
            document.body.style.overflow = 'unset';
            setStep(1); setSuccess(false); setErrors({}); setTouched({});
        }
    }, [isOpen]);

    useEffect(() => () => { document.body.style.overflow = 'unset'; }, []);

    if (!isOpen) return null;

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
            const unitPrice = selectedBundle > 1 ? totalPrice / (quantity * selectedBundle) : totalPrice / quantity;

            const { data, error } = await supabase.from('orders').insert({
                order_id: orderId,
                user_name: formData.name,
                user_phone: formData.phone,
                user_ci: formData.ci,
                product_id: product.id,
                product_name: product.name,
                quantity,
                bundle_type: selectedBundle,
                unit_price: unitPrice,
                total_price: totalPrice,
                city: formData.city,
                state: formData.state,
                delivery_address: formData.address,
                delivery_ref: formData.ref || null,
                status: 'pending_whatsapp'
            }).select();

            if (error) console.error('Supabase error:', error);
            setSuccess(true);

            const displayId = data?.[0]?.order_id || orderId;
            const bundleText = selectedBundle > 1 ? `(Oferta ${selectedBundle} unidades)` : '';
            const bsLine = exchangeRate ? `\n💱 *En Bs:* ${formatBs(totalPrice)}` : '';

            const message =
                `Hola, deseo confirmar mi pedido en KiplyStart.\n\n` +
                `DETALLES DEL PEDIDO\n` +
                `ID: ${displayId}\n` +
                `Producto: ${product.name}\n` +
                `Cantidad: ${quantity} ${bundleText}\n` +
                `Total: ${formatUSD(totalPrice)}${bsLine}\n\n` +
                `DATOS DE ENVÍO\n` +
                `Nombre: ${formData.name}\n` +
                `CI: ${formData.ci}\n` +
                `Teléfono: ${formData.phone}\n` +
                `Dirección: ${formData.city}, ${formData.state}\n` +
                `Dirección exacta: ${formData.address}\n` +
                (formData.ref ? `Referencia: ${formData.ref}\n` : '') +
                `\nEspero su confirmación para el despacho.`;

            const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567';
            setTimeout(() => { window.location.href = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`; }, 1200);
        } catch (err) {
            console.error('Submission error:', err);
            setLoading(false); setSuccess(false);
        }
    }

    function clearSaved() {
        clearSavedCustomer();
        setFormData({ ...EMPTY_FORM });
        setReturning(false);
    }

    /* ===== Shared field props ===== */
    const fieldProps = { formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus };

    /* ===== Render ===== */
    if (success) return <CODSuccess />;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slideUp"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

                {/* Header + Stepper */}
                <div className="sticky top-0 bg-brand-blue text-white p-3 md:p-4 z-10 sm:rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-[20px] shrink-0">local_shipping</span>
                            <h3 className="font-display font-bold text-base truncate">Envío Rápido y Seguro</h3>
                        </div>
                        <button onClick={onClose} className="text-white/80 hover:text-white shrink-0 ml-2">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                        <StepPill active={step === 1} done={step > 1} icon={step > 1 ? 'check_circle' : 'person'} label="Tus datos" />
                        <div className={`h-[2px] flex-1 rounded ${step > 1 ? 'bg-white' : 'bg-white/20'}`} />
                        <StepPill active={step === 2} icon="location_on" label="Envío" />
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6">
                    <CODProductSummary product={product} quantity={quantity}
                        selectedBundle={selectedBundle} totalPrice={totalPrice} />

                    <form onSubmit={handleSubmit} ref={formRef}>
                        {step === 1 && (
                            <CODStepPersonal {...fieldProps}
                                returning={returning} onClearSaved={clearSaved} onContinue={goToStep2} />
                        )}
                        {step === 2 && (
                            <CODStepDelivery {...fieldProps}
                                loading={loading} onBack={() => { setStep(1); setErrors({}); }} />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ===== Tiny helper ===== */
function StepPill({ active, done, icon, label }) {
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors
            ${active ? 'bg-white text-brand-blue' : 'bg-white/20 text-white/70'}`}>
            <span className="material-symbols-outlined text-[14px]">{icon}</span>
            {label}
        </div>
    );
}
