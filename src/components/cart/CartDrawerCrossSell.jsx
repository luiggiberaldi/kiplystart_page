import { useState, useEffect } from 'react';
import { Plus, Sparkles, Check, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';

export default function CartDrawerCrossSell() {
    const { addToCart, cartItems } = useCart();
    const [upsellProducts, setUpsellProducts] = useState([]);
    const [addedIds, setAddedIds] = useState({});

    useEffect(() => {
        async function fetchCrossSells() {
            try {
                const inCartIds = new Set(cartItems.map(item => item.id));
                const cartCategories = [...new Set(cartItems.map(i => i.category).filter(Boolean))];

                let query = supabase
                    .from('products')
                    .select('id, name, slug, price, compare_at_price, image_url, category')
                    .eq('is_active', true)
                    .order('price', { ascending: true })
                    .limit(10);

                if (cartCategories.length > 0) {
                    query = query.in('category', cartCategories);
                }

                let { data, error } = await query;

                // Fallback to affordable items if no category match
                if (!data || data.length === 0) {
                    const fallbackRes = await supabase
                        .from('products')
                        .select('id, name, slug, price, compare_at_price, image_url, category')
                        .eq('is_active', true)
                        .order('price', { ascending: true })
                        .limit(8);
                    data = fallbackRes.data || [];
                }

                // Filter out items already in cart
                const available = data.filter(p => !inCartIds.has(p.id)).slice(0, 2);
                setUpsellProducts(available);
            } catch (err) {
                console.error('Error loading cart upsells:', err);
            }
        }

        fetchCrossSells();
    }, [cartItems]);

    if (!upsellProducts || upsellProducts.length === 0) return null;

    const handleAdd = (prod) => {
        addToCart(prod, 1, { bundleSize: 1, bundleTotal: prod.price, discountPct: 0 });
        setAddedIds(prev => ({ ...prev, [prod.id]: true }));
        setTimeout(() => {
            setAddedIds(prev => ({ ...prev, [prod.id]: false }));
        }, 1500);
    };

    return (
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 rounded-2xl p-3.5 border border-blue-200/80 space-y-2.5 my-2">
            <div className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1.5 text-[11px] font-black text-[#0A2463] uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Completa tu pedido</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Envío 100% Gratis
                </span>
            </div>

            <div className="space-y-2">
                {upsellProducts.map(prod => (
                    <div 
                        key={prod.id} 
                        className="bg-white rounded-xl p-2.5 flex items-center justify-between gap-2.5 border border-gray-200/70 shadow-2xs"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <img 
                                src={prod.image_url} 
                                alt={prod.name} 
                                className="w-10 h-10 rounded-lg object-contain bg-white shrink-0 border border-gray-100"
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                                <p className="text-xs font-black text-emerald-700">${prod.price} USD</p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleAdd(prod)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                                addedIds[prod.id]
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#0A2463] hover:bg-blue-950 active:scale-95 text-white shadow-xs'
                            }`}
                        >
                            {addedIds[prod.id] ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>¡Listo!</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Agregar</span>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
