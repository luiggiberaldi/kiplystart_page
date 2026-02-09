import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CODModal from '../components/CODModal';
import ProductImageGallery from '../components/product/ProductImageGallery';
import BundleSelector from '../components/product/BundleSelector';

/**
 * ProductDetail View (High Conversion - Enhanced)
 * @description
 * Optimized with urgency triggers, dynamic bundles from DB, and direct COD modal.
 * Now reads bundle_2_discount, bundle_3_discount, compare_at_price, additional_images from Supabase.
 */
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
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
    }, [id]);

    async function fetchProduct() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
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
        const discount2 = product.bundle_2_discount || 10;
        const discount3 = product.bundle_3_discount || 20;

        if (bundle === 2) return (basePrice * 2) * (1 - discount2 / 100);
        if (bundle === 3) return (basePrice * 3) * (1 - discount3 / 100);
        return basePrice;
    };

    const getSavings = (bundle) => {
        if (!product) return 0;
        const basePrice = product.price;
        const discount2 = product.bundle_2_discount || 10;
        const discount3 = product.bundle_3_discount || 20;

        if (bundle === 2) return (basePrice * 2) - ((basePrice * 2) * (1 - discount2 / 100));
        if (bundle === 3) return (basePrice * 3) - ((basePrice * 3) * (1 - discount3 / 100));
        return 0;
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
        <div className="bg-background-light min-h-screen flex flex-col pb-32 font-body relative">
            <div className="bg-brand-blue text-white text-xs font-bold text-center py-2 px-4 sticky top-0 z-40 shadow-sm">
                🔥 ¡Oferta Flash! Termina en: <span className="font-mono text-yellow-300 text-sm ml-1">{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}</span>
            </div>

            <header className="bg-white border-b border-gray-100 sticky top-[32px] z-30">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto md:max-w-4xl">
                    <Link to="/catalogo" className="text-brand-blue flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h2 className="text-brand-blue text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display truncate px-2">
                        {product.name}
                    </h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="text-brand-blue hover:text-brand-red transition-colors">
                            <span className="material-symbols-outlined">share</span>
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

                <div className="p-5 md:p-8 space-y-6">
                    <div>
                        <h1 className="text-brand-blue text-[26px] md:text-[32px] font-bold leading-tight font-display mb-2">
                            {product.name}
                        </h1>
                        <div className="flex flex-col">
                            {product.compare_at_price && (
                                <span className="text-gray-400 text-sm line-through decoration-red-500 decoration-1 mb-0.5">
                                    ${product.compare_at_price.toFixed(2)}
                                </span>
                            )}
                            <div className="flex items-center gap-3">
                                <span className="text-brand-blue text-[32px] font-bold font-display">
                                    ${product.price.toFixed(2)}
                                </span>
                                {product.compare_at_price && (
                                    <span className="bg-red-100 text-brand-red text-xs font-bold px-2 py-1 rounded">
                                        AHORRAS {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {product.stock !== null && (
                        <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${product.stock <= (product.low_stock_threshold || 5) ? 'bg-brand-red animate-pulse' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min((product.stock / 30) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span className={`text-xs font-bold ${product.stock <= (product.low_stock_threshold || 5) ? 'text-brand-red' : 'text-green-600'}`}>
                                {product.stock <= (product.low_stock_threshold || 5) ? '¡Quedan pocas unidades!' : `${product.stock} disponibles`}
                            </span>
                        </div>
                    )}

                    <BundleSelector
                        product={product}
                        selectedBundle={selectedBundle}
                        onSelectBundle={setSelectedBundle}
                        getPrice={getPrice}
                        getSavings={getSavings}
                    />

                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-[#212529] text-[16px] leading-[1.6] font-body text-justify">
                            {product.description || "Descripción del producto no disponible."}
                        </p>
                    </div>

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

                <div className="grid grid-cols-2 gap-3 px-5 pb-8">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center shadow-sm">
                        <span className="material-symbols-outlined text-brand-blue mb-2">local_shipping</span>
                        <span className="text-xs font-bold text-gray-800 uppercase">Envío Gratis</span>
                        <span className="text-[10px] text-gray-500">A toda Venezuela</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center shadow-sm">
                        <span className="material-symbols-outlined text-brand-blue mb-2">workspace_premium</span>
                        <span className="text-xs font-bold text-gray-800 uppercase">Garantía Total</span>
                        <span className="text-[10px] text-gray-500">3 Meses de Cobertura</span>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 animate-slideUp">
                <div className="max-w-md mx-auto md:max-w-4xl flex gap-3 items-center">
                    <div className="hidden md:block flex-1">
                        <p className="font-bold text-brand-blue">{product.name}</p>
                        <p className="text-xs text-gray-500">Envío Gratis + Pago al Recibir</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto md:min-w-[300px] h-14 bg-brand-red text-white font-display font-bold text-[18px] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-brand-red/25 relative overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-white/20 animate-pulse-slow"></span>
                        <span className="material-symbols-outlined relative z-10">shopping_cart_checkout</span>
                        <span className="relative z-10">Comprar Ahora - ${getPrice().toFixed(2)}</span>
                    </button>
                    <div className="h-2 md:hidden"></div>
                </div>
            </div>

            <CODModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                quantity={selectedBundle}
                totalPrice={getPrice()}
                selectedBundle={selectedBundle}
            />
        </div>
    );
}
