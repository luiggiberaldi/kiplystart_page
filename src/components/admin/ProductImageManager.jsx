import React from 'react';

export default function ProductImageManager({ mainImage, additionalImages, onMainChange, onAdditionalChange }) {
    return (
        <section>
            <h3 className="font-display font-bold text-lg text-brand-blue mb-4 border-b pb-2">Imágenes</h3>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Imagen Principal (URL) *</label>
                    <input
                        type="url"
                        name="image_url"
                        value={mainImage}
                        onChange={(e) => onMainChange(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="https://..."
                    />
                </div>

                {mainImage && (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 p-2">
                        <img
                            src={mainImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                        />
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
        </section>
    );
}
