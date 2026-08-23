import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CODModal from '../components/CODModal';
import PriceDual from '../components/PriceDual';
import ProductImageGallery from '../components/product/ProductImageGallery';
import BundleSelector from '../components/product/BundleSelector';
import ProductDescription from '../components/ProductDescription';
import PASBlock from '../components/PASBlock';
import SocialProofChat from '../components/social/SocialProofChat';
import TrustBadges from '../components/social/TrustBadges';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getSocialProof } from '../data/socialProofData';
import { trackViewContent, trackAddToCart } from '../lib/fbPixelEvents';
import { 
    Truck, ShieldCheck, RotateCcw, Flame, CheckCircle2, 
    ShoppingBag, ShoppingCart, Share2, ChevronRight, 
    MessageCircle, Star, Sparkles, ChevronDown, Package, Check
} from 'lucide-react';

export default function ProductDetail() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { settings } = useSettings();
    const [product, setProduct] = useState(null);
    const socialProof = product ? getSocialProof(product.slug, product) : null;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [showSpecs, setShowSpecs] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // Marketing State
    const [viewersCount, setViewersCount] = useState(24);
    const [selectedBundle, setSelectedBundle] = useState(1);

    const handleShare = async () => {
        if (navigator.share) {
            try { 
                await navigator.share({ title: product?.name || 'KiplyStart', url: window.location.href }); 
                return;
            } catch {}
        }
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 3000);
        } catch {}
    };

    const fetchProduct = useCallback(async () => {
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
            trackViewContent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
        setViewersCount(Math.floor(Math.random() * (42 - 19 + 1)) + 19);
    }, [fetchProduct]);

    // SEO Meta Tags
    useEffect(() => {
        if (!product) return;
        document.title = `${product.name} — KiplyStart Venezuela`;
        return () => {
            document.title = 'KiplyStart — Tienda Online Oficial';
        };
    }, [product]);

    const discount2 = product?.bundle_2_discount ?? settings?.bundle_2_discount ?? 15;
    const discount3 = product?.bundle_3_discount ?? settings?.bundle_3_discount ?? 30;

    const getPrice = (bundle = selectedBundle) => {
        if (!product) return 0;
        const basePrice = product.price;
        const isQuantity = product.bundle_type === 'quantity';

        if (isQuantity) {
            if (bundle === 3) return Math.ceil(basePrice * 2);
            return basePrice;
        }

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
        const discountPct = isQuantity
            ? (bundleSize === 3 ? Math.round((1 / 3) * 100) : 0)
            : (bundleSize === 3 ? discount3 : bundleSize === 2 ? discount2 : 0);
        addToCart(product, bundleSize, { bundleSize, bundleTotal, discountPct, bundleType: product.bundle_type || 'discount' });
        trackAddToCart(product, bundleSize, bundleTotal);
    };

    const allImages = product ? [
        product.image_url,
        ...(product.additional_images || [])
    ].filter(Boolean) : [];

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-[#0A2463]/20 border-t-[#0A2463] rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-500">Cargando producto...</p>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <Package className="w-16 h-16 text-gray-300 mb-3" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Producto no encontrado</h2>
            <Link to="/catalogo" className="text-[#0A2463] font-bold underline">Volver al catálogo</Link>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col pb-36 font-sans text-gray-900">
            <Navbar />

            {/* Breadcrumb Bar */}
            <div className="bg-white border-b border-gray-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 overflow-hidden truncate">
                        <Link to="/" className="hover:text-[#0A2463] font-medium">Inicio</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Link to="/catalogo" className="hover:text-[#0A2463] font-medium">Catálogo</Link>
                        {product.category && (
                            <>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <Link to={`/catalogo?category=${encodeURIComponent(product.category)}`} className="hover:text-[#0A2463] font-medium hidden sm:inline">
                                    {product.category}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-bold text-gray-900 truncate">{product.name}</span>
                    </div>

                    <button
                        onClick={handleShare}
                        className={`p-1.5 px-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            copiedLink ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                        }`}
                        title="Compartir producto"
                    >
                        {copiedLink ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-600 animate-scaleIn" />
                                <span className="text-xs font-bold text-emerald-700">¡Enlace copiado!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline text-xs font-bold">Compartir</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* 2-Column Grid Layout for Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* Left Column: Gallery, Badges & Real WhatsApp Reviews */}
                    <div className="lg:col-span-7 space-y-6">
                        <ProductImageGallery
                            allImages={allImages}
                            productName={product.name}
                            viewersCount={viewersCount}
                        />

                        {/* Guarantee Badges */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 text-center flex flex-col items-center shadow-2xs">
                                <Truck className="w-6 h-6 text-emerald-600 mb-1.5" />
                                <span className="text-xs font-black text-gray-950">Envío Gratis</span>
                                <span className="text-[10px] text-gray-500">Toda Venezuela</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 text-center flex flex-col items-center shadow-2xs">
                                <ShieldCheck className="w-6 h-6 text-[#0A2463] mb-1.5" />
                                <span className="text-xs font-black text-gray-950">Pagas al Recibir</span>
                                <span className="text-[10px] text-gray-500">Sin anticipos</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 text-center flex flex-col items-center shadow-2xs">
                                <RotateCcw className="w-6 h-6 text-amber-600 mb-1.5" />
                                <span className="text-xs font-black text-gray-950">Garantía Total</span>
                                <span className="text-[10px] text-gray-500">Revisión previa</span>
                            </div>
                        </div>

                        {/* Video Section if available */}
                        {product.video_url && (
                            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs">
                                <h3 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-brand-red" />
                                    <span>Demostración del Producto en Video</span>
                                </h3>
                                <video
                                    src={product.video_url}
                                    className="rounded-2xl w-full max-h-[500px] object-contain bg-black"
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    loop
                                />
                            </div>
                        )}

                        {/* Social Proof Chat / Real WhatsApp Testimonials on Left Column */}
                        {socialProof && <SocialProofChat messages={socialProof.chatMessages} />}
                    </div>

                    {/* Right Column: Pricing, Bundles, and Fast Checkout */}
                    <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-lg sticky top-24">
                        {/* Title & Category Badge */}
                        <div>
                            {product.category && (
                                <span className="inline-block bg-slate-100 text-[#0A2463] text-[11px] font-extrabold px-3 py-1 rounded-xl mb-2.5 border border-slate-200">
                                    {product.category}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-snug">
                                {product.name}
                            </h1>

                            {/* Ratings Bar */}
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <span className="text-xs font-extrabold text-gray-800">4.9</span>
                                <span className="text-xs text-gray-400 font-medium">(142 reseñas verificadas)</span>
                            </div>
                        </div>

                        {/* Price & Savings Block */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                            {product.compare_at_price && (
                                <span className="text-gray-400 text-xs font-semibold line-through decoration-red-500 decoration-1 block mb-1">
                                    Precio regular: ${product.compare_at_price.toFixed(2)} USD
                                </span>
                            )}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <PriceDual amount={getPrice()} size="md" showRate />
                                {product.compare_at_price && (
                                    <span className="bg-brand-red text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                                        AHORRAS {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stock Urgency Bar */}
                        {product.stock !== null && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 text-brand-red" />
                                        Disponibilidad en Bodega:
                                    </span>
                                    <span className={product.stock <= 5 ? 'text-brand-red font-black' : 'text-emerald-700'}>
                                        {product.stock <= 5 ? `¡Solo quedan ${product.stock} unidades!` : `${product.stock} disponibles`}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${product.stock <= 5 ? 'bg-brand-red animate-pulse' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min((product.stock / 25) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Bundle Selector */}
                        <BundleSelector
                            product={product}
                            selectedBundle={selectedBundle}
                            onSelectBundle={setSelectedBundle}
                            getPrice={getPrice}
                            getSavings={getSavings}
                            discount2={discount2}
                            discount3={discount3}
                        />

                        {/* Desktop Fast Actions */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span>PEDIR AHORA · ${getPrice()} (Pagas al Recibir)</span>
                            </button>

                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    onClick={handleAddToCart}
                                    className="h-12 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-900 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Al Carrito</span>
                                </button>
                                <a
                                    href={`https://wa.me/584124340546?text=${encodeURIComponent(`Hola KiplyStart, tengo una pregunta sobre: ${product.name}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all border border-emerald-200/80"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Consultar</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Trust Reassurance */}
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Envío 100% Gratis a toda Venezuela</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                <ShieldCheck className="w-4 h-4 text-[#0A2463] shrink-0" />
                                <span>Pagas al Recibir en Efectivo o Pago Móvil (Tasa BCV)</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Garantía de Satisfacción: Revisas al llegar</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Section: Copywriting, PAS Block & Tech Specs */}
                <div className="mt-12 max-w-4xl mx-auto space-y-10">
                    <ProductDescription description={product.description} />
                    <PASBlock product={product} />

                    {/* Technical Specs Accordion */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                        <button
                            onClick={() => setShowSpecs(!showSpecs)}
                            className="flex items-center justify-between w-full text-gray-900 font-extrabold text-base cursor-pointer"
                        >
                            <span>Especificaciones Técnicas y Garantía</span>
                            <ChevronDown className={`w-5 h-5 transform transition-transform ${showSpecs ? 'rotate-180' : ''}`} />
                        </button>

                        {showSpecs && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-xs sm:text-sm animate-fadeIn">
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500 font-medium">Código / SKU</span>
                                    <span className="font-bold text-gray-900">{product.sku || `KP-${product.id.toString().substring(0, 8).toUpperCase()}`}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500 font-medium">Categoría Oficial</span>
                                    <span className="font-bold text-gray-900">{product.category || 'General'}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500 font-medium">Tipo de Envío</span>
                                    <span className="font-bold text-emerald-700">Nacional Express Gratuito</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-500 font-medium">Modalidad de Pago</span>
                                    <span className="font-bold text-gray-900">Contra Entrega (Efectivo / Pago Móvil / Tasa BCV)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Mobile Sticky Buy Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-3 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] border-t border-gray-200 z-50 animate-slideUp md:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                <div className="max-w-md mx-auto flex items-center gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-900 font-bold rounded-2xl flex items-center justify-center shrink-0"
                        title="Añadir al Carrito"
                        aria-label="Añadir al Carrito"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 px-3"
                    >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">PEDIR AHORA · ${getPrice()} (Pagas al Recibir)</span>
                    </button>
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
