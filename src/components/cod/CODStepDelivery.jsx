import CODField from './CODField';
import { ZONES } from './codData';
import { ArrowLeft, MapPin, Building2, Home, Navigation, ChevronDown, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CODStepDelivery({
    formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus,
    loading, onBack
}) {
    const selectedZone = ZONES.find(z => z.state === formData.state);
    const cities = selectedZone?.cities || [];
    const deliveryTime = selectedZone?.delivery || '';

    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Back Button */}
            <button type="button" onClick={onBack}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0A2463] transition-colors cursor-pointer -mt-1 mb-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al paso 1</span>
            </button>

            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700">
                    Paso 2: Dirección y Destino
                </h4>
            </div>

            {/* State */}
            <CODField label="Estado" icon={MapPin} name="state"
                error={errors.state} status={getFieldStatus('state')} borderClass={fieldBorder('state')}>
                <select name="state" value={formData.state} onChange={handleChange}
                    onBlur={() => handleBlur('state')}
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent appearance-none cursor-pointer">
                    <option value="">Selecciona tu estado...</option>
                    {ZONES.map(z => (
                        <option key={z.state} value={z.state}>{z.state}</option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none" />
            </CODField>

            {/* City (dynamic) */}
            {formData.state && (
                <div className="animate-fadeIn">
                    <CODField label="Ciudad / Municipio" icon={Building2} name="city"
                        error={errors.city} status={getFieldStatus('city')} borderClass={fieldBorder('city')}>
                        <select name="city" value={formData.city} onChange={handleChange}
                            onBlur={() => handleBlur('city')}
                            className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent appearance-none cursor-pointer">
                            <option value="">Selecciona tu ciudad...</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none" />
                    </CODField>
                </div>
            )}

            {/* Delivery time indicator */}
            {deliveryTime && formData.city && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200 animate-fadeIn">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs font-semibold">
                        Tiempo estimado de entrega: <strong className="font-extrabold">{deliveryTime}</strong>
                    </p>
                </div>
            )}

            {/* Address */}
            <CODField label="Dirección Exacta de Entrega" icon={Home} name="address"
                error={errors.address} status={getFieldStatus('address')} borderClass={fieldBorder('address')}>
                <textarea name="address" value={formData.address} onChange={handleChange}
                    onBlur={() => handleBlur('address')} rows="2"
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent resize-none placeholder:text-gray-400"
                    placeholder="Calle, Edificio / Casa, Número, Apto..." />
            </CODField>

            {/* Reference */}
            <CODField label="Punto de Referencia" icon={Navigation} name="ref" optional
                borderClass="border-gray-200 focus-within:border-[#0A2463] focus-within:ring-2 focus-within:ring-blue-50">
                <input type="text" name="ref" value={formData.ref} onChange={handleChange}
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent placeholder:text-gray-400"
                    placeholder="Ej: Frente a la farmacia, casa rejas blancas..." />
            </CODField>

            {/* Submit CTA */}
            <div className="pt-2 pb-1">
                <button type="submit" disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Procesando Despacho...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>CONFIRMAR PEDIDO · PAGAS AL RECIBIR</span>
                        </>
                    )}
                </button>
                <div className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Pago 100% Contra Entrega · Revisas al recibir</span>
                </div>
            </div>
        </div>
    );
}
