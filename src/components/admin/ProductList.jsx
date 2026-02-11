import { useState, useMemo, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import ProductFilters from './product-list/ProductFilters';
import ProductBulkActions from './product-list/ProductBulkActions';
import ProductTable from './product-list/ProductTable';

/**
 * ProductList v3.0 (Modularized)
 * Contains state management and composition of sub-components.
 */
export default function ProductList({ products, onEdit, onDelete, onRefresh, onToggleStatus, onToggleFeatured, onClone }) {
    const { formatPrice } = useCurrency();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategory, filterStatus]);

    // Filtering
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && product.is_active) ||
                (filterStatus === 'inactive' && !product.is_active) ||
                (filterStatus === 'low_stock' && product.stock <= (product.low_stock_threshold || 5)) ||
                (filterStatus === 'out_of_stock' && product.stock === 0);
            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Sorting
        result.sort((a, b) => {
            let valA, valB;
            switch (sortBy) {
                case 'price': valA = a.price; valB = b.price; break;
                case 'stock': valA = a.stock; valB = b.stock; break;
                case 'margin':
                    valA = a.dropanas_price ? ((a.price - a.dropanas_price) / a.price) : 0;
                    valB = b.dropanas_price ? ((b.price - b.dropanas_price) / b.price) : 0;
                    break;
                default: valA = a.name.toLowerCase(); valB = b.name.toLowerCase();
            }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [products, searchTerm, filterCategory, filterStatus, sortBy, sortDir]);

    // Pagination Data
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = ['all', ...new Set(products.map(p => p.category || 'General'))];

    // Selection
    const allSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.has(p.id));

    function toggleSelectAll() {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    }

    function toggleSelect(id) {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    }

    function handleSort(col) {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('asc'); }
    }

    // Bulk actions
    async function handleBulkToggle(activate) {
        for (const id of selectedIds) {
            const prod = products.find(p => p.id === id);
            if (prod && prod.is_active !== activate) {
                await onToggleStatus({ ...prod, is_active: !activate });
            }
        }
        setSelectedIds(new Set());
    }

    async function handleBulkDelete() {
        if (!window.confirm(`¿Eliminar ${selectedIds.size} productos permanentemente?`)) return;
        for (const id of selectedIds) {
            await onDelete(id);
        }
        setSelectedIds(new Set());
    }

    return (
        <div className="space-y-3">
            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                categories={categories}
                onRefresh={onRefresh}
            />

            <ProductBulkActions
                selectedCount={selectedIds.size}
                onToggleActive={handleBulkToggle}
                onDelete={handleBulkDelete}
                onClear={() => setSelectedIds(new Set())}
            />

            <p className="text-xs text-gray-500 px-1">
                {filteredProducts.length} productos encontrados
            </p>

            <ProductTable
                products={paginatedProducts}
                totalCount={filteredProducts.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                selectedIds={selectedIds}
                allSelected={allSelected}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onToggleFeatured={onToggleFeatured}
                onClone={onClone}
                formatPrice={formatPrice}
            />
        </div>
    );
}
