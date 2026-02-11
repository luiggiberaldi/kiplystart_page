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
 * - VideoHero Section
 * - TrustBar (consolidated component)
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
                .eq('featured', true)
                .limit(4)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFeaturedProducts(data || []);
        } catch {
            // Silently handle error — products section will show empty state
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

                {/* TrustBar (Consolidated Component - "1. Pides → 2. Recibes → 3. Pagas") */}
                <section className="px-6 py-8">
                    <TrustBar />
                </section>

                {/* Product Preview */}
                <section className="px-6 py-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-brand-blue text-[24px] md:text-[28px] font-extrabold tracking-tight">
                            Productos Destacados
                        </h2>
                        <Link to="/catalogo" className="text-steel-blue text-sm font-bold hover:underline shrink-0">
                            Ver todos →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-white rounded-lg h-80 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 bg-white rounded-xl">
                                    <span className="text-4xl">📦</span>
                                    <p className="text-gray-500 mt-2">No hay productos destacados por ahora.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
