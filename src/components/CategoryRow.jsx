import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';

/**
 * CategoryRow — Horizontal product row for a single category
 * Shows 4 products (scroll on mobile) + "Ver todos" link.
 * @param {{ category: string, emoji?: string }} props
 */
export default function CategoryRow({ category, emoji = '📦' }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .eq('category', category)
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (error) throw error;
                setProducts(data || []);
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [category]);

    if (!loading && products.length === 0) return null;

    return (
        <div className="py-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-brand-blue flex items-center gap-2">
                    <span>{emoji}</span>
                    {category}
                </h3>
                <Link
                    to={`/catalogo?category=${encodeURIComponent(category)}`}
                    className="text-sm text-steel-blue font-bold hover:underline shrink-0"
                >
                    Ver todos →
                </Link>
            </div>

            {loading ? (
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="bg-white rounded-lg h-80 w-[72%] sm:w-[48%] md:w-[32%] lg:w-[24%] shrink-0 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
                    {products.map(product => (
                        <div key={product.id} className="w-[72%] sm:w-[48%] md:w-auto shrink-0 snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
