import { useState, useEffect } from 'react';
import { Zap, Check, Sparkles, Plus, Gift } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useSettings } from '../../context/SettingsContext';

/**
 * Curated list of high-converting impulse order bumps by category
 */
const BUMP_OFFERS = {
    car: {
        id: 'bump-esponja-vidrios',
        name: 'Esponja Mágica Desengrasante de Vidrios',
        description: 'Elimina 100% la grasa y marcas de lluvia ácida del parabrisas. ¡Visibilidad cristalina de noche!',
        originalPrice: 18,
        image: 'https://app.dropanas.com/storage/images/sample.jpg'
    },
    general: {
        id: 'bump-toalla-microfibra',
        name: 'Toalla Ultra Absorbente de Secado Rápido',
        description: 'Microfibra de alta densidad para secado y pulitura sin dejar marcas ni rayas.',
        originalPrice: 15,
        image: 'https://app.dropanas.com/storage/images/sample.jpg'
    }
};

/**
 * Helper to get computed bump offer with dynamic discount
 */
export function getBumpOffer(product, discountPct = 30) {
    const category = (product?.category || '').toLowerCase();
    const isCarCategory = category.includes('carro') || category.includes('auto') || (product?.slug || '').includes('carro');
    const base = isCarCategory ? BUMP_OFFERS.car : BUMP_OFFERS.general;
    const price = Math.round(base.originalPrice * (1 - (discountPct / 100)));

    return {
        ...base,
        price,
        discountPct
    };
}

export default function CODOrderBump({ product, isSelected, onToggle }) {
    const { formatBs, exchangeRate } = useCurrency();
    const { settings } = useSettings();

    const discountPct = parseInt(settings?.order_bump_discount_pct, 10) || 30;
    const bump = getBumpOffer(product, discountPct);
    const bumpPriceBs = formatBs ? formatBs(bump.price) : `Bs. ${(bump.price * (exchangeRate || 1)).toFixed(2)}`;

    return (
        <div 
            onClick={onToggle}
            className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all select-none relative overflow-hidden ${
                isSelected 
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                    : 'bg-amber-50/40 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-50/70'
            }`}
        >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                    <Zap className="w-3 h-3 fill-slate-950" />
                    <span>Oferta Especial de 1 Clic</span>
                </span>
                <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                    -{discountPct}% OFF
                </span>
            </div>

            {/* Content & Checkbox */}
            <div className="flex items-start gap-3">
                {/* Custom Checkbox Box */}
                <div className="pt-0.5 shrink-0">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs scale-105' 
                            : 'border-amber-400 bg-white text-transparent'
                    }`}>
                        <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="font-extrabold text-xs sm:text-sm text-gray-950 leading-snug">
                            Sí, agregar <strong className="text-[#0A2463]">{bump.name}</strong>
                        </span>
                    </div>

                    <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                        {bump.description}
                    </p>

                    <div className="pt-1.5 flex items-center gap-2 text-xs flex-wrap">
                        <span className="font-black text-emerald-700 text-sm">
                            +${bump.price} USD
                        </span>
                        <span className="text-gray-400 line-through text-[11px] font-semibold">
                            ${bump.originalPrice}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">
                            ({bumpPriceBs})
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md ml-auto">
                            🚚 Sin costo de envío extra
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { BUMP_OFFERS };
