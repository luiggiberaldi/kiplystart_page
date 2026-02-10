import { useEffect, useRef } from 'react';
import ProductForm from './ProductForm';

/**
 * ProductDrawer - Slide-in panel for product creation/editing
 * Replaces the old side-by-side layout with a full-screen overlay drawer
 */
export default function ProductDrawer({ isOpen, onClose, editingProduct, onSuccess }) {
    const drawerRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out"
                style={{ animation: 'slideInRight 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cerrar (Esc)"
                        >
                            <span className="material-symbols-outlined text-gray-500">close</span>
                        </button>
                        <div>
                            <h2 className="font-display font-bold text-lg text-soft-black">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            {editingProduct && (
                                <p className="text-xs text-gray-500 line-clamp-1">{editingProduct.name}</p>
                            )}
                        </div>
                    </div>
                    {editingProduct?.dropanas_url && (
                        <a href={editingProduct.dropanas_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-brand-blue hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            DroPanas
                        </a>
                    )}
                </div>

                {/* Form */}
                <div className="p-6">
                    <ProductForm
                        editingProduct={editingProduct}
                        onSuccess={async (data) => {
                            await onSuccess(data);
                            onClose();
                        }}
                        onCancel={onClose}
                    />
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </>
    );
}
