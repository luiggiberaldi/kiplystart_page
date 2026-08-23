import { Search, RotateCcw } from 'lucide-react';

export default function ProductFilters({
    searchTerm, setSearchTerm,
    filterCategory, setFilterCategory,
    filterStatus, setFilterStatus,
    categories,
    onRefresh
}) {
    return (
        <div className="flex flex-wrap gap-3 items-center bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text" 
                    placeholder="Buscar producto por nombre o SKU..."
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0A2463] focus:border-[#0A2463] outline-none transition-all"
                />
            </div>

            <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#0A2463] outline-none cursor-pointer"
            >
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'Todas las Categorías' : cat}</option>
                ))}
            </select>

            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#0A2463] outline-none cursor-pointer"
            >
                <option value="all">Todos los Estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="low_stock">Stock Bajo (⚠️)</option>
                <option value="out_of_stock">Agotados (⛔)</option>
            </select>

            <button 
                onClick={onRefresh}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center" 
                title="Actualizar catálogo"
            >
                <RotateCcw className="w-4 h-4" />
            </button>
        </div>
    );
}
