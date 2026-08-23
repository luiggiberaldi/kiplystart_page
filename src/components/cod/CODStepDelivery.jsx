import CODField from './CODField';
import CustomSelect from './CustomSelect';
import { ZONES } from './codData';
import { ArrowLeft, MapPin, Building2, Home, Navigation, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CODStepDelivery({
    formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus,
    loading, onBack, children
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

            {/* Quick City Shortcuts */}
            <div className="space-y-1.5 pb-1">
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Atajos Rápidos:</span>
                <div className="flex flex-wrap gap-1.5">
                    {[
                        { label: '⚡ Caracas Express (60 min)', state: 'Distrito Capital', city: 'Caracas' },
                        { label: 'Valencia', state: 'Carabobo', city: 'Valencia' },
                        { label: 'Maracay', state: 'Aragua', city: 'Maracay' },
                        { label: 'Barquisimeto', state: 'Lara', city: 'Barquisimeto' },
                        { label: 'Maracaibo', state: 'Zulia', city: 'Maracaibo' },
                    ].map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                handleChange({ target: { name: 'state', value: item.state } });
                                handleChange({ target: { name: 'city', value: item.city } });
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                formData.state === item.state && formData.city === item.city
                                    ? 'bg-[#0A2463] text-white border-[#0A2463] shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border-slate-200'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* State */}
            <CODField label="Estado" icon={MapPin} name="state"
                error={errors.state} status={getFieldStatus('state')} borderClass={fieldBorder('state')}>
                <CustomSelect 
                    name="state" 
                    value={formData.state} 
                    onChange={(e) => {
                        handleChange(e);
                        handleChange({ target: { name: 'city', value: '' } });
                    }}
                    onBlur={() => handleBlur('state')}
                    options={ZONES.map(z => z.state)}
                    placeholder="Selecciona tu estado..."
                />
            </CODField>

            {/* City (dynamic) */}
            {formData.state && (
                <div className="animate-fadeIn">
                    <CODField label="Ciudad / Municipio" icon={Building2} name="city"
                        error={errors.city} status={getFieldStatus('city')} borderClass={fieldBorder('city')}>
                        <CustomSelect 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange}
                            onBlur={() => handleBlur('city')}
                            options={cities}
                            placeholder="Selecciona tu ciudad..."
                        />
                    </CODField>
                </div>
            )}

            {/* Delivery time indicator & coverage type */}
            {deliveryTime && formData.city && (
                <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <p className="text-xs font-semibold">
                            Modalidad: <strong className="font-extrabold">{deliveryTime}</strong>
                        </p>
                    </div>
                </div>
            )}

            {/* Address */}
            <CODField label="Dirección de Entrega o Agencia Tealca" icon={Home} name="address"
                error={errors.address} status={getFieldStatus('address')} borderClass={fieldBorder('address')}>
                <textarea name="address" value={formData.address} onChange={handleChange}
                    onBlur={() => handleBlur('address')} rows="2"
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent resize-none placeholder:text-gray-400"
                    placeholder="Calle, Edificio / Casa, Número o Agencia Tealca de tu preferencia..." />
            </CODField>

            {/* Reference */}
            <CODField label="Punto de Referencia" icon={Navigation} name="ref" optional
                borderClass="border-gray-200 focus-within:border-[#0A2463] focus-within:ring-2 focus-within:ring-blue-50">
                <input type="text" name="ref" value={formData.ref} onChange={handleChange}
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent placeholder:text-gray-400"
                    placeholder="Ej: Frente a la farmacia, casa rejas blancas..." />
            </CODField>

            {/* Order Bump Slot */}
            {children}

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
