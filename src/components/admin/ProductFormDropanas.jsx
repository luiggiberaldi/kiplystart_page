/**
 * ProductFormDropanas - DroPanas link + read-only stock display
 */
export default function ProductFormDropanas({ formData, onChange }) {
    return (
        <section className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
            <h3 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">link</span>
                DroPanas & Stock
            </h3>

            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">URL Producto DroPanas</label>
                <input type="url" name="dropanas_url" value={formData.dropanas_url} onChange={onChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                    placeholder="https://dropanas.com/producto/..." />
            </div>

            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">inventory</span>
                    <span className="text-sm text-gray-600">Stock actual:</span>
                </div>
                <span className={`text-lg font-bold font-mono ${parseInt(formData.stock) === 0 ? 'text-red-500' : parseInt(formData.stock) <= 5 ? 'text-yellow-500' : 'text-green-600'}`}>
                    {formData.stock || 0} uds
                </span>
                <span className="text-xs text-gray-400 ml-auto">Sincronizado desde DroPanas</span>
            </div>
        </section>
    );
}
