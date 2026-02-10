import { useState, useEffect, useMemo } from 'react';
import ProductImageManager from './ProductImageManager';
import ProductFormPricing from './ProductFormPricing';
import ProductFormDropanas from './ProductFormDropanas';
import ProductFormTags from './ProductFormTags';

/**
 * ProductForm v2.0 - Orchestrator
 * Delegates UI to sub-components, handles state + submit logic.
 */
export default function ProductForm({ onSuccess, editingProduct = null, onCancel }) {
    const defaultState = {
        name: '', description: '', category: 'General',
        dropanas_price: '', precio_sugerido: '',
        price: '', compare_at_price: '', price_override: false,
        bundle_2_discount: '10', bundle_3_discount: '20',
        image_url: '', additional_images: ['', '', '', ''],
        stock: '0', is_active: true, featured: false,
        tags: '', dropanas_url: '',
    };

    const [formData, setFormData] = useState(defaultState);
    const [loading, setLoading] = useState(false);

    const categories = ['General', 'Electrónica', 'Accesorios', 'Hogar', 'Deportes', 'Belleza', 'Moda', 'Tecnología'];

    // === Auto-calculation ===
    const calculatedPrice = useMemo(() => {
        const dp = parseFloat(formData.dropanas_price) || 0;
        const sg = parseFloat(formData.precio_sugerido) || 0;
        if (dp === 0 && sg === 0) return 0;
        return Math.ceil(Math.max(dp + 14, sg));
    }, [formData.dropanas_price, formData.precio_sugerido]);

    const calculatedCompareAt = useMemo(() => {
        const p = formData.price_override ? parseFloat(formData.price) || 0 : calculatedPrice;
        if (p === 0) return '';
        return (Math.floor(p * 1.4)) + '.90';
    }, [calculatedPrice, formData.price, formData.price_override]);

    const effectivePrice = formData.price_override ? (parseFloat(formData.price) || 0) : calculatedPrice;

    // Sync editing state
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                ...defaultState, ...editingProduct,
                dropanas_price: editingProduct.dropanas_price || '',
                precio_sugerido: editingProduct.precio_sugerido || '',
                price_override: false,
                additional_images: editingProduct.additional_images?.length > 0
                    ? [...editingProduct.additional_images, '', '', '', ''].slice(0, 4) : ['', '', '', ''],
                tags: Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : editingProduct.tags || '',
                dropanas_url: editingProduct.dropanas_url || '',
            });
        } else {
            setFormData(defaultState);
        }
    }, [editingProduct]);

    // Auto-update price
    useEffect(() => {
        if (!formData.price_override && calculatedPrice > 0) {
            setFormData(prev => ({ ...prev, price: calculatedPrice.toString(), compare_at_price: calculatedCompareAt }));
        }
    }, [calculatedPrice, calculatedCompareAt, formData.price_override]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSuccess({
                name: formData.name, description: formData.description, category: formData.category,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                dropanas_price: formData.dropanas_price ? parseFloat(formData.dropanas_price) : null,
                dropanas_url: formData.dropanas_url || null,
                bundle_2_discount: parseInt(formData.bundle_2_discount),
                bundle_3_discount: parseInt(formData.bundle_3_discount),
                image_url: formData.image_url,
                additional_images: formData.additional_images.filter(url => url.trim() !== ''),
                stock: parseInt(formData.stock), is_active: formData.is_active, featured: formData.featured,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
            });
            if (!editingProduct) setFormData(defaultState);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Básica */}
            <section className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
                <h3 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    Información Básica
                </h3>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nombre del Producto *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                        placeholder="Ej: SmartWatch Pro X" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Categoría</label>
                        <select name="category" value={formData.category} onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-blue outline-none text-sm">
                            {categories.map(cat => <option key={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end gap-4 pb-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 text-brand-blue rounded" />
                            <span className="text-xs font-medium text-gray-600">Activo</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-brand-blue rounded" />
                            <span className="text-xs font-medium text-gray-600">Destacado</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Descripción</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                        placeholder="Descripción detallada del producto..." />
                </div>
            </section>

            {/* Precios */}
            <ProductFormPricing formData={formData} onChange={handleChange}
                calculatedPrice={calculatedPrice} calculatedCompareAt={calculatedCompareAt} effectivePrice={effectivePrice} />

            {/* Imágenes */}
            <section className="bg-white rounded-xl p-5 border border-gray-200">
                <ProductImageManager mainImage={formData.image_url} additionalImages={formData.additional_images}
                    onMainChange={(val) => setFormData(prev => ({ ...prev, image_url: val }))}
                    onAdditionalChange={(i, v) => { const imgs = [...formData.additional_images]; imgs[i] = v; setFormData(prev => ({ ...prev, additional_images: imgs })); }} />
            </section>

            {/* DroPanas & Stock */}
            <ProductFormDropanas formData={formData} onChange={handleChange} />

            {/* Tags */}
            <ProductFormTags tags={formData.tags} onTagsChange={(t) => setFormData(prev => ({ ...prev, tags: t }))} />

            {/* Submit */}
            <div className="flex gap-3">
                {onCancel && (
                    <button type="button" onClick={onCancel}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm">
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={loading}
                    className="flex-1 py-3 bg-[#E63946] hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 text-sm shadow-lg shadow-red-500/20 disabled:opacity-50">
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">{editingProduct ? 'save' : 'add'}</span>
                            {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
