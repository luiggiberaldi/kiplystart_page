/**
 * BundleSelector Component
 * @description
 * Interactive bundle selector with pricing and savings display.
 * Supports both 'discount' (% off) and 'quantity' (buy 2 get 1 free) modes.
 * Responsive from 320px: larger touch targets, proper text scaling.
 */
export default function BundleSelector({ product, selectedBundle, onSelectBundle, getPrice, getSavings }) {
    const isQuantity = product.bundle_type === 'quantity';

    if (isQuantity) {
        // ===== QUANTITY MODE: 1 unit or buy 2 get 1 free =====
        const singlePrice = product.price;
        const bundlePrice = singlePrice * 2; // pay for 2, get 3
        const savings = singlePrice; // you save 1 full unit

        return (
            <div className="space-y-2.5 md:space-y-3">
                <p className="font-bold text-xs md:text-sm text-gray-700">Selecciona tu Oferta:</p>

                {/* Option: 1 Unit */}
                <div
                    onClick={() => onSelectBundle(1)}
                    className={`border-2 rounded-xl p-3 md:p-3 flex items-center justify-between cursor-pointer transition-all min-h-[48px] ${selectedBundle === 1 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                    <div className="flex items-center gap-2.5 md:gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 1 ? 'border-brand-blue' : 'border-gray-300'}`}>
                            {selectedBundle === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                        </div>
                        <span className="font-bold text-sm md:text-base text-soft-black">1 Unidad</span>
                    </div>
                    <span className="font-bold text-sm md:text-base text-brand-blue">${singlePrice.toFixed(2)}</span>
                </div>

                {/* Option: Buy 2 Get 1 Free */}
                <div
                    onClick={() => onSelectBundle(3)}
                    className={`relative border-2 rounded-xl p-3 md:p-3 flex items-center justify-between cursor-pointer transition-all min-h-[48px] ${selectedBundle === 3 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                    <div className="absolute -top-2.5 left-3 md:left-4 bg-brand-red text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded">🎁 ¡1 Gratis!</div>
                    <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 3 ? 'border-brand-blue' : 'border-gray-300'}`}>
                            {selectedBundle === 3 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                        </div>
                        <div className="min-w-0">
                            <span className="font-bold text-sm md:text-base text-soft-black block">Compra 2, Llévate 3</span>
                            <span className="text-[10px] text-green-600 font-bold">Ahorras ${savings.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                        <span className="block text-[10px] md:text-xs text-gray-400 line-through">${(singlePrice * 3).toFixed(0)}</span>
                        <span className="font-bold text-sm md:text-base text-brand-blue">${bundlePrice.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        );
    }

    // ===== DISCOUNT MODE (default): percentage-based bundles =====
    return (
        <div className="space-y-2.5 md:space-y-3">
            <p className="font-bold text-xs md:text-sm text-gray-700">Selecciona tu Oferta:</p>

            {/* Option 1: 1 Unit */}
            <div
                onClick={() => onSelectBundle(1)}
                className={`border-2 rounded-xl p-3 md:p-3 flex items-center justify-between cursor-pointer transition-all min-h-[48px] ${selectedBundle === 1 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-2.5 md:gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 1 ? 'border-brand-blue' : 'border-gray-300'}`}>
                        {selectedBundle === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                    </div>
                    <span className="font-bold text-sm md:text-base text-soft-black">1 Unidad</span>
                </div>
                <span className="font-bold text-sm md:text-base text-brand-blue">${product.price.toFixed(2)}</span>
            </div>

            {/* Option 2: 2 Units */}
            <div
                onClick={() => onSelectBundle(2)}
                className={`relative border-2 rounded-xl p-3 md:p-3 flex items-center justify-between cursor-pointer transition-all min-h-[48px] ${selectedBundle === 2 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="absolute -top-2.5 left-3 md:left-4 bg-brand-red text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded">Recomendado</div>
                <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 2 ? 'border-brand-blue' : 'border-gray-300'}`}>
                        {selectedBundle === 2 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                    </div>
                    <div className="min-w-0">
                        <span className="font-bold text-sm md:text-base text-soft-black block">2 Unidades</span>
                        <span className="text-[10px] text-green-600 font-bold">Ahorras ${getSavings(2).toFixed(2)}</span>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                    <span className="block text-[10px] md:text-xs text-gray-400 line-through">${Math.ceil(product.price * 2)}</span>
                    <span className="font-bold text-sm md:text-base text-brand-blue">${getPrice(2)}</span>
                </div>
            </div>

            {/* Option 3: 3 Units */}
            <div
                onClick={() => onSelectBundle(3)}
                className={`border-2 rounded-xl p-3 md:p-3 flex items-center justify-between cursor-pointer transition-all min-h-[48px] ${selectedBundle === 3 ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 3 ? 'border-brand-blue' : 'border-gray-300'}`}>
                        {selectedBundle === 3 && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                    </div>
                    <div className="min-w-0">
                        <span className="font-bold text-sm md:text-base text-soft-black block">3 Unidades</span>
                        <span className="text-[10px] text-green-600 font-bold">Ahorras ${Math.ceil(getSavings(3))}</span>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                    <span className="block text-[10px] md:text-xs text-gray-400 line-through">${Math.ceil(product.price * 3)}</span>
                    <span className="font-bold text-sm md:text-base text-brand-blue">${getPrice(3)}</span>
                </div>
            </div>
        </div>
    );
}
