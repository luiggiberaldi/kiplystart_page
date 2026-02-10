import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

/**
 * Catalogo View
 * @description
 * Product catalog with functional category filter.
 * Features:
 * - Mobile-first grid (2 columns)
 * - Premium Skeleton Loading
 * - Category filtering
 * - Responsive bottom nav
 */
export default function Catalogo() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PRODUCTS_PER_PAGE = 8;

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, page]);

    async function fetchProducts() {
        try {
            setLoading(true);

            let query = supabase
                .from('products')
                .select('*', { count: 'exact' })
                .eq('is_active', true);

            if (selectedCategory !== 'Todas') {
                query = query.eq('category', selectedCategory);
            }

            const from = (page - 1) * PRODUCTS_PER_PAGE;
            const to = from + PRODUCTS_PER_PAGE - 1;

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            setProducts(data || []);
            setTotalCount(count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const [categories, setCategories] = useState(['Todas']);

    // Fetch all distinct categories from DB on mount
    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase
                .from('products')
                .select('category')
                .eq('is_active', true)
                .not('category', 'is', null);
            if (data) {
                const unique = [...new Set(data.map(p => p.category))].sort();
                setCategories(['Todas', ...unique]);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div className="bg-background-light text-soft-black min-h-screen font-display">
            <Navbar />

            <main className="max-w-screen-xl mx-auto pb-24 md:pb-12">
                {/* Header & Filter Section */}
                <div className="px-4 pt-8 pb-4">
                    <h1 className="text-brand-blue text-[28px] md:text-[32px] font-bold leading-tight mb-6">
                        Catálogo de Productos
                    </h1>
                    {categories.length > 1 && (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="category-filter" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Categoría
                            </label>
                            <div className="relative max-w-xs">
                                <select
                                    id="category-filter"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setPage(1); // Reset to page 1 when category changes
                                    }}
                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm font-medium"
                                    aria-label="Filtrar por categoría"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined">expand_more</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="mx-4 bg-red-50 border border-brand-red p-4 mb-8 rounded-lg" role="alert">
                        <p className="text-brand-red font-bold text-sm">Error cargando productos: {error}</p>
                    </div>
                )}

                {/* Loading State - Skeleton */}
                {loading && (
                    <div className="px-4 py-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Cargando productos...</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-[48px] bg-gray-100 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {products.length === 0 && (
                                <div className="col-span-full text-center py-20">
                                    <span className="text-4xl">📦</span>
                                    <p className="text-gray-500 mt-2">
                                        {selectedCategory !== 'Todas'
                                            ? `No hay productos en la categoría "${selectedCategory}".`
                                            : 'No hay productos disponibles.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalCount > PRODUCTS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-4 py-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Anterior
                                </button>
                                <span className="text-sm text-gray-600 font-medium">
                                    Página {page} de {Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
                                </span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * PRODUCTS_PER_PAGE >= totalCount}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom Navigation Bar - Mobile Only */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 md:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }} aria-label="Navegación inferior">
                <Link to="/catalogo" className="flex flex-col items-center gap-1 text-brand-blue">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="text-[10px] font-bold">Catálogo</span>
                </Link>
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-blue transition-colors">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-medium">Inicio</span>
                </Link>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567'}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#25D366] transition-colors">
                    <span className="material-symbols-outlined">chat</span>
                    <span className="text-[10px] font-medium">WhatsApp</span>
                </a>
            </nav>
        </div>
    );
}
