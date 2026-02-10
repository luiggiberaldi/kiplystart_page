/**
 * CODField — Reusable input wrapper with icon, validation border & checkmark
 */
export default function CODField({
    label, icon, name, error, status,
    borderClass, children, optional = false
}) {
    return (
        <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {label} {optional && <span className="text-gray-300 normal-case">(Opcional)</span>}
            </label>
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${borderClass}`}>
                <span className="material-symbols-outlined text-gray-400 text-[18px]">{icon}</span>
                {children}
                {status === 'valid' && (
                    <span className="material-symbols-outlined text-green-500 text-[16px]">check</span>
                )}
            </div>
            {error && <p className="text-red-500 text-[10px] mt-1 ml-1">{error}</p>}
        </div>
    );
}
