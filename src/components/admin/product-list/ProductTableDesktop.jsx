import { useSettings } from '../../../context/SettingsContext';
import { 
    ExternalLink, Eye, EyeOff, Star, 
    Pencil, Copy, Trash2, ChevronLeft, 
    ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Package
} from 'lucide-react';

function SortIcon({ col, sortBy, sortDir }) {
    if (sortBy !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
}

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
    onToggleFeatured,
    onClone,
    formatPrice
}) {
    const { settings } = useSettings();
    const shippingCost = settings.shipping_cost || 8;

    return (
        <div className="bg-white rounded-3xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 text-[10px] uppercase text-gray-500 font-extrabold border-b border-gray-200">
                        <tr>
                            <th className="p-4 w-10">
                                <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll}
                                    className="w-4 h-4 text-[#0A2463] rounded-lg cursor-pointer" />
                            </th>
                            <th className="p-4 cursor-pointer select-none" onClick={() => onSort('name')}>
                                <span className="flex items-center gap-1.5">Producto <SortIcon col="name" sortBy={sortBy} sortDir={sortDir} /></span>
                            </th>
                            <th className="p-4 cursor-pointer select-none" onClick={() => onSort('price')}>
                                <span className="flex items-center gap-1.5">Precio USD <SortIcon col="price" sortBy={sortBy} sortDir={sortDir} /></span>
                            </th>
                            <th className="p-4 cursor-pointer select-none" onClick={() => onSort('margin')}>
                                <span className="flex items-center gap-1.5">DroPanas <SortIcon col="margin" sortBy={sortBy} sortDir={sortDir} /></span>
                            </th>
                            <th className="p-4">Ofertas / Bundles</th>
                            <th className="p-4 cursor-pointer select-none" onClick={() => onSort('stock')}>
                                <span className="flex items-center gap-1.5">Stock <SortIcon col="stock" sortBy={sortBy} sortDir={sortDir} /></span>
                            </th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-12 text-center text-gray-400">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="font-bold text-sm text-gray-600">No se encontraron productos</p>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const isSelected = selectedIds.has(product.id);
                                return (
                                    <tr key={product.id}
                                        className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-4">
                                            <input type="checkbox" checked={isSelected}
                                                onChange={() => onToggleSelect(product.id)}
                                                className="w-4 h-4 text-[#0A2463] rounded-lg cursor-pointer" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-50 border border-gray-200 rounded-xl p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1 max-w-[420px] 2xl:max-w-none">
                                                    <p className="font-bold text-sm text-gray-950 truncate">{product.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{product.category || 'General'}</span>
                                                        {product.featured && (
                                                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                                                                <Star className="w-2.5 h-2.5 fill-amber-500" /> Destacado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-black text-sm text-gray-950 tabular-nums">{formatPrice(product.price)}</p>
                                            {product.compare_at_price && (
                                                <p className="text-[10px] text-gray-400 line-through tabular-nums">{formatPrice(product.compare_at_price)}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {product.dropanas_price ? (() => {
                                                const totalCost = product.dropanas_price + shippingCost;
                                                const marginAmt = product.price - totalCost;
                                                const marginPct = ((marginAmt / product.price) * 100).toFixed(0);
                                                return (
                                                    <div className="space-y-0.5 font-mono text-[11px]">
                                                        <p className="text-gray-400">
                                                            ${product.dropanas_price} + ${shippingCost} = <strong className="text-gray-700">${totalCost}</strong>
                                                        </p>
                                                        <span className={`font-bold ${parseFloat(marginPct) >= 25 ? 'text-emerald-700' : parseFloat(marginPct) >= 15 ? 'text-amber-600' : 'text-red-500'}`}>
                                                            +${marginAmt.toFixed(0)} ({marginPct}%)
                                                        </span>
                                                    </div>
                                                );
                                            })() : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 min-w-[130px]">
                                            <div className="text-[10px] space-y-1 font-semibold">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-gray-400 w-4">2x:</span>
                                                    <span className="font-bold text-[#0A2463] tabular-nums">
                                                        {formatPrice(Math.round(product.price * 2 * (1 - (product.bundle_2_discount || 10) / 100)))}
                                                    </span>
                                                    <span className="text-emerald-700 font-extrabold">-{product.bundle_2_discount || 10}%</span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-gray-400 w-4">3x:</span>
                                                    <span className="font-bold text-[#0A2463] tabular-nums">
                                                        {formatPrice(Math.round(product.price * 3 * (1 - (product.bundle_3_discount || 20) / 100)))}
                                                    </span>
                                                    <span className="text-emerald-700 font-extrabold">-{product.bundle_3_discount || 20}%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs font-black border tabular-nums ${
                                                product.stock === 0
                                                    ? 'bg-slate-50 border-gray-200 text-gray-400'
                                                    : product.stock <= (product.low_stock_threshold || 5)
                                                        ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                                                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                            }`}>
                                                {product.stock} un.
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-xl font-extrabold ${
                                                product.is_active
                                                    ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {product.is_active ? 'Activo' : 'Pausado'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end items-center gap-1">
                                                <a href={`/producto/${product.slug || product.id}`} target="_blank" rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-[#0A2463] hover:bg-blue-50 rounded-xl transition-colors"
                                                    title="Ver en tienda">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button onClick={() => onToggleStatus(product)}
                                                    className={`p-2 rounded-xl transition-colors cursor-pointer ${product.is_active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                                    title={product.is_active ? "Desactivar" : "Activar"}>
                                                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => onToggleFeatured(product)}
                                                    className={`p-2 rounded-xl transition-colors cursor-pointer ${product.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'}`}
                                                    title={product.featured ? 'Quitar de destacados' : 'Destacar'}>
                                                    <Star className={`w-4 h-4 ${product.featured ? 'fill-amber-400' : ''}`} />
                                                </button>
                                                <button onClick={() => onEdit(product)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                                                    title="Editar producto">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {onClone && (
                                                    <button onClick={() => onClone(product)}
                                                        className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                                                        title="Clonar producto">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => onDelete(product.id)}
                                                    className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                    title="Eliminar">
                                                    <Trash2 className="w-4 h-4" />
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
                <div className="flex items-center justify-between border-t border-gray-200 p-4 bg-slate-50/50">
                    <div className="text-xs font-semibold text-gray-500">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount} productos
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-extrabold text-gray-800 px-3 py-1 bg-white border border-gray-200 rounded-xl">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
