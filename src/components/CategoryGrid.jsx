import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const categoryMeta = {
    'Relojes': { icon: '⌚', color: 'bg-blue-50 border-blue-100' },
    'Accesorios para Carros': { icon: '🚗', color: 'bg-amber-50 border-amber-100' },
    'Belleza & Cuidado Personal': { icon: '💄', color: 'bg-pink-50 border-pink-100' },
    'Salud & Bienestar': { icon: '💊', color: 'bg-green-50 border-green-100' },
    'Tecnología & Gadgets': { icon: '📱', color: 'bg-violet-50 border-violet-100' },
    'Juguetes & Regalos': { icon: '🧸', color: 'bg-orange-50 border-orange-100' },
    'Hogar Inteligente': { icon: '🏠', color: 'bg-teal-50 border-teal-100' },
    'Accesorios & Estilo': { icon: '✨', color: 'bg-indigo-50 border-indigo-100' },
};

const fallback = { icon: '📦', color: 'bg-gray-50 border-gray-100' };

/**
 * CategoryGrid — Visual grid of product categories with counts
 * Data fetched from Supabase, each card links to filtered catalog.
 */
export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('category')
                    .eq('is_active', true);

                if (error) throw error;

                // Count products per category
                const counts = {};
                (data || []).forEach(p => {
                    if (p.category) {
                        counts[p.category] = (counts[p.category] || 0) + 1;
                    }
                });

                // Sort by count descending
                const sorted = Object.entries(counts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, count]) => ({ name, count }));

                setCategories(sorted);
            } catch {
                // Silently fail — section won't render
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8 mx-auto"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-28 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-blue text-center mb-8">
                    Nuestras Categorías
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {categories.map(cat => {
                        const meta = categoryMeta[cat.name] || fallback;
                        return (
                            <Link
                                key={cat.name}
                                to={`/catalogo?category=${encodeURIComponent(cat.name)}`}
                                className={`${meta.color} border rounded-xl p-5 flex flex-col items-center text-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group`}
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform">{meta.icon}</span>
                                <span className="text-sm font-bold text-soft-black">{cat.name}</span>
                                <span className="text-xs text-gray-500 font-medium">
                                    {cat.count} {cat.count === 1 ? 'producto' : 'productos'}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
