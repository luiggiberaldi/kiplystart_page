import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoHero from '../components/VideoHero';
import FeaturedCarousel from '../components/FeaturedCarousel';
import WhatsAppFloat from '../components/WhatsAppFloat';

// Neuromarketing & High Conversion Components
import ZeroRiskBanner from '../components/home/ZeroRiskBanner';
import FlashDealsSection from '../components/home/FlashDealsSection';
import CuratedBentoGrid from '../components/home/CuratedBentoGrid';
import DeliveryEstimator from '../components/home/DeliveryEstimator';

// Lazy-load below-the-fold sections for performance
const CategoryGrid = lazy(() => import('../components/CategoryGrid'));
const CategoryRow = lazy(() => import('../components/CategoryRow'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const CoverageSection = lazy(() => import('../components/CoverageSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));
const BrandStoryCTA = lazy(() => import('../components/BrandStoryCTA'));
const HomeTrackingBanner = lazy(() => import('../components/tracking/HomeTrackingBanner'));

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
    { name: 'Relojes & Accesorios', emoji: '⌚' },
    { name: 'Accesorios para Carros', emoji: '🚗' },
    { name: 'Belleza & Skincare', emoji: '✨' },
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
            let { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .eq('featured', true)
                .order('created_at', { ascending: false });

            // If fewer than 8 featured products, complement with recent active products to fill all columns
            if (!data || data.length < 8) {
                const { data: allActive } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(12);

                if (allActive) {
                    const existingIds = new Set((data || []).map(p => p.id));
                    const extra = allActive.filter(p => !existingIds.has(p.id));
                    data = [...(data || []), ...extra];
                }
            }

            if (error && (!data || data.length === 0)) throw error;
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

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 my-6 sm:my-10">

                {/* 2. Neuromarketing: Zero Risk Reversal Banner */}
                <section>
                    <ZeroRiskBanner />
                </section>

                {/* 3. Neuromarketing: 24h Flash Deals with Live Countdown */}
                <section>
                    <FlashDealsSection products={featuredProducts} />
                </section>

                {/* 4. Neuromarketing: Curated Bento Grid Collections */}
                <section>
                    <CuratedBentoGrid />
                </section>

                {/* 5. Featured Products Carousel */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black text-brand-red uppercase tracking-wider">
                                Preferidos por los Clientes
                            </span>
                            <h2 className="text-brand-blue text-[24px] md:text-[28px] font-extrabold tracking-tight">
                                🔥 Más Vendidos de la Semana
                            </h2>
                        </div>
                        <Link to="/catalogo" className="text-[#0A2463] text-sm font-extrabold hover:underline shrink-0">
                            Ver todos →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-white rounded-2xl h-80 w-[72%] sm:w-[48%] md:w-[32%] lg:w-[24%] shrink-0 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <FeaturedCarousel products={featuredProducts} />
                    )}
                </section>

                {/* 6. Interactive Delivery & Transit Estimator for Venezuela */}
                <section>
                    <DeliveryEstimator />
                </section>

                {/* 7. Category Grid — Visual navigation */}
                <Suspense fallback={<SectionSkeleton />}>
                    <CategoryGrid />
                </Suspense>

                {/* 8. Live Tracking Banner */}
                <Suspense fallback={<SectionSkeleton />}>
                    <HomeTrackingBanner />
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
