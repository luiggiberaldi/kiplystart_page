import { useState, useRef } from 'react';
import { uploadProductImage, deleteProductImage } from '../../lib/imageUpload';

/**
 * ProductImageManager - Upload images directly to Supabase Storage
 * Supports drag-and-drop, click-to-upload, and manual URL input
 */
export default function ProductImageManager({ mainImage, additionalImages, onMainChange, onAdditionalChange }) {
    const [uploading, setUploading] = useState(null); // 'main' | 0-3 index | null
    const [dragOver, setDragOver] = useState(null);   // 'main' | 0-3 index | null
    const [error, setError] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const mainFileRef = useRef(null);
    const additionalFileRefs = useRef([]);

    const handleUpload = async (file, target) => {
        if (!file) return;
        setError('');
        setUploading(target);

        try {
            const url = await uploadProductImage(file);
            if (target === 'main') {
                onMainChange(url);
            } else {
                onAdditionalChange(target, url);
            }
        } catch (err) {
            setError(err.message || 'Error al subir imagen');
        } finally {
            setUploading(null);
        }
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        setDragOver(null);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file, target);
        }
    };

    const handleFileSelect = (e, target) => {
        const file = e.target.files[0];
        if (file) handleUpload(file, target);
        e.target.value = ''; // Reset so same file can be re-selected
    };

    const handleRemoveImage = async (target) => {
        const url = target === 'main' ? mainImage : additionalImages[target];
        // Delete from storage
        await deleteProductImage(url);
        // Clear URL from form
        if (target === 'main') {
            onMainChange('');
        } else {
            onAdditionalChange(target, '');
        }
    };

    const ImageUploadSlot = ({ target, currentUrl, label, isMain = false }) => {
        const isUploading = uploading === target;
        const isDraggedOver = dragOver === target;
        const hasImage = currentUrl && currentUrl.trim() !== '';

        return (
            <div className="relative">
                {/* Label */}
                <label className="block text-xs font-bold text-gray-700 mb-1">
                    {label} {isMain && <span className="text-brand-red">*</span>}
                </label>

                {hasImage ? (
                    /* Image Preview */
                    <div className={`relative group rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 ${isMain ? 'h-48' : 'h-32'}`}>
                        <img
                            src={currentUrl}
                            alt={label}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                                e.target.src = '';
                                e.target.alt = 'Error cargando imagen';
                            }}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const ref = isMain ? mainFileRef : { current: additionalFileRefs.current[target] };
                                    ref.current?.click();
                                }}
                                className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                            >
                                📷 Cambiar
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(target)}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Upload Dropzone */
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(target); }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => handleDrop(e, target)}
                        onClick={() => {
                            const ref = isMain ? mainFileRef : { current: additionalFileRefs.current[target] };
                            ref.current?.click();
                        }}
                        className={`
                            cursor-pointer rounded-xl border-2 border-dashed transition-all
                            ${isMain ? 'h-48' : 'h-32'}
                            flex flex-col items-center justify-center gap-2
                            ${isDraggedOver
                                ? 'border-brand-blue bg-blue-50 scale-[1.02]'
                                : 'border-gray-300 bg-gray-50 hover:border-brand-blue hover:bg-blue-50/50'}
                            ${isUploading ? 'pointer-events-none opacity-70' : ''}
                        `}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-brand-blue font-bold">Subiendo...</span>
                            </>
                        ) : (
                            <>
                                <span className={`${isMain ? 'text-3xl' : 'text-2xl'}`}>
                                    {isDraggedOver ? '📥' : '📷'}
                                </span>
                                <span className="text-xs text-gray-500 text-center px-2">
                                    {isMain
                                        ? 'Arrastra una imagen aquí o haz clic para subir'
                                        : 'Clic o arrastra'
                                    }
                                </span>
                                <span className="text-[10px] text-gray-400">JPG, PNG, WebP · Max 5MB</span>
                            </>
                        )}
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    ref={(el) => {
                        if (isMain) mainFileRef.current = el;
                        else additionalFileRefs.current[target] = el;
                    }}
                    onChange={(e) => handleFileSelect(e, target)}
                    className="hidden"
                />
            </div>
        );
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="font-display font-bold text-lg text-brand-blue">Imágenes</h3>
                <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-xs text-gray-500 hover:text-brand-blue transition-colors"
                >
                    {showUrlInput ? '📷 Subir archivo' : '🔗 Pegar URL'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <span>⚠️</span> {error}
                    <button type="button" onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
            )}

            {showUrlInput ? (
                /* URL Input Mode (fallback) */
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Imagen Principal (URL) *</label>
                        <input
                            type="url"
                            value={mainImage}
                            onChange={(e) => onMainChange(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="https://..."
                        />
                    </div>
                    {mainImage && (
                        <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 p-2">
                            <img src={mainImage} alt="Preview" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Imágenes Adicionales (Opcional):</p>
                    <div className="grid grid-cols-2 gap-3">
                        {additionalImages.map((url, idx) => (
                            <input
                                key={idx}
                                type="url"
                                value={url}
                                onChange={(e) => onAdditionalChange(idx, e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                placeholder={`Imagen ${idx + 2}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                /* Upload Mode (default) */
                <div className="space-y-4">
                    {/* Main Image */}
                    <ImageUploadSlot
                        target="main"
                        currentUrl={mainImage}
                        label="Imagen Principal"
                        isMain={true}
                    />

                    {/* Additional Images */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">Imágenes Adicionales (Opcional):</p>
                        <div className="grid grid-cols-2 gap-3">
                            {additionalImages.map((url, idx) => (
                                <ImageUploadSlot
                                    key={idx}
                                    target={idx}
                                    currentUrl={url}
                                    label={`Imagen ${idx + 2}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
