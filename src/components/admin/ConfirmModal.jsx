import { useEffect, useRef } from 'react';

/**
 * ConfirmModal — Reusable modern confirmation dialog replacing native window.confirm.
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmColor = 'bg-red-600 hover:bg-red-700',
    icon = 'warning',
    iconBg = 'bg-red-100 text-red-600',
    loading = false,
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape' && isOpen && !loading) onClose();
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose, loading]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
                onClick={() => { if (!loading) onClose(); }} 
            />

            {/* Dialog Card */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 sm:p-7 animate-slideUp outline-none z-10 space-y-4"
            >
                {/* Icon */}
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-inner ${iconBg}`}>
                    {typeof icon === 'string' ? (
                        <span className="material-symbols-outlined text-[30px]">{icon}</span>
                    ) : (
                        icon
                    )}
                </div>

                {/* Content */}
                <div className="text-center space-y-1.5">
                    <h3 className="text-lg font-black text-gray-950 tracking-tight">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-2xl text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${confirmColor}`}
                    >
                        {loading && (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

