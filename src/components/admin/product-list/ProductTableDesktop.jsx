/**
 * ProductTableDesktop
 * Renders the full product table for desktop/tablet view.
 */
export default function ProductTableDesktop({
    products,
    totalCount,
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    selectedIds,
    allSelected,
    onToggleSelect,
    onToggleSelectAll,
    sortBy,
    sortDir,
    onSort,
    onEdit,
    onDelete,
    onToggleStatus,
    onClone,
    formatPrice,
    productSlug
}) {

    const SortIcon = ({ col }) => {
        if (sortBy !== col) return <span className="material-symbols-outlined text-[14px] text-gray-300">unfold_more</span>;
        return <span className="material-symbols-outlined text-[14px] text-brand-blue">{sortDir === 'asc' ? 'expand_less' : 'expand_more'}</span>;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 text-[10px] uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-3 w-10">
                                <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll}
                                    className="w-3.5 h-3.5 text-brand-blue rounded cursor-pointer" />
                            </th>
                            <th className="p-3 cursor-pointer select-none" onClick={() => onSort('name')}>
                                <span className="flex items-center gap-1">Producto <SortIcon col="name" /></span>
                            </th>
                            <th className="p-3 cursor-pointer select-none" onClick={() => onSort('price')}>
                                <span className="flex items-center gap-1">Precio <SortIcon col="price" /></span>
                            </th>
                            <th className="p-3 cursor-pointer select-none" onClick={() => onSort('margin')}>
                                <span className="flex items-center gap-1">DroPanas <SortIcon col="margin" /></span>
                            </th>
                            <th className="p-3">Bundles</th>
                            <th className="p-3 cursor-pointer select-none" onClick={() => onSort('stock')}>
                                <span className="flex items-center gap-1">Stock <SortIcon col="stock" /></span>
                            </th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-gray-400 text-sm">
                                    <span className="material-symbols-outlined text-[48px] mb-2 block text-gray-200">inventory_2</span>
                                    No se encontraron productos
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const margin = product.dropanas_price
                                    ? { amount: product.price - product.dropanas_price, pct: (((product.price - product.dropanas_price) / product.price) * 100).toFixed(0) }
                                    : null;

                                return (
                                    <tr key={product.id}
                                        className={`hover:bg-blue-50/30 transition-colors ${selectedIds.has(product.id) ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-3">
                                            <input type="checkbox" checked={selectedIds.has(product.id)}
                                                onChange={() => onToggleSelect(product.id)}
                                                className="w-3.5 h-3.5 text-brand-blue rounded cursor-pointer" />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg p-0.5 flex-shrink-0 overflow-hidden">
                                                    <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm text-soft-black line-clamp-1">{product.name}</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-gray-400">{product.category}</span>
                                                        {product.featured && (
                                                            <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">★</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <p className="font-bold text-sm text-gray-800">{formatPrice(product.price)}</p>
                                            {product.compare_at_price && (
                                                <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.compare_at_price)}</p>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {margin ? (
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-gray-400 font-mono">${product.dropanas_price}</p>
                                                    <span className={`text-xs font-bold ${parseFloat(margin.pct) >= 25 ? 'text-green-600' : parseFloat(margin.pct) >= 15 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                        +${margin.amount} ({margin.pct}%)
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="p-3 min-w-[120px]">
                                            <div className="text-[10px] space-y-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-gray-400 w-4">2x:</span>
                                                    <span className="font-bold text-brand-blue">
                                                        {formatPrice(Math.round(product.price * 2 * (1 - (product.bundle_2_discount || 10) / 100)))}
                                                    </span>
                                                    <span className="text-green-600">-{product.bundle_2_discount || 10}%</span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-gray-400 w-4">3x:</span>
                                                    <span className="font-bold text-brand-blue">
                                                        {formatPrice(Math.round(product.price * 3 * (1 - (product.bundle_3_discount || 20) / 100)))}
                                                    </span>
                                                    <span className="text-green-600">-{product.bundle_3_discount || 20}%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold border ${product.stock === 0
                                                ? 'bg-gray-50 border-gray-200 text-gray-400'
                                                : product.stock <= (product.low_stock_threshold || 5)
                                                    ? 'bg-red-50 border-red-200 text-red-600'
                                                    : 'bg-green-50 border-green-200 text-green-600'
                                                }`}>
                                                {product.stock}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${product.is_active
                                                ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {product.is_active ? 'Activo' : 'Off'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-1">
                                                <a href={`/producto/${product.id}`} target="_blank" rel="noopener noreferrer"
                                                    className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver en tienda">
                                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                                </a>
                                                <button onClick={() => onToggleStatus(product)}
                                                    className={`p-1.5 rounded-lg transition-colors ${product.is_active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                                    title={product.is_active ? "Desactivar" : "Activar"}>
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {product.is_active ? 'visibility' : 'visibility_off'}
                                                    </span>
                                                </button>
                                                <button onClick={() => onEdit(product)}
                                                    className="p-1.5 text-steel-blue hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                {onClone && (
                                                    <button onClick={() => onClone(product)}
                                                        className="p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Clonar">
                                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                                    </button>
                                                )}
                                                <button onClick={() => onDelete(product.id)}
                                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 px-2 pb-2">
                    <div className="text-xs text-gray-500 pl-2">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount} productos
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
