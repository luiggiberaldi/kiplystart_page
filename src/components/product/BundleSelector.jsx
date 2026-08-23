import { Sparkles, Gift, CheckCircle2 } from 'lucide-react';

export default function BundleSelector({ 
    product, 
    selectedBundle, 
    onSelectBundle, 
    getPrice, 
    getSavings,
    discount2 = 15,
    discount3 = 30
}) {
    const isQuantity = product.bundle_type === 'quantity';

    if (isQuantity) {
        const singlePrice = product.price;
        const bundlePrice = singlePrice * 2;
        const savings = singlePrice;

        return (
            <div className="space-y-3">
                <p className="font-extrabold text-xs uppercase tracking-wider text-gray-600">Elige tu Paquete de Ahorro:</p>

                {/* Option 1 */}
                <div
                    onClick={() => onSelectBundle(1)}
                    className={`border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        selectedBundle === 1 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 1 ? 'border-[#0A2463] bg-[#0A2463]' : 'border-gray-300'}`}>
                            {selectedBundle === 1 && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <span className="font-bold text-sm sm:text-base text-gray-950">1 Unidad</span>
                    </div>
                    <span className="font-black text-base text-gray-950">${singlePrice.toFixed(0)}</span>
                </div>

                {/* Option 2: Buy 2 Get 1 Free */}
                <div
                    onClick={() => onSelectBundle(3)}
                    className={`relative border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        selectedBundle === 3 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="absolute -top-2.5 right-4 bg-brand-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        <span>¡1 GRATIS!</span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 3 ? 'border-[#0A2463] bg-[#0A2463]' : 'border-gray-300'}`}>
                            {selectedBundle === 3 && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                            <span className="font-bold text-sm sm:text-base text-gray-950 block">Paga 2 y Llévate 3</span>
                            <span className="text-xs text-emerald-700 font-extrabold">Ahorras ${savings.toFixed(0)} USD</span>
                        </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                        <span className="block text-xs text-gray-400 line-through">${(singlePrice * 3).toFixed(0)}</span>
                        <span className="font-black text-base sm:text-lg text-[#0A2463]">${bundlePrice.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="font-extrabold text-xs uppercase tracking-wider text-gray-600">Elige tu Paquete de Ahorro:</p>

            {/* Option 1: 1 Unit */}
            <div
                onClick={() => onSelectBundle(1)}
                className={`border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBundle === 1 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 1 ? 'border-[#0A2463] bg-[#0A2463]' : 'border-gray-300'}`}>
                        {selectedBundle === 1 && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className="font-bold text-sm sm:text-base text-gray-950">1 Unidad Individual</span>
                </div>
                <span className="font-black text-base text-gray-950">${product.price.toFixed(0)}</span>
            </div>

            {/* Option 2: 2 Units */}
            <div
                onClick={() => onSelectBundle(2)}
                className={`relative border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBundle === 2 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
                <div className="absolute -top-2.5 right-4 bg-[#0A2463] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>MÁS POPULAR (-{discount2}%)</span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 2 ? 'border-[#0A2463] bg-[#0A2463]' : 'border-gray-300'}`}>
                        {selectedBundle === 2 && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                        <span className="font-bold text-sm sm:text-base text-gray-950 block">Pack x2 Unidades</span>
                        <span className="text-xs text-emerald-700 font-extrabold">Ahorras ${getSavings(2).toFixed(0)} USD</span>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                    <span className="block text-xs text-gray-400 line-through">${Math.ceil(product.price * 2)}</span>
                    <span className="font-black text-base sm:text-lg text-[#0A2463]">${getPrice(2)}</span>
                </div>
            </div>

            {/* Option 3: 3 Units */}
            <div
                onClick={() => onSelectBundle(3)}
                className={`relative border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBundle === 3 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
                <div className="absolute -top-2.5 right-4 bg-brand-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>MÁXIMO AHORRO (-{discount3}%)</span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBundle === 3 ? 'border-[#0A2463] bg-[#0A2463]' : 'border-gray-300'}`}>
                        {selectedBundle === 3 && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                        <span className="font-bold text-sm sm:text-base text-gray-950 block">Pack x3 Unidades</span>
                        <span className="text-xs text-emerald-700 font-extrabold">Ahorras ${Math.ceil(getSavings(3))} USD</span>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                    <span className="block text-xs text-gray-400 line-through">${Math.ceil(product.price * 3)}</span>
                    <span className="font-black text-base sm:text-lg text-[#0A2463]">${getPrice(3)}</span>
                </div>
            </div>
        </div>
    );
}
