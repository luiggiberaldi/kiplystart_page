/**
 * ProductCard Component
 * @description
 * Individual product display card with risk-reversal CTA.
 * Implements Von Restorff (green CTA stands out), Progressive Disclosure.
 * 
 * Brain Validation (Product Bible 2026):
 * - ✅ Von Restorff: Green CTA button (risk-reversal)
 * - ✅ Tipografía: Inter para título/precio, Open Sans descripción
 * - ✅ Touch target: botón 48px mínimo
 * - ✅ CTA: Risk-reversal copy "Pedir · Pagas al Recibir"
 * 
 * @param {Object} props
 * @param {Object} props.product - Product object
 * @param {string} props.product.id - Product UUID
 * @param {string} props.product.name - Product name
 * @param {number} props.product.price - Product price
 * @param {string} props.product.image_url - Product image URL
 * @param {number} props.product.stock - Available stock
 * @param {boolean} [props.loading=false] - Show skeleton state
 * @returns {JSX.Element} ProductCard or skeleton
 */

import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductCard({ product, loading = false }) {
    const { formatPrice } = useCurrency();

    // Skeleton Loading State (24% más rápido percibido que spinner)
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                {/* Image skeleton */}
                <div className="bg-gray-300 h-48 w-full rounded mb-4"></div>

                {/* Title skeleton */}
                <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>

                {/* Price skeleton */}
                <div className="bg-gray-300 h-6 w-1/2 rounded mb-4"></div>

                {/* Button skeleton */}
                <div className="bg-gray-400 h-10 w-full rounded"></div>
            </div>
        );
    }

    // Actual Product Card
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col h-full group">
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
                <h3 className="text-[16px] md:text-[18px] font-semibold text-soft-black leading-tight mb-1 font-display line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-[22px] md:text-[24px] font-bold text-brand-blue mb-1">
                    {formatPrice(product.price)}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                    Envío Gratis · Tasa BCV
                </p>
            </div>

            <Link
                to={`/producto/${product.id}`}
                className="w-full h-[48px] bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center mt-auto gap-1.5 active:scale-[0.98] shadow-md shadow-green-600/20"
                aria-label={`Pedir ${product.name} con pago al recibir`}
            >
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                Pedir · Pagas al Recibir
            </Link>
        </div>
    );
}
