import CODField from './CODField';

/**
 * Step 1 — Personal data: name, CI, phone
 */
export default function CODStepPersonal({
    formData, errors, handleChange, handleBlur, fieldBorder, getFieldStatus,
    returning, onClearSaved, onContinue
}) {
    return (
        <div className="space-y-3.5 animate-fadeIn">

            {/* Returning customer banner */}
            {returning && (
                <div className="flex items-center gap-2 bg-blue-50 text-brand-blue p-3 rounded-xl border border-blue-100">
                    <span className="material-symbols-outlined text-[18px]">waving_hand</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">¡Hola de nuevo, {formData.name.split(' ')[0]}!</p>
                        <p className="text-[10px] text-blue-400">Tus datos están guardados</p>
                    </div>
                    <button onClick={onClearSaved} className="text-[10px] text-blue-400 hover:text-blue-600 underline shrink-0">
                        Cambiar
                    </button>
                </div>
            )}

            <h4 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-brand-blue text-[18px]">badge</span>
                Datos Personales
            </h4>

            {/* Name */}
            <CODField label="Nombre Completo" icon="person" name="name"
                error={errors.name} status={getFieldStatus('name')} borderClass={fieldBorder('name')}>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className="flex-1 outline-none text-sm bg-transparent"
                    placeholder="Pedro Pérez" />
            </CODField>

            {/* CI */}
            <CODField label="Cédula / ID" icon="id_card" name="ci"
                error={errors.ci} status={getFieldStatus('ci')} borderClass={fieldBorder('ci')}>
                <input type="text" name="ci" value={formData.ci} onChange={handleChange}
                    onBlur={() => handleBlur('ci')}
                    className="flex-1 outline-none text-sm bg-transparent"
                    placeholder="V-12345678" />
            </CODField>

            {/* Phone */}
            <CODField label="Teléfono (WhatsApp)" icon="phone_iphone" name="phone"
                error={errors.phone} status={getFieldStatus('phone')} borderClass={fieldBorder('phone')}>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className="flex-1 outline-none text-sm bg-transparent"
                    placeholder="04241234567" />
            </CODField>

            {/* CTA */}
            <div className="pt-2">
                <button type="button" onClick={onContinue}
                    className="w-full bg-brand-blue text-white font-display font-bold text-base py-3.5 rounded-xl shadow-lg shadow-brand-blue/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:brightness-110">
                    Continuar
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
