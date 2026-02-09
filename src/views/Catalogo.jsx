import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

/**
 * Catalogo View
 * @description
 * Product catalog verified by Stitch visual engine.
 * Features:
 * - Mobile-first grid (2 columns)
 * - Premium Skeleton Loading
 * - Bottom Navigation for interaction
 */
export default function Catalogo() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-background-light text-soft-black min-h-screen font-display">
            <Navbar />

            <main className="max-w-screen-xl mx-auto pb-20">
                {/* Header & Filter Section */}
                <div className="px-4 pt-8 pb-4">
                    <h2 className="text-brand-blue text-[32px] font-bold leading-tight mb-6">
                        Catálogo de Productos
                    </h2>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Categoría
                        </label>
                        <div className="relative max-w-xs">
                            <select className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm font-medium">
                                <option>Todas</option>
                                <option>Electrónica</option>
                                <option>Hogar</option>
                                <option>Accesorios</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mx-4 bg-red-50 border-1 border-brand-red p-4 mb-8 rounded-lg">
                        <p className="text-brand-red font-bold text-sm">Error cargando productos: {error}</p>
                    </div>
                )}

                {/* Loading State - Skeleton */}
                {loading && (
                    <div className="px-4 py-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">Cargando productos...</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
                                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                                    <div className="h-[44px] bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 gap-4 p-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-2 text-center py-20">
                                <span className="text-4xl">📦</span>
                                <p className="text-gray-500 mt-2">No hay productos disponibles.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Bottom Navigation Bar (iOS feel) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 md:hidden">
                <div className="flex flex-col items-center gap-1 text-brand-blue">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="text-[10px] font-bold">Catálogo</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined">search</span>
                    <span className="text-[10px] font-medium">Buscar</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    <span className="text-[10px] font-medium">Carrito</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-medium">Perfil</span>
                </div>
            </div>
        </div>
    );
}
