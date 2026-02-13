import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoHero from '../components/VideoHero';
import TrustBar from '../components/TrustBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import WhatsAppFloat from '../components/WhatsAppFloat';

// Lazy-load below-the-fold sections for performance
const CategoryGrid = lazy(() => import('../components/CategoryGrid'));
const CODBanner = lazy(() => import('../components/CODBanner'));
const CategoryRow = lazy(() => import('../components/CategoryRow'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const CoverageSection = lazy(() => import('../components/CoverageSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));
const BrandStoryCTA = lazy(() => import('../components/BrandStoryCTA'));

/** Section loading fallback */
const SectionSkeleton = () => (
    <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6 mx-auto"></div>
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
    </div>
);

/**
 * Top category rows to display on the homepage.
 * Ordered by priority — only the top 3 categories are shown.
 */
const topCategories = [
    { name: 'Relojes', emoji: '⌚' },
    { name: 'Accesorios para Carros', emoji: '🚗' },
    { name: 'Belleza & Cuidado Personal', emoji: '💄' },
];

/**
 * Home View — Homepage 2.0
 * 12-section scroll layout optimized for conversion.
 * Mobile-first, lazy-loaded, animated.
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
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFeaturedProducts(data || []);
        } catch {
            // Silently handle — featured section shows empty state
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-background-light text-soft-black font-display min-h-screen">
            <Navbar />

            {/* 1. Hero Section (Video + Stats Bar) */}
            <VideoHero />

            <main className="max-w-md mx-auto md:max-w-7xl">

                {/* 2. TrustBar 2.0 — "Pides → Recibes → Pagas" + payment methods */}
                <section className="px-6 py-8">
                    <TrustBar />
                </section>

                {/* 3. Category Grid — Visual navigation */}
                <Suspense fallback={<SectionSkeleton />}>
                    <CategoryGrid />
                </Suspense>

                {/* 4. Featured Products Carousel */}
                <section className="px-6 py-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-brand-blue text-[24px] md:text-[28px] font-extrabold tracking-tight">
                            🔥 Productos Destacados
                        </h2>
                        <Link to="/catalogo" className="text-steel-blue text-sm font-bold hover:underline shrink-0">
                            Ver todos →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-white rounded-lg h-80 w-[72%] sm:w-[48%] md:w-[32%] lg:w-[24%] shrink-0 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <FeaturedCarousel products={featuredProducts} />
                    )}
                </section>

                {/* 5. COD Education Banner */}
                <Suspense fallback={<SectionSkeleton />}>
                    <CODBanner />
                </Suspense>

                {/* 6. Category Product Rows */}
                <Suspense fallback={<SectionSkeleton />}>
                    <section className="px-6 py-4">
                        {topCategories.map(cat => (
                            <CategoryRow key={cat.name} category={cat.name} emoji={cat.emoji} />
                        ))}
                    </section>
                </Suspense>

                {/* 7. Testimonials + Business Metrics */}
                <Suspense fallback={<SectionSkeleton />}>
                    <TestimonialsSection />
                </Suspense>

                {/* 8. Coverage Map */}
                <Suspense fallback={<SectionSkeleton />}>
                    <CoverageSection />
                </Suspense>

                {/* 9. FAQ — COD Questions */}
                <Suspense fallback={<SectionSkeleton />}>
                    <FAQSection />
                </Suspense>

                {/* 10. Brand Story CTA */}
                <Suspense fallback={<SectionSkeleton />}>
                    <BrandStoryCTA />
                </Suspense>

            </main>

            <Footer />

            {/* Floating WhatsApp CTA */}
            <WhatsAppFloat />
        </div>
    );
};

export default Home;
