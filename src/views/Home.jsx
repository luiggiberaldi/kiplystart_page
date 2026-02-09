import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import VideoHero from '../components/VideoHero';
import TrustBar from '../components/TrustBar';
import { Link } from 'react-router-dom';

/**
 * Home View
 * @description
 * Landing page with cinematic scroll-animated hero.
 * Features:
 * - AnimatedHero Section with Canvas-based frame rendering
 * - Trust Bar (3-step process)
 * - Product Preview Grid (Dynamic from Supabase)
 */
const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    async function fetchFeaturedProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .limit(3)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFeaturedProducts(data || []);
        } catch (err) {
            console.error('Error fetching featured products:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-background-light text-soft-black font-display min-h-screen">
            <Navbar />

            {/* Hero Section (Video Scrollytelling) */}
            <VideoHero />

            <main className="max-w-md mx-auto md:max-w-7xl">

                {/* TrustBar (The 3-Step Process) */}
                <section className="px-6 py-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col items-center flex-1 text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                    <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                                </div>
                                <p className="text-xs font-bold text-brand-blue mt-1">1. Pides</p>
                            </div>
                            <div className="pt-4 text-gray-300">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                    <span className="material-symbols-outlined text-3xl">package_2</span>
                                </div>
                                <p className="text-xs font-bold text-brand-blue mt-1">2. Recibes</p>
                            </div>
                            <div className="pt-4 text-gray-300">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                    <span className="material-symbols-outlined text-3xl">payments</span>
                                </div>
                                <p className="text-xs font-bold text-brand-blue mt-1">3. Pagas</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Preview */}
                <section className="px-6 py-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-brand-blue text-[28px] font-extrabold tracking-tight">
                            Productos Destacados
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-lg h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-1 text-center py-10 bg-white rounded-xl">
                                    <span className="text-4xl">😔</span>
                                    <p className="text-gray-500 mt-2">No hay productos destacados por ahora.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <Link to="/catalogo" className="text-center text-brand-blue font-bold text-sm mt-4 hover:underline">
                        Ver todos los productos
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
