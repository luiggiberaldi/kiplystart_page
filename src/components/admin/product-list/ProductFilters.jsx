export default function ProductFilters({
    searchTerm, setSearchTerm,
    filterCategory, setFilterCategory,
    filterStatus, setFilterStatus,
    categories,
    onRefresh
}) {
    return (
        <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex-1 min-w-[180px] relative">
                <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">search</span>
                <input
                    type="text" placeholder="Buscar producto..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
            </div>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none">
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'Categorías' : cat}</option>
                ))}
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none">
                <option value="all">Estado</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="low_stock">Stock Bajo</option>
                <option value="out_of_stock">Sin Stock</option>
            </select>

            <button onClick={onRefresh}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" title="Actualizar">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
        </div>
    );
}
