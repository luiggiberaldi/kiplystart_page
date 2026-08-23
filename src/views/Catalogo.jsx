import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Link, useSearchParams } from 'react-router-dom';
import { 
    Search, X, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight, 
    PackageOpen, Home, Grid, MessageCircle, Car, Heart, Watch, 
    Smartphone, HeartPulse, ShoppingBag, Scissors, Smile, Tag 
} from 'lucide-react';

const getCategoryIcon = (categoryName, isActive) => {
    const name = categoryName.toLowerCase();
    const iconClass = `w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`;

    if (name === 'todas') return <Sparkles className={`${iconClass} text-amber-400`} />;
    if (name.includes('carro') || name.includes('auto') || name.includes('vehicul')) return <Car className={`${iconClass} ${isActive ? 'text-white' : 'text-blue-600'}`} />;
    if (name.includes('belleza') || name.includes('skin')) return <Heart className={`${iconClass} ${isActive ? 'text-white' : 'text-pink-500'}`} />;
    if (name.includes('reloj')) return <Watch className={`${iconClass} ${isActive ? 'text-white' : 'text-amber-600'}`} />;
    if (name.includes('tecno') || name.includes('gadget')) return <Smartphone className={`${iconClass} ${isActive ? 'text-white' : 'text-indigo-600'}`} />;
    if (name.includes('salud') || name.includes('bienestar')) return <HeartPulse className={`${iconClass} ${isActive ? 'text-white' : 'text-emerald-600'}`} />;
    if (name.includes('hogar')) return <Home className={`${iconClass} ${isActive ? 'text-white' : 'text-orange-500'}`} />;
    if (name.includes('bolso') || name.includes('moda') || name.includes('ropa')) return <ShoppingBag className={`${iconClass} ${isActive ? 'text-white' : 'text-purple-600'}`} />;
    if (name.includes('capilar') || name.includes('cabello')) return <Scissors className={`${iconClass} ${isActive ? 'text-white' : 'text-rose-500'}`} />;
    if (name.includes('bebé') || name.includes('bebe') || name.includes('niño')) return <Smile className={`${iconClass} ${isActive ? 'text-white' : 'text-cyan-500'}`} />;
    
    return <Tag className={`${iconClass} ${isActive ? 'text-white' : 'text-gray-500'}`} />;
};

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();

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
    const PRODUCTS_PER_PAGE = 12;
    const searchInputRef = useRef(null);

    // Debounce search input (250ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
            setPage(1);
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('products')
                .select('*', { count: 'exact' })
                .eq('is_active', true);

            if (selectedCategory && selectedCategory !== 'Todas') {
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
    }, [selectedCategory, debouncedSearch, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setPage(1);
        if (cat === 'Todas') {
            setSearchParams({});
        } else {
            setSearchParams({ category: cat });
        }
    };

    return (
        <div className="bg-slate-50 text-gray-900 min-h-screen font-sans flex flex-col">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {/* Header Title & Subtitle */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-black text-brand-red uppercase tracking-wider">
                                Catálogo Exclusivo KiplyStart
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mt-0.5">
                                Todos Nuestros Productos
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {totalCount} artículos verificados con Pago Contra Entrega a Tasa BCV Oficial
                            </p>
                        </div>

                        {/* Fast Search Input */}
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar en el catálogo..."
                                className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-10 pr-10 py-2.5 text-sm font-semibold text-gray-950 placeholder:text-gray-400 focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/10 outline-none transition-all shadow-xs"
                                aria-label="Buscar productos"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
                                    aria-label="Limpiar búsqueda"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Interactive Category Filter Pills (Mobile Horizontal Scroll / Desktop Wrap) */}
                    {categories.length > 1 && (
                        <div className="mt-5 overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-2.5 sm:flex-wrap py-2 px-0.5 snap-x scroll-smooth">
                            {categories.map(cat => {
                                const isActive = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap shrink-0 transition-all flex items-center gap-2 cursor-pointer snap-start ${
                                            isActive
                                                ? 'bg-[#0A2463] text-white shadow-lg shadow-[#0A2463]/25 scale-102 ring-2 ring-[#0A2463]/30'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/90 shadow-2xs hover:border-gray-300'
                                        }`}
                                    >
                                        {getCategoryIcon(cat, isActive)}
                                        <span>{cat}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 mb-8 rounded-2xl font-semibold text-sm">
                        Error cargando productos: {error}
                    </div>
                )}

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse border border-gray-100">
                                <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-12 bg-gray-200 rounded-2xl mt-auto"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Empty Search State */}
                        {products.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto shadow-sm">
                                <PackageOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-900">No encontramos productos</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {debouncedSearch
                                        ? `No hay coincidencias para "${debouncedSearch}".`
                                        : `No hay productos disponibles en "${selectedCategory}".`}
                                </p>
                                {debouncedSearch && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 px-4 py-2 bg-[#0A2463] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalCount > PRODUCTS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-3 py-12">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Anterior</span>
                                </button>
                                <span className="text-xs sm:text-sm text-gray-700 font-extrabold px-3 py-1 bg-white border border-gray-200 rounded-xl shadow-2xs">
                                    Página {page} de {Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
                                </span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * PRODUCTS_PER_PAGE >= totalCount}
                                    className="p-2.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                    <span className="hidden sm:inline">Siguiente</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />

            {/* Bottom Mobile Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-2.5 flex justify-around items-center z-40 md:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                <Link to="/catalogo" className="flex flex-col items-center gap-1 text-[#0A2463]">
                    <Grid className="w-5 h-5" />
                    <span className="text-[10px] font-extrabold">Catálogo</span>
                </Link>
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0A2463]">
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Inicio</span>
                </Link>
                <a href="https://wa.me/584124340546" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-medium">WhatsApp</span>
                </a>
            </nav>
        </div>
    );
}
