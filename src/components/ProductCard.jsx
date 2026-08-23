import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Flame, Sparkles, Package } from 'lucide-react';
import PriceDual from './PriceDual';

export default function ProductCard({ product, loading = false }) {
    // Skeleton Loading State
    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm animate-pulse flex flex-col h-full">
                <div className="bg-gray-200 aspect-square w-full rounded-2xl mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded-md mb-2"></div>
                <div className="bg-gray-200 h-6 w-1/2 rounded-md mb-4"></div>
                <div className="bg-gray-300 h-12 w-full rounded-2xl mt-auto"></div>
            </div>
        );
    }

    const isAvailable = product.stock > 0;

    return (
        <div className="bg-white rounded-3xl p-4 shadow-xs hover:shadow-2xl border border-gray-100 hover:border-gray-200/80 flex flex-col h-full group transition-all duration-300 transform hover:-translate-y-1">
            <Link to={`/producto/${product.slug || product.id}`} className="block flex-1 flex flex-col">
                {/* Image Container with Crisp Framing */}
                <div className="aspect-square bg-gradient-to-b from-gray-50/50 to-gray-100/70 rounded-2xl mb-4 overflow-hidden relative border border-gray-100/80 flex items-center justify-center p-3">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            width="320"
                            height="320"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-12 h-12" />
                        </div>
                    )}

                    {/* Low Stock Alert Badge */}
                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            <span>¡Solo {product.stock}!</span>
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-white text-gray-950 text-xs font-black px-4 py-2 rounded-full shadow-lg">
                                Agotado
                            </span>
                        </div>
                    )}

                    {/* Category Pill */}
                    {product.category && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-gray-800 text-[10px] font-extrabold px-3 py-1 rounded-xl shadow-xs border border-gray-200/60 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-brand-red" />
                            <span>{product.category}</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-grow flex flex-col mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#0A2463] transition-colors">
                        {product.name}
                    </h3>

                    <div className="mt-auto pt-2">
                        <PriceDual amount={product.price} size="sm" />
                        
                        <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-lg">
                                <Truck className="w-3 h-3" />
                                <span>Envío Gratis</span>
                            </span>
                            <span className="text-[11px] text-gray-500 font-semibold">
                                Pago Contra Entrega
                            </span>
                        </div>
                    </div>
                </div>

                {/* High Converting Action Button */}
                <div
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-2xl transition-all flex items-center justify-center shadow-md shadow-emerald-600/25 px-4 gap-2 mt-auto"
                    aria-label={`Pedir ${product.name}`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-xs sm:text-sm tracking-wide">
                        Pedir · <span className="font-black">Pagas al Recibir</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}
