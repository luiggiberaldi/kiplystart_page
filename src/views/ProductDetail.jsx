import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CODModal from '../components/CODModal';
import PriceDual from '../components/PriceDual';
import ProductImageGallery from '../components/product/ProductImageGallery';
import BundleSelector from '../components/product/BundleSelector';
import ProductDescription from '../components/ProductDescription';
import TrustBarSticky from '../components/TrustBarSticky';
import PASBlock from '../components/PASBlock';
import SocialProofChat from '../components/social/SocialProofChat';
import TrustBadges from '../components/social/TrustBadges';
import { useCart } from '../context/CartContext';
import { getSocialProof } from '../data/socialProofData';

/**
 * ProductDetail View (High Conversion - Enhanced)
 * @description
 * Optimized with urgency triggers, dynamic bundles from DB, and direct COD modal.
 * Now reads bundle_2_discount, bundle_3_discount, compare_at_price, additional_images from Supabase.
 * Cart integration: adds product to cart from the sticky bottom bar.
 */
export default function ProductDetail() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const socialProof = product ? getSocialProof(product.slug) : null;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [showSpecs, setShowSpecs] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Marketing State
    const [viewersCount, setViewersCount] = useState(24);
    const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
    const [selectedBundle, setSelectedBundle] = useState(1);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
        setViewersCount(Math.floor(Math.random() * (45 - 18 + 1)) + 18);

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s === 0) {
                    if (prev.m === 0) return { m: 15, s: 0 };
                    return { m: prev.m - 1, s: 59 };
                }
                return { m: prev.m, s: prev.s - 1 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [slug]);

    // Load TikTok Embed Script
    useEffect(() => {
        if (!product?.tiktok_url) return;

        const scriptId = 'tiktok-embed-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [product]);

    // SEO Meta Tags - Dynamic updates based on product data
    useEffect(() => {
        if (!product) return;

        // Update page title
        document.title = `${product.name} - KiplyStart`;

        // Helper function to update or create meta tags (FIXED: proper attribute handling)
        const updateMetaTag = (name, content, isProperty = false) => {
            const attr = isProperty ? 'property' : 'name';
            const selector = `meta[${attr}="${name}"]`;

            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Meta Description (optimized for SEO)
        const metaDescription = `${product.name.slice(0, 60)}. Instalación 3 min sin mecánico. Envío gratis Venezuela ✓ Garantía 3 meses`;
        updateMetaTag('description', metaDescription);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = `https://kiplystart.com/producto/${product.slug || slug}`;

        // Open Graph Tags (use isProperty = true)
        updateMetaTag('og:type', 'product', true);
        updateMetaTag('og:title', product.name, true);
        updateMetaTag('og:description', metaDescription, true);
        updateMetaTag('og:image', product.image_url || 'https://kiplystart.com/default-product.jpg', true);
        updateMetaTag('og:url', `https://kiplystart.com/producto/${product.slug || slug}`, true);
        updateMetaTag('og:site_name', 'KiplyStart', true);
        updateMetaTag('og:locale', 'es_VE', true);

        // Twitter Card
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', product.name);
        updateMetaTag('twitter:description', metaDescription);
        updateMetaTag('twitter:image', product.image_url || 'https://kiplystart.com/default-product.jpg');

        // Schema.org JSON-LD for Product
        let schemaScript = document.querySelector('script[type="application/ld+json"]#product-schema');
        if (!schemaScript) {
            schemaScript = document.createElement('script');
            schemaScript.type = 'application/ld+json';
            schemaScript.id = 'product-schema';
            document.head.appendChild(schemaScript);
        }

        // Check stock: if stock_quantity exists and > 0, it's in stock
        const isInStock = product.stock_quantity ? product.stock_quantity > 0 : true;

        const schemaData = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.image_url || 'https://kiplystart.com/default-product.jpg',
            "description": metaDescription,
            "brand": {
                "@type": "Brand",
                "name": "KiplyStart"
            },
            "offers": {
                "@type": "Offer",
                "url": `https://kiplystart.com/producto/${product.slug || slug}`,
                "priceCurrency": "USD",
                "price": product.price?.toString() || "0",
                "priceValidUntil": "2026-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "availability": isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "KiplyStart"
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
            }
        };

        schemaScript.textContent = JSON.stringify(schemaData);

        // Cleanup function to reset title on unmount
        return () => {
            document.title = 'KiplyStart - Accesorios Premium para Auto';
        };
    }, [product, slug]);

    async function fetchProduct() {
        try {
            setLoading(true);
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
            const column = isUUID ? 'id' : 'slug';
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq(column, slug)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getPrice = (bundle = selectedBundle) => {
        if (!product) return 0;
        const basePrice = product.price;
        const isQuantity = product.bundle_type === 'quantity';

        if (isQuantity) {
            // Quantity mode: buy 2 get 1 free → pay for 2, receive 3
            if (bundle === 3) return Math.ceil(basePrice * 2);
            return basePrice;
        }

        // Discount mode (default)
        const discount2 = product.bundle_2_discount || 10;
        const discount3 = product.bundle_3_discount || 20;

        if (bundle === 2) return Math.ceil((basePrice * 2) * (1 - discount2 / 100));
        if (bundle === 3) return Math.ceil((basePrice * 3) * (1 - discount3 / 100));
        return basePrice;
    };

    const getSavings = (bundle) => {
        if (!product) return 0;
        const basePrice = product.price;
        const bundlePrice = getPrice(bundle);
        return (basePrice * bundle) - bundlePrice;
    };

    const handleAddToCart = () => {
        if (!product) return;
        const bundleSize = selectedBundle;
        const bundleTotal = getPrice(bundleSize);
        const isQuantity = product.bundle_type === 'quantity';
        const discount2 = product.bundle_2_discount || 10;
        const discount3 = product.bundle_3_discount || 20;
        const discountPct = isQuantity
            ? (bundleSize === 3 ? Math.round((1 / 3) * 100) : 0)
            : (bundleSize === 3 ? discount3 : bundleSize === 2 ? discount2 : 0);
        addToCart(product, bundleSize, { bundleSize, bundleTotal, discountPct, bundleType: product.bundle_type || 'discount' });
    };

    const allImages = product ? [
        product.image_url,
        ...(product.additional_images || [])
    ].filter(Boolean) : [];

    if (loading) return (
        <div className="min-h-screen bg-background-light flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold text-brand-red mb-4">Producto no encontrado</h2>
            <Link to="/catalogo" className="text-brand-blue underline">Volver al catálogo</Link>
        </div>
    );

    return (
        <div className="bg-background-light min-h-screen flex flex-col pb-36 font-body relative">
            {/* Trust Bar - Product Bible 2026 Standard */}
            <TrustBarSticky />

            <header className="bg-white border-b border-gray-100 sticky top-[38px] z-30">
                <div className="flex items-center p-3 md:p-4 justify-between max-w-md mx-auto md:max-w-4xl gap-1">
                    <Link to="/catalogo" className="text-brand-blue flex size-9 md:size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                    </Link>
                    <h2 className="text-brand-blue text-sm md:text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display truncate px-1">
                        {product.name}
                    </h2>
                    <div className="flex size-9 md:w-10 items-center justify-end shrink-0">
                        <button className="text-brand-blue hover:text-brand-red transition-colors"
                            onClick={async () => {
                                const url = window.location.href;
                                const text = `${product.name} — ${url}`;
                                if (navigator.share) {
                                    try { await navigator.share({ title: product.name, url }); } catch { }
                                } else {
                                    await navigator.clipboard.writeText(text);
                                    alert('¡Enlace copiado!');
                                }
                            }}>
                            <span className="material-symbols-outlined text-[22px]">share</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto md:max-w-4xl w-full">
                <nav className="px-4 py-3 hidden md:block">
                    <p className="text-steel-blue text-[14px] font-normal font-body">
                        <Link to="/" className="hover:underline">Inicio</Link> &gt; <Link to="/catalogo" className="hover:underline">Catálogo</Link> &gt; {product.name}
                    </p>
                </nav>

                <ProductImageGallery
                    allImages={allImages}
                    productName={product.name}
                    viewersCount={viewersCount}
                />

                <div className="p-4 md:p-8 space-y-5 md:space-y-6">
                    <div>
                        <h1 className="text-brand-blue text-[22px] md:text-[32px] font-bold leading-tight font-display mb-2">
                            {product.name}
                        </h1>
                        <div className="flex flex-col">
                            {product.compare_at_price && (
                                <span className="text-gray-400 text-xs md:text-sm line-through decoration-red-500 decoration-1 mb-0.5">
                                    ${product.compare_at_price.toFixed(2)}
                                </span>
                            )}
                            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <PriceDual amount={Math.ceil(product.price)} size="lg" showRate />
                                {product.compare_at_price && (
                                    <span className="bg-red-100 text-brand-red text-[10px] md:text-xs font-bold px-2 py-0.5 md:py-1 rounded">
                                        AHORRAS {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {product.stock !== null && (
                        <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 min-w-[60px] bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${product.stock <= (product.low_stock_threshold || 5) ? 'bg-brand-red animate-pulse' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min((product.stock / 30) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span className={`text-[11px] md:text-xs font-bold whitespace-nowrap ${product.stock <= (product.low_stock_threshold || 5) ? 'text-brand-red' : 'text-green-600'}`}>
                                {product.stock <= (product.low_stock_threshold || 5) ? '¡Pocas unidades!' : `${product.stock} disponibles`}
                            </span>
                        </div>
                    )}

                    {/* Trust Badges - Social Proof 2026 */}
                    <TrustBadges badges={socialProof.badges} />

                    <BundleSelector
                        product={product}
                        selectedBundle={selectedBundle}
                        onSelectBundle={setSelectedBundle}
                        getPrice={getPrice}
                        getSavings={getSavings}
                    />

                    <ProductDescription description={product.description} />



                    {/* Product Video Section - WebM/MP4 */}
                    {product.video_url && (
                        <div className="w-full my-6 flex justify-center">
                            <video
                                src={product.video_url}
                                className="rounded-xl shadow-lg w-auto max-w-full max-h-[80vh] object-contain"
                                controls
                                autoPlay
                                muted
                                playsInline
                                loop
                                preload="metadata"
                            >
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    )}

                    {/* PAS Block - Product Bible 2026 Standard */}
                    <PASBlock product={product} />

                    {/* Chat Simulation - Social Proof 2026 */}
                    <SocialProofChat messages={socialProof.chatMessages} />

                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-4">
                        <button
                            onClick={() => setShowSpecs(!showSpecs)}
                            className="flex items-center justify-between w-full text-steel-blue font-medium text-[16px] font-display"
                        >
                            <span>Ver especificaciones técnicas</span>
                            <span className={`material-symbols-outlined transform transition-transform ${showSpecs ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {showSpecs && (
                            <div className="mt-4 space-y-2 animate-fadeIn bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">SKU</span>
                                    <span className="font-medium text-soft-black">{product.sku || `KP-${product.id.toString().substring(0, 6).toUpperCase()}`}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Categoría</span>
                                    <span className="font-medium text-soft-black">{product.category || 'General'}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2">
                                    <span className="text-gray-500">Envío</span>
                                    <span className="font-medium text-soft-black">Nacional Gratis</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3 px-4 md:px-5 pb-8">
                    <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center shadow-sm">
                        <span className="material-symbols-outlined text-brand-blue mb-1 md:mb-2 text-[22px] md:text-[24px]">local_shipping</span>
                        <span className="text-[11px] md:text-xs font-bold text-gray-800 uppercase">Envío Gratis</span>
                        <span className="text-[10px] text-gray-500">A toda Venezuela</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center shadow-sm">
                        <span className="material-symbols-outlined text-brand-blue mb-1 md:mb-2 text-[22px] md:text-[24px]">workspace_premium</span>
                        <span className="text-[11px] md:text-xs font-bold text-gray-800 uppercase">Garantía Total</span>
                        <span className="text-[10px] text-gray-500">3 Meses Cobertura</span>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-3 md:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 animate-slideUp" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                <div className="max-w-md mx-auto md:max-w-4xl flex flex-col md:flex-row gap-1.5 md:gap-3 md:items-center">
                    <div className="hidden md:block flex-1">
                        <p className="font-bold text-brand-blue">{product.name}</p>
                        <p className="text-xs text-gray-500">Envío Gratis + Pago al Recibir</p>
                    </div>
                    <div className="flex flex-col items-center w-full md:w-auto">
                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-auto md:min-w-[300px] h-[46px] md:h-14 bg-green-600 hover:bg-green-700 text-white font-display font-bold text-[14px] md:text-[18px] rounded-xl flex items-center justify-center gap-1.5 md:gap-2 active:scale-[0.98] transition-all shadow-lg shadow-green-600/25 relative overflow-hidden px-3 md:px-4"
                        >
                            <span className="absolute inset-0 bg-white/20 animate-pulse-slow"></span>
                            <span className="material-symbols-outlined relative z-10 text-[18px] md:text-[20px]">shopping_cart</span>
                            <span className="relative z-10 truncate">Añadir al Carrito - ${Math.ceil(getPrice())}</span>
                        </button>
                        {/* Risk Reversal Microcopy - Product Bible 2026 */}
                        <p className="text-center text-gray-500 text-[10px] md:text-xs mt-1">
                            ✓ Añade varios artículos y paga al recibir
                        </p>
                    </div>
                </div>
            </div>

            <CODModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                quantity={1}
                totalPrice={getPrice()}
                selectedBundle={selectedBundle}
            />
        </div>
    );
}
