import { Sparkles, Gift, Check, TrendingUp, Zap } from 'lucide-react';

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
        const unitPrice3 = (bundlePrice / 3).toFixed(2);

        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="font-extrabold text-xs uppercase tracking-wider text-gray-700">Elige tu Paquete de Ahorro:</p>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        Envío 100% Gratis
                    </span>
                </div>

                {/* Option 1 */}
                <div
                    onClick={() => onSelectBundle(1)}
                    className={`border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        selectedBundle === 1 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            selectedBundle === 1 ? 'border-[#0A2463] bg-[#0A2463] shadow-xs' : 'border-gray-300 bg-white'
                        }`}>
                            {selectedBundle === 1 && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                        <div>
                            <span className="font-bold text-sm sm:text-base text-gray-950 block">1 Unidad</span>
                            <span className="text-[11px] text-gray-500 font-medium">${singlePrice.toFixed(2)} / unidad</span>
                        </div>
                    </div>
                    <span className="font-black text-base text-gray-950">${singlePrice.toFixed(0)}</span>
                </div>

                {/* Option 2: Buy 2 Get 1 Free */}
                <div
                    onClick={() => onSelectBundle(3)}
                    className={`relative border-2 rounded-2xl pt-4 pb-3.5 px-3.5 sm:p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        selectedBundle === 3 ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-600/15' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="absolute -top-2.5 right-3 sm:right-4 bg-brand-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10 animate-bounce">
                        <Gift className="w-3 h-3" />
                        <span>¡PAGAS 2 Y LLEVAS 3 (1 GRATIS)!</span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            selectedBundle === 3 ? 'border-emerald-600 bg-emerald-600 shadow-xs' : 'border-gray-300 bg-white'
                        }`}>
                            {selectedBundle === 3 && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                        <div>
                            <span className="font-bold text-sm sm:text-base text-gray-950 block">Paga 2 y Llévate 3</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded font-mono">
                                    ${unitPrice3} / ud
                                </span>
                                <span className="text-xs text-emerald-700 font-extrabold">Ahorras ${savings.toFixed(0)} USD</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right shrink-0 ml-2 pt-1">
                        <span className="block text-xs text-gray-400 line-through">${(singlePrice * 3).toFixed(0)}</span>
                        <span className="font-black text-base sm:text-lg text-emerald-700">${bundlePrice.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        );
    }

    const unitPrice1 = product.price.toFixed(2);
    const unitPrice2 = (getPrice(2) / 2).toFixed(2);
    const unitPrice3 = (getPrice(3) / 3).toFixed(2);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="font-extrabold text-xs uppercase tracking-wider text-gray-700">Elige tu Paquete de Ahorro:</p>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    Envío 100% Gratis
                </span>
            </div>

            {/* Option 1: 1 Unit */}
            <div
                onClick={() => onSelectBundle(1)}
                className={`border-2 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBundle === 1 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedBundle === 1 ? 'border-[#0A2463] bg-[#0A2463] shadow-xs' : 'border-gray-300 bg-white'
                    }`}>
                        {selectedBundle === 1 && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <div>
                        <span className="font-bold text-sm sm:text-base text-gray-950 block">1 Unidad Individual</span>
                        <span className="text-[11px] text-gray-500 font-medium">${unitPrice1} / unidad</span>
                    </div>
                </div>
                <span className="font-black text-base text-gray-950">${product.price.toFixed(0)}</span>
            </div>

            {/* Option 2: 2 Units */}
            <div
                onClick={() => onSelectBundle(2)}
                className={`relative border-2 rounded-2xl pt-4 pb-3.5 px-3.5 sm:p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBundle === 2 ? 'border-[#0A2463] bg-blue-50/40 shadow-sm ring-2 ring-[#0A2463]/10' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
                <div className="absolute -top-2.5 right-3 sm:right-4 bg-[#0A2463] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>MÁS POPULAR (-{discount2}%)</span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedBundle === 2 ? 'border-[#0A2463] bg-[#0A2463] shadow-xs' : 'border-gray-300 bg-white'
                    }`}>
                        {selectedBundle === 2 && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <div>
                        <span className="font-bold text-sm sm:text-base text-gray-950 block">Pack x2 Unidades</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-black text-blue-900 bg-blue-100/90 px-1.5 py-0.2 rounded font-mono">
                                ${unitPrice2} / ud
                            </span>
                            <span className="text-xs text-emerald-700 font-extrabold">Ahorras ${getSavings(2).toFixed(0)} USD</span>
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2 pt-1">
                    <span className="block text-xs text-gray-400 line-through">${Math.ceil(product.price * 2)}</span>
                    <span className="font-black text-base sm:text-lg text-[#0A2463]">${getPrice(2)}</span>
                </div>
            </div>

            {/* Option 3: 3 Units - Maximum Savings / Decoy Winner */}
            <div
                onClick={() => onSelectBundle(3)}
                className={`relative border-2 rounded-2xl pt-4 pb-3.5 px-3.5 sm:p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBundle === 3 ? 'border-brand-red bg-rose-50/40 shadow-sm ring-2 ring-brand-red/15' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
                <div className="absolute -top-2.5 right-3 sm:right-4 bg-brand-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                    <TrendingUp className="w-3 h-3 text-amber-300" />
                    <span>MÁXIMO AHORRO (-{discount3}%)<span className="hidden sm:inline"> · ¡PRECIO DE FÁBRICA!</span></span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedBundle === 3 ? 'border-brand-red bg-brand-red shadow-xs' : 'border-gray-300 bg-white'
                    }`}>
                        {selectedBundle === 3 && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <div>
                        <span className="font-bold text-sm sm:text-base text-gray-950 block">Pack x3 Unidades</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-black text-rose-900 bg-rose-100/90 px-1.5 py-0.2 rounded font-mono">
                                ${unitPrice3} / ud
                            </span>
                            <span className="text-xs text-emerald-700 font-extrabold">Ahorras ${Math.ceil(getSavings(3))} USD</span>
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2 pt-1">
                    <span className="block text-xs text-gray-400 line-through">${Math.ceil(product.price * 3)}</span>
                    <span className="font-black text-base sm:text-lg text-brand-red">${getPrice(3)}</span>
                </div>
            </div>
        </div>
    );
}
