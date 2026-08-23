/**
 * ProductCard 2.0 Component
 * @description
 * Tarjeta de producto de alta conversión con visualización de precio dual (USD / Bs BCV),
 * badge de categoría, stock en tiempo real y CTA persuasivo de Pago Contra Entrega.
 */

import { Link } from 'react-router-dom';
import PriceDual from './PriceDual';

export default function ProductCard({ product, loading = false }) {

    // Skeleton Loading State
    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm animate-pulse flex flex-col h-full">
                <div className="bg-gray-200 aspect-square w-full rounded-2xl mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded-md mb-2"></div>
                <div className="bg-gray-200 h-6 w-1/2 rounded-md mb-4"></div>
                <div className="bg-gray-300 h-11 w-full rounded-2xl mt-auto"></div>
            </div>
        );
    }

    const isAvailable = product.stock > 0;

    return (
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-sm hover:shadow-xl border border-gray-100/80 hover:border-brand-navy/10 flex flex-col h-full group transition-all duration-300">
            <Link to={`/producto/${product.slug || product.id}`} className="block flex-1 flex flex-col">
                {/* Image & Badges */}
                <div className="aspect-square bg-slate-100 rounded-2xl mb-3.5 overflow-hidden relative">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                            loading="lazy"
                            width="320"
                            height="320"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined text-4xl">inventory_2</span>
                        </div>
                    )}

                    {/* Stock Alert Badge */}
                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2.5 right-2.5 bg-amber-500/95 backdrop-blur text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                            ¡Solo {product.stock} disponibles!
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-white text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                                Agotado
                            </span>
                        </div>
                    )}

                    {/* Category Pill */}
                    {product.category && (
                        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-xs border border-white/50">
                            {product.category}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-grow flex flex-col mb-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-brand-navy transition-colors">
                        {product.name}
                    </h3>

                    <div className="mt-auto">
                        <PriceDual amount={product.price} size="sm" />
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                🚚 Envío Gratis
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                                Tasa BCV
                            </span>
                        </div>
                    </div>
                </div>

                {/* Risk-Reversal CTA Button */}
                <div
                    className="w-full h-[44px] sm:h-[48px] bg-emerald-600 group-hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-2xl transition-all flex items-center justify-center shadow-md shadow-emerald-600/20 px-3 gap-2 mt-auto"
                    aria-label={`Comprar ${product.name}`}
                >
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    <span className="text-xs sm:text-sm tracking-wide">
                        Pedir · <span className="font-bold">Pagas al Recibir</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}
