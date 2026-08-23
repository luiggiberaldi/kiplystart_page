import { Check } from 'lucide-react';

export default function CODField({
    label, icon: Icon, error, status,
    borderClass, children, optional = false
}) {
    return (
        <div>
            <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                {label} {optional && <span className="text-gray-400 font-normal normal-case">(Opcional)</span>}
            </label>
            <div className={`flex items-center gap-2.5 border-2 rounded-2xl px-3.5 py-3 bg-white transition-all shadow-xs ${borderClass}`}>
                {Icon && <Icon className="w-5 h-5 text-gray-400 shrink-0" />}
                {children}
                {status === 'valid' && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
            </div>
            {error && <p className="text-red-600 text-xs font-semibold mt-1 ml-1">{error}</p>}
        </div>
    );
}
