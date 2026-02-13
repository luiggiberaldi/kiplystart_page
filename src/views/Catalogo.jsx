import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Link, useSearchParams } from 'react-router-dom';

/**
 * Catalogo View
 * @description
 * Product catalog with search bar, category filter, and pagination.
 */
export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Always scroll to top on mount (fixes SPA navigation landing mid-page)
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || 'Todas'
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PRODUCTS_PER_PAGE = 8;
    const searchInputRef = useRef(null);

    // Debounce search input (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, debouncedSearch, page]);

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

            if (debouncedSearch) {
                query = query.ilike('name', `%${debouncedSearch}%`);
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

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar productos..."
                            className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-shadow shadow-sm"
                            aria-label="Buscar productos"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
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
                                        const cat = e.target.value;
                                        setSelectedCategory(cat);
                                        setPage(1);
                                        // Sync URL
                                        if (cat === 'Todas') {
                                            setSearchParams({});
                                        } else {
                                            setSearchParams({ category: cat });
                                        }
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
                                    <span className="text-4xl">{debouncedSearch ? '🔍' : '📦'}</span>
                                    <p className="text-gray-500 mt-2">
                                        {debouncedSearch
                                            ? `No se encontraron productos para "${debouncedSearch}".`
                                            : selectedCategory !== 'Todas'
                                                ? `No hay productos en la categoría "${selectedCategory}".`
                                                : 'No hay productos disponibles.'}
                                    </p>
                                    {debouncedSearch && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-3 text-brand-blue text-sm font-bold hover:underline"
                                        >
                                            Limpiar búsqueda
                                        </button>
                                    )}
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
