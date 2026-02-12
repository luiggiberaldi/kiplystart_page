/**
 * ProductCard Component
 * @description
 * Individual product display card with risk-reversal CTA.
 * Links to product detail page where user can choose bundles and add to cart.
 * 
 * Brain Validation (Product Bible 2026):
 * - ✅ Von Restorff: Green CTA button (risk-reversal)
 * - ✅ Touch target: botón 48px mínimo
 * - ✅ CTA: Risk-reversal copy "Ver · Pagas al Recibir"
 */

import { Link } from 'react-router-dom';
import PriceDual from './PriceDual';

export default function ProductCard({ product, loading = false }) {

    // Skeleton Loading State
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="bg-gray-300 h-48 w-full rounded mb-4"></div>
                <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 h-6 w-1/2 rounded mb-4"></div>
                <div className="bg-gray-400 h-10 w-full rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col h-full group">
            <Link to={`/producto/${product.slug || product.id}`} className="block flex-1 flex flex-col">
                <div className="aspect-square bg-[#D1D5DB] rounded-lg mb-4 overflow-hidden relative">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            width="300"
                            height="300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">📦</span>
                        </div>
                    )}
                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-warning/90 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            Quedan {product.stock}
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-soft-black text-sm font-bold px-4 py-2 rounded-full">Agotado</span>
                        </div>
                    )}
                </div>

                <div className="flex-grow">
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-soft-black leading-tight mb-1 font-display line-clamp-2 group-hover:text-brand-blue transition-colors">
                        {product.name}
                    </h3>
                    <PriceDual amount={product.price} size="sm" />
                    <p className="text-xs text-gray-500 mb-2">
                        Envío Gratis · Tasa BCV
                    </p>
                </div>

                <div
                    className="w-full min-h-[40px] sm:min-h-[48px] py-1.5 bg-green-600 group-hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center mt-auto active:scale-[0.98] shadow-md shadow-green-600/20 px-2 gap-1"
                    aria-label={`Ver ${product.name}`}
                >
                    <span className="material-symbols-outlined text-[14px] sm:text-[18px]">shopping_cart_checkout</span>
                    <span className="flex flex-col sm:flex-row sm:gap-1 items-center leading-tight">
                        <span className="text-[11px] sm:text-sm">Pedir ·</span>
                        <span className="text-[10px] sm:text-sm font-semibold">Pagas al Recibir</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}
