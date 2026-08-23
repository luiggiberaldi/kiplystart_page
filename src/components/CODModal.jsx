import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCurrency } from '../context/CurrencyContext';
import { getSavedCustomer, saveCustomer, clearSavedCustomer } from './cod/codData';
import CODProductSummary from './cod/CODProductSummary';
import CODStepPersonal from './cod/CODStepPersonal';
import CODStepDelivery from './cod/CODStepDelivery';
import CODSuccess from './cod/CODSuccess';
import { trackInitiateCheckout, trackPurchase } from '../lib/fbPixelEvents';
import { Truck, X, User, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

const EMPTY_FORM = { name: '', ci: '', phone: '', state: '', city: '', address: '', ref: '' };

export default function CODModal({ isOpen, onClose, product, quantity, totalPrice, selectedBundle }) {
    const { formatUSD, formatBs, exchangeRate } = useCurrency();

    const [step, setStep] = useState(1);
    const [returning, setReturning] = useState(() => !!getSavedCustomer()?.name);
    const [formData, setFormData] = useState(() => {
        const saved = getSavedCustomer();
        if (saved?.name) return { ...EMPTY_FORM, ...saved };
        try {
            const draft = sessionStorage.getItem('cod_form_draft');
            if (draft) return JSON.parse(draft);
        } catch {}
        return { ...EMPTY_FORM };
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState(false);
    const [registeredOrderId, setRegisteredOrderId] = useState(null);
    const formRef = useRef(null);

    /* ===== Lifecycle & Tracking ===== */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (product) {
                trackInitiateCheckout([{ id: product.id, name: product.name, price: totalPrice }], totalPrice);
            }
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, product, totalPrice]);

    useEffect(() => () => { document.body.style.overflow = 'unset'; }, []);

    if (!isOpen) return null;

    /* ===== Field helpers ===== */
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'state') next.city = '';
            try { sessionStorage.setItem('cod_form_draft', JSON.stringify(next)); } catch {}
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
        if (s === 'valid') return 'border-emerald-500 ring-2 ring-emerald-50';
        return 'border-gray-300 focus-within:border-[#0A2463] focus-within:ring-2 focus-within:ring-blue-100';
    }

    /* ===== Validation ===== */
    function goToStep2() {
        const e = {};
        if (!formData.name.trim()) e.name = 'Ingresa tu nombre y apellido';
        if (!formData.ci.trim()) e.ci = 'Ingresa tu número de cédula o ID';
        if (!formData.phone.trim()) e.phone = 'Ingresa tu teléfono de WhatsApp';
        else if (formData.phone.length < 10) e.phone = 'Verifica tu número (mínimo 10 dígitos)';
        setErrors(e);
        if (Object.keys(e).length === 0) { setErrors({}); setTouched({}); setStep(2); }
    }

    /* ===== Submit ===== */
    async function handleSubmit(e) {
        e.preventDefault();
        const err = {};
        if (!formData.state) err.state = 'Selecciona tu estado';
        if (!formData.city) err.city = 'Selecciona tu ciudad';
        if (!formData.address.trim()) err.address = 'Ingresa tu dirección exacta de entrega';
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setLoading(true);
        try {
            saveCustomer(formData);

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

            if (error) console.error('Supabase order insert error:', error);

            const displayId = data?.[0]?.order_id || orderId;
            setRegisteredOrderId(displayId);
            trackPurchase(displayId, [{ id: product.id, name: product.name, price: totalPrice }], totalPrice);
            try { sessionStorage.removeItem('cod_form_draft'); } catch {}
            setSuccess(true);
        } catch (err) {
            console.error('Submission error:', err);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    function clearSaved() {
        clearSavedCustomer();
        setFormData({ ...EMPTY_FORM });
        setReturning(false);
    }

    const fieldProps = { formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus };

    if (success) {
        return (
            <CODSuccess 
                orderId={registeredOrderId}
                customerName={formData.name}
                customerPhone={formData.phone}
                productName={product.name}
                totalPrice={totalPrice}
                onClose={() => {
                    setSuccess(false);
                    onClose();
                }}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slideUp border border-gray-100"
                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>

                {/* Header + Stepper */}
                <div className="sticky top-0 bg-[#0A2463] text-white p-4 sm:p-5 z-10 rounded-t-3xl sm:rounded-t-3xl shadow-md">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-base tracking-tight truncate">Envío Rápido y Seguro</h3>
                                <p className="text-[11px] text-white/70">Pago Contra Entrega · Tasa Oficial BCV</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" aria-label="Cerrar modal">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            step === 1 ? 'bg-white text-[#0A2463] shadow-md' : 'bg-white/15 text-white'
                        }`}>
                            {step > 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <User className="w-3.5 h-3.5" />}
                            <span>1. Tus Datos</span>
                        </div>
                        <div className={`h-[2px] flex-1 rounded-full ${step > 1 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            step === 2 ? 'bg-white text-[#0A2463] shadow-md' : 'bg-white/15 text-white/70'
                        }`}>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>2. Destino</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6">
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
