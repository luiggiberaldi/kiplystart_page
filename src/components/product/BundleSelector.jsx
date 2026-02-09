/**
 * BundleSelector Component
 * @description
 * Interactive bundle selector with pricing and savings display
 */
export default function BundleSelector({ product, selectedBundle, onSelectBundle, getPrice, getSavings }) {
    return (
        <div className="space-y-3">
            <p className="font-bold text-sm text-gray-700">Selecciona tu Oferta:</p>

            {/* Option 1: 1 Unit */}
            <div
                onClick={() => onSelectBundle(1)}
                className={`border-2 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${selectedBundle === 1 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBundle === 1 ? 'border-brand-blue' : 'border-gray-300'}`}>
                        {selectedBundle === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                    </div>
                    <span className="font-bold text-soft-black">1 Unidad</span>
                </div>
                <span className="font-bold text-brand-blue">${product.price.toFixed(2)}</span>
            </div>

            {/* Option 2: 2 Units */}
            <div
                onClick={() => onSelectBundle(2)}
                className={`relative border-2 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${selectedBundle === 2 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="absolute -top-2.5 left-4 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded">Recomendado</div>
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBundle === 2 ? 'border-brand-blue' : 'border-gray-300'}`}>
                        {selectedBundle === 2 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                    </div>
                    <div>
                        <span className="font-bold text-soft-black block">2 Unidades</span>
                        <span className="text-[10px] text-green-600 font-bold">Ahorras ${getSavings(2).toFixed(2)}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-gray-400 line-through">${(product.price * 2).toFixed(2)}</span>
                    <span className="font-bold text-brand-blue">${getPrice(2).toFixed(2)}</span>
                </div>
            </div>

            {/* Option 3: 3 Units */}
            <div
                onClick={() => onSelectBundle(3)}
                className={`border-2 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${selectedBundle === 3 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBundle === 3 ? 'border-brand-blue' : 'border-gray-300'}`}>
                        {selectedBundle === 3 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                    </div>
                    <div>
                        <span className="font-bold text-soft-black block">3 Unidades</span>
                        <span className="text-[10px] text-green-600 font-bold">Ahorras ${getSavings(3).toFixed(2)}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-gray-400 line-through">${(product.price * 3).toFixed(2)}</span>
                    <span className="font-bold text-brand-blue">${getPrice(3).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
