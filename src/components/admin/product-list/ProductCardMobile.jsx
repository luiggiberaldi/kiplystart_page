/**
 * ProductCardMobile
 * Renders a single product as a card for mobile view.
 */
export default function ProductCardMobile({
    product,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
    onToggleStatus,
    onClone,
    formatPrice,
    productSlug
}) {
    const margin = product.dropanas_price
        ? { amount: product.price - product.dropanas_price, pct: (((product.price - product.dropanas_price) / product.price) * 100).toFixed(0) }
        : null;

    return (
        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isSelected ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
            }`}>
            {/* Card Header */}
            <div className="flex items-center gap-3 p-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(product.id)}
                    className="w-4 h-4 text-brand-blue rounded cursor-pointer shrink-0"
                />
                <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg p-0.5 flex-shrink-0 overflow-hidden">
                    <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-soft-black line-clamp-1">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{product.category}</span>
                        {product.featured && (
                            <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">★</span>
                        )}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-auto ${product.is_active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {product.is_active ? 'Activo' : 'Off'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Body — Price & Stock */}
            <div className="grid grid-cols-3 gap-px bg-gray-100 border-t border-gray-100">
                <div className="bg-white px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Precio</p>
                    <p className="font-bold text-sm text-gray-800">{formatPrice(product.price)}</p>
                    {product.compare_at_price && (
                        <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.compare_at_price)}</p>
                    )}
                </div>
                <div className="bg-white px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Stock</p>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${product.stock === 0
                        ? 'bg-gray-50 text-gray-400'
                        : product.stock <= (product.low_stock_threshold || 5)
                            ? 'bg-red-50 text-red-600'
                            : 'bg-green-50 text-green-600'
                        }`}>
                        {product.stock}
                    </div>
                </div>
                <div className="bg-white px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Margen</p>
                    {margin ? (
                        <span className={`text-xs font-bold ${parseFloat(margin.pct) >= 25 ? 'text-green-600' : parseFloat(margin.pct) >= 15 ? 'text-yellow-600' : 'text-red-500'
                            }`}>
                            {margin.pct}%
                        </span>
                    ) : (
                        <span className="text-[10px] text-gray-300">—</span>
                    )}
                </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-end gap-1 px-2 py-1.5 bg-gray-50/50 border-t border-gray-100">
                <a href={`/producto/${product.slug || product.id}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-brand-blue rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
                <button onClick={() => onToggleStatus(product)}
                    className={`p-2 rounded-lg transition-colors ${product.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                    <span className="material-symbols-outlined text-[18px]">
                        {product.is_active ? 'visibility' : 'visibility_off'}
                    </span>
                </button>
                <button onClick={() => onEdit(product)}
                    className="p-2 text-steel-blue hover:text-brand-blue rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                {onClone && (
                    <button onClick={() => onClone(product)}
                        className="p-2 text-purple-400 hover:text-purple-600 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                )}
                <button onClick={() => onDelete(product.id)}
                    className="p-2 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
        </div>
    );
}
