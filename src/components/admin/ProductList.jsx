import { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * ProductList Component
 * @description
 * Interactive table for managing products with filters and actions.
 */
export default function ProductList({ products, onEdit, onDelete, onRefresh, onToggleStatus }) {
    const { formatPrice } = useCurrency();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filtering logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && product.is_active) ||
            (filterStatus === 'inactive' && !product.is_active) ||
            (filterStatus === 'low_stock' && product.stock <= product.low_stock_threshold);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const categories = ['all', ...new Set(products.map(p => p.category || 'General'))];

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                </div>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat === 'all' ? 'Todas las categorías' : cat}
                        </option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="low_stock">Stock Bajo</option>
                </select>

                <button
                    onClick={onRefresh}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Actualizar
                </button>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600">
                Mostrando {filteredProducts.length} de {products.length} productos
            </p>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4">Bundles</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No se encontraron productos
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white border border-gray-200 rounded-md p-1 flex-shrink-0">
                                                    <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-soft-black line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                    {product.featured && (
                                                        <span className="inline-block mt-1 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                                                            DESTACADO
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                                {product.sku || 'N/A'}
                                            </code>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-bold text-gray-700">{formatPrice(product.price)}</p>
                                                {product.compare_at_price && (
                                                    <p className="text-xs text-gray-400 line-through">
                                                        {formatPrice(product.compare_at_price)}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 min-w-[140px]">
                                            <div className="text-xs space-y-1.5">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-gray-500 w-5">2x:</span>
                                                    <span className="font-bold text-brand-blue">
                                                        {formatPrice(product.price * 2 * (1 - (product.bundle_2_discount || 10) / 100))}
                                                    </span>
                                                    <span className="text-green-600 text-[10px]">(-{product.bundle_2_discount || 10}%)</span>
                                                </div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-gray-500 w-5">3x:</span>
                                                    <span className="font-bold text-brand-blue">
                                                        {formatPrice(product.price * 3 * (1 - (product.bundle_3_discount || 20) / 100))}
                                                    </span>
                                                    <span className="text-green-600 text-[10px]">(-{product.bundle_3_discount || 20}%)</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center min-w-[100px]">
                                            <div className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-bold border ${product.stock === 0
                                                ? 'bg-gray-50 border-gray-200 text-gray-400'
                                                : product.stock <= (product.low_stock_threshold || 5)
                                                    ? 'bg-red-50 border-red-200 text-red-600'
                                                    : 'bg-green-50 border-green-200 text-green-600'
                                                }`}>
                                                {product.stock} un.
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.is_active
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {product.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => onToggleStatus(product)}
                                                    className={`${product.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'} p-2 rounded-lg transition-colors`}
                                                    title={product.is_active ? "Desactivar" : "Activar"}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {product.is_active ? 'visibility' : 'visibility_off'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="text-steel-blue hover:text-brand-blue p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => onDelete(product.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
