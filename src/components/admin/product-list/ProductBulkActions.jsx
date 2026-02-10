export default function ProductBulkActions({
    selectedCount,
    onToggleActive, // Pass a function that handles true/false
    onDelete,
    onClear
}) {
    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center gap-3 bg-brand-blue text-white px-4 py-2.5 rounded-xl animate-[fadeIn_0.2s_ease-out]">
            <span className="text-sm font-bold">{selectedCount} seleccionados</span>
            <div className="flex-1" />
            <button onClick={() => onToggleActive(true)}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">visibility</span> Activar
            </button>
            <button onClick={() => onToggleActive(false)}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">visibility_off</span> Desactivar
            </button>
            <button onClick={onDelete}
                className="text-xs bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">delete</span> Eliminar
            </button>
            <button onClick={onClear}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
        </div>
    );
}
