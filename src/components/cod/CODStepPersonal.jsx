import CODField from './CODField';
import { User, CreditCard, Phone, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export default function CODStepPersonal({
    formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus,
    returning, onClearSaved, onContinue
}) {
    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Returning customer banner */}
            {returning && (
                <div className="flex items-center gap-2.5 bg-blue-50 text-[#0A2463] p-3 rounded-2xl border border-blue-200">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-extrabold truncate">¡Hola de nuevo, {formData.name.split(' ')[0]}!</p>
                        <p className="text-[10px] text-blue-600 font-medium">Tus datos están pre-completados</p>
                    </div>
                    <button onClick={onClearSaved} className="text-xs text-blue-700 hover:text-blue-900 font-bold underline shrink-0 cursor-pointer">
                        Cambiar
                    </button>
                </div>
            )}

            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <UserCheck className="w-4 h-4 text-[#0A2463]" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700">
                    Paso 1: Datos Personales
                </h4>
            </div>

            {/* Name */}
            <CODField label="Nombre y Apellido" icon={User} name="name"
                error={errors.name} status={getFieldStatus('name')} borderClass={fieldBorder('name')}>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent placeholder:text-gray-400"
                    placeholder="Ej: Pedro Pérez" />
            </CODField>

            {/* CI */}
            <CODField label="Cédula / Documento de Identidad" icon={CreditCard} name="ci"
                error={errors.ci} status={getFieldStatus('ci')} borderClass={fieldBorder('ci')}>
                <input type="text" name="ci" value={formData.ci} onChange={handleChange}
                    onBlur={() => handleBlur('ci')}
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent placeholder:text-gray-400"
                    placeholder="Ej: V-18456789" />
            </CODField>

            {/* Phone */}
            <CODField label="Teléfono Celular (WhatsApp)" icon={Phone} name="phone"
                error={errors.phone} status={getFieldStatus('phone')} borderClass={fieldBorder('phone')}>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className="flex-1 outline-none text-sm font-semibold text-gray-950 bg-transparent placeholder:text-gray-400"
                    placeholder="Ej: 04141234567" />
            </CODField>

            {/* CTA */}
            <div className="pt-2">
                <button type="button" onClick={onContinue}
                    className="w-full bg-[#0A2463] hover:bg-[#071630] text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-[#0A2463]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span>Continuar con la Entrega</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
