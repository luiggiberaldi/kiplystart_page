import CODField from './CODField';
import { ZONES } from './codData';

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.4 0-4.612-.812-6.383-2.175l-.447-.355-3.102 1.04 1.04-3.102-.355-.447A9.943 9.943 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
);

/**
 * Step 2 — Delivery: state, city (dynamic), address, reference
 */
export default function CODStepDelivery({
    formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus,
    loading, onBack
}) {
    const selectedZone = ZONES.find(z => z.state === formData.state);
    const cities = selectedZone?.cities || [];
    const deliveryTime = selectedZone?.delivery || '';

    return (
        <div className="space-y-3.5 animate-fadeIn">
            {/* Back */}
            <button type="button" onClick={onBack}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue transition-colors -mt-1 mb-1">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Volver
            </button>

            <h4 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-brand-blue text-[18px]">location_on</span>
                Dirección de Envío
            </h4>

            {/* State */}
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

            {/* City (dynamic) */}
            {formData.state && (
                <div className="animate-fadeIn">
                    <CODField label="Ciudad" icon="location_city" name="city"
                        error={errors.city} status={getFieldStatus('city')} borderClass={fieldBorder('city')}>
                        <select name="city" value={formData.city} onChange={handleChange}
                            onBlur={() => handleBlur('city')}
                            className="flex-1 outline-none text-sm bg-transparent appearance-none cursor-pointer">
                            <option value="">Selecciona tu ciudad...</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined text-gray-300 text-[18px]">expand_more</span>
                    </CODField>
                </div>
            )}

            {/* Delivery time indicator */}
            {deliveryTime && formData.city && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-2.5 rounded-xl border border-green-100 animate-fadeIn">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <p className="text-xs font-medium">
                        Entrega estimada: <strong>{deliveryTime}</strong>
                    </p>
                </div>
            )}

            {/* Address */}
            <CODField label="Dirección Exacta" icon="home" name="address"
                error={errors.address} status={getFieldStatus('address')} borderClass={fieldBorder('address')}>
                <textarea name="address" value={formData.address} onChange={handleChange}
                    onBlur={() => handleBlur('address')} rows="2"
                    className="flex-1 outline-none text-sm bg-transparent resize-none"
                    placeholder="Av. Principal, Edif. Azul, Piso 2, Apto 2B" />
            </CODField>

            {/* Reference */}
            <CODField label="Punto de Referencia" icon="pin_drop" name="ref" optional
                borderClass="border-gray-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-50">
                <input type="text" name="ref" value={formData.ref} onChange={handleChange}
                    className="flex-1 outline-none text-sm bg-transparent"
                    placeholder="Frente a la panadería..." />
            </CODField>

            {/* Submit CTA */}
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
    );
}
