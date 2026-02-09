import { useState, useEffect } from 'react';
import ProductPricePreview from './ProductPricePreview';
import ProductImageManager from './ProductImageManager';
import ProductInventoryManager from './ProductInventoryManager';

/**
 * ProductForm Component
 * @description
 * Comprehensive product creation/editing form for admin portal.
 * Includes bundles, pricing, images, inventory management.
 */
export default function ProductForm({ onSuccess, editingProduct = null }) {
    const defaultState = {
        name: '',
        description: '',
        category: 'General',
        price: '',
        compare_at_price: '',
        bundle_2_discount: '10',
        bundle_3_discount: '20',
        image_url: '',
        additional_images: ['', '', '', ''],
        stock: '0',
        low_stock_threshold: '5',
        allow_backorders: false,
        is_active: true,
        featured: false,
        tags: ''
    };

    const [formData, setFormData] = useState(defaultState);

    // Sync state when editingProduct changes
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                ...defaultState,
                ...editingProduct,
                // Ensure arrays and special fields are correctly formatted
                additional_images: editingProduct.additional_images && editingProduct.additional_images.length > 0
                    ? [...editingProduct.additional_images, '', '', '', ''].slice(0, 4)
                    : ['', '', '', ''],
                tags: Array.isArray(editingProduct.tags)
                    ? editingProduct.tags.join(', ')
                    : editingProduct.tags || ''
            });
        } else {
            setFormData(defaultState);
        }
    }, [editingProduct]);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAdditionalImageChange = (index, value) => {
        const newImages = [...formData.additional_images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, additional_images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Transform data for Supabase
        const productData = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
            bundle_2_discount: parseInt(formData.bundle_2_discount),
            bundle_3_discount: parseInt(formData.bundle_3_discount),
            image_url: formData.image_url,
            additional_images: formData.additional_images.filter(url => url.trim() !== ''),
            stock: parseInt(formData.stock),
            low_stock_threshold: parseInt(formData.low_stock_threshold),
            allow_backorders: formData.allow_backorders,
            is_active: formData.is_active,
            featured: formData.featured,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
        };

        try {
            await onSuccess(productData);
            // Reset form if creating new
            if (!editingProduct) {
                setFormData({
                    name: '', description: '', category: 'General', price: '',
                    compare_at_price: '', bundle_2_discount: '10', bundle_3_discount: '20',
                    image_url: '', additional_images: ['', '', '', ''], stock: '0',
                    low_stock_threshold: '5', allow_backorders: false, is_active: true,
                    featured: false, tags: ''
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {/* Información Básica */}
            <section>
                <h3 className="font-display font-bold text-lg text-brand-blue mb-4 border-b pb-2">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Producto *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="Ej: SmartWatch Pro X"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                        >
                            <option>General</option>
                            <option>Electrónica</option>
                            <option>Accesorios</option>
                            <option>Hogar</option>
                            <option>Deportes</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="w-4 h-4 text-brand-blue rounded focus:ring-2 focus:ring-brand-blue"
                            />
                            <span className="text-sm font-medium text-gray-700">Activo</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-4 h-4 text-brand-blue rounded focus:ring-2 focus:ring-brand-blue"
                            />
                            <span className="text-sm font-medium text-gray-700">Destacado</span>
                        </label>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="Descripción detallada del producto..."
                        />
                    </div>
                </div>
            </section>

            {/* Precios y Bundles */}
            <section>
                <h3 className="font-display font-bold text-lg text-brand-blue mb-4 border-b pb-2">Precios y Ofertas</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Precio Base ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Precio de Comparación ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="compare_at_price"
                            value={formData.compare_at_price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="Antes: 0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Bundle 2x - Descuento (%)</label>
                        <input
                            type="number"
                            name="bundle_2_discount"
                            value={formData.bundle_2_discount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Bundle 3x - Descuento (%)</label>
                        <input
                            type="number"
                            name="bundle_3_discount"
                            value={formData.bundle_3_discount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <ProductPricePreview
                        basePrice={formData.price}
                        bundle2Discount={formData.bundle_2_discount}
                        bundle3Discount={formData.bundle_3_discount}
                    />
                </div>
            </section>

            {/* Imágenes */}
            <ProductImageManager
                mainImage={formData.image_url}
                additionalImages={formData.additional_images}
                onMainChange={(val) => setFormData(prev => ({ ...prev, image_url: val }))}
                onAdditionalChange={handleAdditionalImageChange}
            />

            {/* Inventario */}
            <ProductInventoryManager
                stock={formData.stock}
                lowStockThreshold={formData.low_stock_threshold}
                allowBackorders={formData.allow_backorders}
                onChange={handleChange}
            />

            {/* Tags */}
            <section>
                <h3 className="font-display font-bold text-lg text-brand-blue mb-4 border-b pb-2">Marketing</h3>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tags (separados por comas)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="reloj, smartwatch, electrónica"
                    />
                </div>
            </section>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-steel-blue hover:bg-opacity-90 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
                {loading ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
        </form>
    );
}
