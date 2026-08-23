import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Flame, Sparkles, Package, ShieldCheck } from 'lucide-react';
import PriceDual from './PriceDual';

export default function ProductCard({ product, loading = false }) {
    // Skeleton Loading State
    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm animate-pulse flex flex-col h-full">
                <div className="bg-gray-200 aspect-square w-full rounded-xl sm:rounded-2xl mb-3 sm:mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded-md mb-2"></div>
                <div className="bg-gray-200 h-6 w-1/2 rounded-md mb-3"></div>
                <div className="bg-gray-300 h-10 sm:h-12 w-full rounded-xl sm:rounded-2xl mt-auto"></div>
            </div>
        );
    }

    const isAvailable = product.stock > 0;

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs hover:shadow-2xl border border-gray-100 hover:border-gray-200/80 flex flex-col h-full group transition-all duration-300 transform hover:-translate-y-1">
            <Link to={`/producto/${product.slug || product.id}`} className="block flex-1 flex flex-col">
                {/* Image Container with Crisp Framing */}
                <div className="aspect-square bg-gradient-to-b from-gray-50/50 to-gray-100/70 rounded-xl sm:rounded-2xl mb-2.5 sm:mb-4 overflow-hidden relative border border-gray-100/80 flex items-center justify-center p-1.5 sm:p-3">
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
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500 text-white text-[9px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                            <Flame className="w-3 h-3 text-white" />
                            <span>¡Solo {product.stock}!</span>
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-10">
                            <span className="bg-white text-gray-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                                Agotado
                            </span>
                        </div>
                    )}

                    {/* Category Pill */}
                    {product.category && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 max-w-[80%] bg-white/95 backdrop-blur-md text-gray-800 text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-2xs border border-gray-200/70 flex items-center gap-1 z-10">
                            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-red shrink-0" />
                            <span className="truncate">{product.category}</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-grow flex flex-col mb-2.5 sm:mb-4">
                    <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 leading-snug mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-[#0A2463] transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    <div className="mt-auto pt-1 sm:pt-2">
                        <PriceDual amount={product.price} size="sm" />
                        
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                                <Truck className="w-3 h-3 shrink-0" />
                                <span>Envío Gratis</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                                <ShieldCheck className="w-3 h-3 text-[#0A2463] shrink-0" />
                                <span>Pagas al Recibir</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* High Converting Action Button */}
                <div
                    className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black rounded-xl sm:rounded-2xl transition-all flex items-center justify-center shadow-md shadow-emerald-600/25 px-2 gap-1.5 mt-auto cursor-pointer"
                    aria-label={`Pedir ${product.name}`}
                >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-black tracking-tight">
                        Pedir Ahora
                    </span>
                </div>
            </Link>
        </div>
    );
}
