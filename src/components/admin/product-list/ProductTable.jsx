import useIsMobile from '../../../hooks/useIsMobile';
import ProductCardMobile from './ProductCardMobile';
import ProductTableDesktop from './ProductTableDesktop';

/**
 * ProductTable — Orchestrator
 * Renders mobile cards or desktop table based on viewport.
 */
export default function ProductTable({
    products,
    totalCount,
    currentPage,
    totalPages,
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
    formatPrice
}) {
    const itemsPerPage = 20;
    const isMobile = useIsMobile();

    function productSlug(name) {
        return name.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // ========== MOBILE ==========
    if (isMobile) {
        return (
            <div className="space-y-3">
                {/* Sort Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                        { id: 'name', label: 'Nombre' },
                        { id: 'price', label: 'Precio' },
                        { id: 'stock', label: 'Stock' },
                    ].map(s => (
                        <button
                            key={s.id}
                            onClick={() => onSort(s.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${sortBy === s.id ? 'bg-[#0A2463] text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {s.label}
                            {sortBy === s.id && (
                                <span className="material-symbols-outlined text-[14px]">
                                    {sortDir === 'asc' ? 'expand_less' : 'expand_more'}
                                </span>
                            )}
                        </button>
                    ))}
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-auto">{totalCount} items</span>
                </div>

                {/* Cards */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
                        <span className="material-symbols-outlined text-[48px] mb-2 block text-gray-200">inventory_2</span>
                        No se encontraron productos
                    </div>
                ) : (
                    products.map(product => (
                        <ProductCardMobile
                            key={product.id}
                            product={product}
                            isSelected={selectedIds.has(product.id)}
                            onToggleSelect={onToggleSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                            onClone={onClone}
                            formatPrice={formatPrice}
                            productSlug={productSlug}
                        />
                    ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500">
                            {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount}
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                                className="p-2 bg-white rounded-lg border border-gray-200 disabled:opacity-30 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <span className="text-sm font-medium text-gray-700">{currentPage}/{totalPages}</span>
                            <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                                className="p-2 bg-white rounded-lg border border-gray-200 disabled:opacity-30 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ========== DESKTOP ==========
    return (
        <ProductTableDesktop
            products={products}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            selectedIds={selectedIds}
            allSelected={allSelected}
            onToggleSelect={onToggleSelect}
            onToggleSelectAll={onToggleSelectAll}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={onSort}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onClone={onClone}
            formatPrice={formatPrice}
            productSlug={productSlug}
        />
    );
}
