import { useState, useEffect } from 'react';
import { Plus, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { supabase } from '../../lib/supabaseClient';

export default function FrequentlyBoughtTogether({ product, onSelectCombo }) {
    const { formatUSD, formatBs } = useCurrency();
    const [pairedProduct, setPairedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!product) return;

        async function findComplementaryProduct() {
            try {
                setLoading(true);
                const s = (product.slug || product.name || '').toLowerCase();
                const targetCategory = product.category;

                // 1. Strictly query products from the SAME CATEGORY
                let query = supabase
                    .from('products')
                    .select('id, name, slug, price, compare_at_price, image_url, category')
                    .eq('is_active', true)
                    .neq('id', product.id);

                if (targetCategory) {
                    query = query.eq('category', targetCategory);
                }

                const { data, error } = await query.limit(20);

                if (error || !data || data.length === 0) {
                    // Fallback only if category name has related keywords (e.g. Carro / Auto)
                    const isCar = s.includes('carro') || s.includes('auto') || (targetCategory || '').toLowerCase().includes('carro');
                    if (isCar) {
                        const { data: carData } = await supabase
                            .from('products')
                            .select('id, name, slug, price, compare_at_price, image_url, category')
                            .eq('is_active', true)
                            .neq('id', product.id)
                            .ilike('category', '%carro%')
                            .limit(10);
                        
                        if (carData && carData.length > 0) {
                            selectBestMatch(s, carData);
                            return;
                        }
                    }

                    // If no related products exist in the same category, do not show unrelated combo
                    setPairedProduct(null);
                    return;
                }

                selectBestMatch(s, data);
            } catch (err) {
                console.error('Error loading complementary product:', err);
                setPairedProduct(null);
            } finally {
                setLoading(false);
            }
        }

        function selectBestMatch(currentSlug, candidates) {
            let matched = null;

            // Smart pairings within the same category
            if (currentSlug.includes('esponja') || currentSlug.includes('vidrio') || currentSlug.includes('oil film')) {
                matched = candidates.find(p => p.slug.includes('compresor') || p.slug.includes('cargador') || p.slug.includes('pomo') || p.slug.includes('toalla'));
            } else if (currentSlug.includes('cargador') || currentSlug.includes('bateria')) {
                matched = candidates.find(p => p.slug.includes('compresor') || p.slug.includes('esponja') || p.slug.includes('pomo'));
            } else if (currentSlug.includes('compresor')) {
                matched = candidates.find(p => p.slug.includes('cargador') || p.slug.includes('bateria') || p.slug.includes('esponja'));
            } else if (currentSlug.includes('pomo') || currentSlug.includes('palanca')) {
                matched = candidates.find(p => p.slug.includes('esponja') || p.slug.includes('compresor') || p.slug.includes('cargador'));
            } else if (currentSlug.includes('nox') || currentSlug.includes('nasal')) {
                matched = candidates.find(p => p.slug !== product.slug);
            }

            setPairedProduct(matched || candidates[0] || null);
        }

        findComplementaryProduct();
    }, [product]);

    if (loading || !pairedProduct || !product) return null;

    // Combo pricing calculations (15% bundle discount on the pair)
    const baseTotal = product.price + pairedProduct.price;
    const discountAmount = Math.ceil(baseTotal * 0.15); // 15% combo savings
    const comboPrice = baseTotal - discountAmount;
    const savings = discountAmount;

    const handleBuyCombo = () => {
        if (onSelectCombo) {
            onSelectCombo({
                mainProduct: product,
                pairedProduct: pairedProduct,
                comboPrice: comboPrice,
                savings: savings
            });
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-[#0A2463] to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-white/10 my-8">
            {/* Top Badge & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Frecuentemente Comprados Juntos</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        Lleva el Combo de {product.category || 'la misma categoría'} y Ahorra ${savings} USD
                    </h3>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full w-fit">
                    🚚 Envío 100% Gratis a toda Venezuela
                </span>
            </div>

            {/* Products Visual Connect Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Product 1 Card */}
                <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-16 h-16 rounded-xl object-contain bg-white shrink-0 p-1"
                    />
                    <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider block">Este Artículo</span>
                        <p className="font-bold text-xs text-white truncate">{product.name}</p>
                        <p className="text-sm font-black text-amber-300">${product.price} USD</p>
                    </div>
                </div>

                {/* Plus Icon */}
                <div className="md:col-span-1 flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/30">
                        <Plus className="w-5 h-5 stroke-[3]" />
                    </div>
                </div>

                {/* Product 2 Card */}
                <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                    <img 
                        src={pairedProduct.image_url} 
                        alt={pairedProduct.name} 
                        className="w-16 h-16 rounded-xl object-contain bg-white shrink-0 p-1"
                    />
                    <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block">Complemento Ideal</span>
                        <p className="font-bold text-xs text-white truncate">{pairedProduct.name}</p>
                        <p className="text-sm font-black text-amber-300">${pairedProduct.price} USD</p>
                    </div>
                </div>

                {/* Combo Total & Action */}
                <div className="md:col-span-3 bg-white/10 border border-white/15 rounded-2xl p-4 text-center space-y-2 flex flex-col justify-center">
                    <div className="text-xs text-blue-200 font-medium">
                        Precio Combo: <span className="line-through text-slate-400 font-bold">${baseTotal}</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-300">
                        ${comboPrice} USD
                    </div>
                    <div className="text-[10px] font-bold text-amber-300 bg-amber-400/20 rounded-md py-0.5 px-1.5 border border-amber-300/30">
                        Ahorras ${savings} USD
                    </div>
                </div>
            </div>

            {/* Direct 1-Click Combo Button */}
            <div className="pt-2">
                <button
                    onClick={handleBuyCombo}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                    <Zap className="w-5 h-5 fill-white text-white" />
                    <span>Pedir Combo Completo · ${comboPrice} USD</span>
                    <span className="text-xs font-bold text-emerald-100 hidden sm:inline">(Pagas al Recibir)</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                </button>
            </div>
        </div>
    );
}
