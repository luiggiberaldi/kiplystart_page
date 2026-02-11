import { useEffect, useRef } from 'react';

/**
 * ConfirmModal — reusable confirmation dialog replacing window.confirm.
 * 
 * @param {boolean} isOpen - Whether modal is visible
 * @param {Function} onClose - Called when user cancels
 * @param {Function} onConfirm - Called when user confirms
 * @param {string} title - Modal title
 * @param {string} message - Description text
 * @param {string} confirmText - Confirm button label (default: "Eliminar")
 * @param {string} confirmColor - Tailwind bg color for confirm button (default: red)
 * @param {string} icon - Material icon name
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Eliminar',
    confirmColor = 'bg-red-600 hover:bg-red-700',
    icon = 'warning',
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape' && isOpen) onClose();
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Dialog */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slideUp outline-none"
            >
                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-600 text-[28px]">{icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{title}</h3>
                <p className="text-sm text-gray-500 text-center mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-colors shadow-lg ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
