/**
 * Navbar 2.0 Component
 * @description
 * Header de Lujo con Top Announcement Bar (Tasa BCV en vivo + Envío Gratis + Rastrear Pedido),
 * Navegación limpia y Carrito interactivo.
 */

import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { ShoppingCart, Truck } from 'lucide-react';

export default function Navbar() {
    const { setIsCartOpen, cartCount } = useCart();
    const { exchangeRate } = useCurrency();

    return (
        <header className="sticky top-0 z-50 shadow-md">
            {/* Top Announcement Bar - High Contrast */}
            <div className="bg-[#0A2463] text-white text-xs py-2.5 px-4 border-b border-white/15">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                    {/* BCV Live & Free Shipping */}
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Tasa BCV: {exchangeRate ? `Bs. ${exchangeRate.toFixed(2)}` : 'Cargando...'}
                        </span>
                        <span className="hidden sm:inline text-white/40">•</span>
                        <span className="hidden sm:inline text-white font-medium">
                            🚚 <strong className="text-amber-300 font-bold">Envío GRATIS</strong> a toda Venezuela · Pagas al Recibir
                        </span>
                    </div>

                    {/* Quick Tracking Link */}
                    <div className="flex items-center gap-4 ml-auto text-xs">
                        <Link
                            to="/rastreo"
                            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded-xl transition-all border border-white/20"
                        >
                            <Truck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Rastrear Pedido</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white/95 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-gray-100 gap-4">
                {/* Brand Logo */}
                <div className="flex items-center min-w-0">
                    <Link to="/" className="hover:opacity-90 transition-opacity">
                        <div style={{ width: '155px' }}>
                            <Logo className="w-full h-auto" />
                        </div>
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-gray-800 font-bold text-sm hover:text-brand-red transition-colors">
                        Inicio
                    </Link>
                    <Link to="/catalogo" className="text-gray-800 font-bold text-sm hover:text-brand-red transition-colors">
                        Catálogo
                    </Link>
                    <Link to="/rastreo" className="text-gray-800 font-bold text-sm hover:text-brand-red transition-colors flex items-center gap-1">
                        <span>Rastreo</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-brand-red/10 text-brand-red">VIVO</span>
                    </Link>
                    <a
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '584124340546'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 font-bold text-sm hover:text-brand-red transition-colors"
                    >
                        Soporte
                    </a>
                </div>

                {/* Right Actions: Cart + Catalog CTA */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2.5 text-brand-navy hover:bg-gray-100 rounded-2xl transition-all"
                        aria-label="Abrir Carrito"
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-brand-red text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-md shadow-brand-red/40 animate-scaleIn">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <Link
                        to="/catalogo"
                        className="bg-brand-red text-white px-5 h-[42px] flex items-center justify-center rounded-2xl text-xs md:text-sm font-extrabold shadow-lg shadow-brand-red/25 hover:bg-brand-red/90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </nav>
        </header>
    );
}
