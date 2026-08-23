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
import { ShoppingCart, Truck, MapPin, ChevronRight } from 'lucide-react';

export default function Navbar() {
    const { setIsCartOpen, cartCount } = useCart();
    const { exchangeRate } = useCurrency();

    return (
        <header className="sticky top-0 z-50 shadow-md">
            {/* Top Announcement Bar - Sleek & Ultra-Professional */}
            <div className="bg-[#051329] text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    {/* Left: BCV Live Rate & Free Shipping Guarantee */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-2xs shrink-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Tasa BCV: {exchangeRate ? `Bs. ${exchangeRate.toFixed(2)}` : 'Cargando...'}</span>
                        </span>

                        <span className="hidden md:inline text-white/20">•</span>

                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium truncate">
                            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>
                                <strong className="text-white font-bold">Envío GRATIS</strong> a toda Venezuela · Pagas al Recibir
                            </span>
                        </span>
                    </div>

                    {/* Right: Satellite Tracking Pill Button */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to="/rastreo"
                            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold px-3 py-1 rounded-full text-[11px] transition-all border border-white/15 shadow-2xs hover:border-white/30"
                        >
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Rastrear Pedido</span>
                            <ChevronRight className="w-3 h-3 text-white/50 -ml-0.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white/95 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-gray-100 gap-4">
                {/* Brand Logo */}
                <div className="flex items-center min-w-0">
                    <Link to="/" className="hover:opacity-90 transition-opacity block">
                        <div className="w-[125px] sm:w-[155px]">
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
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 sm:p-2.5 text-brand-navy hover:bg-gray-100 rounded-2xl transition-all"
                        aria-label="Abrir Carrito"
                    >
                        <ShoppingCart size={21} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-brand-red text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-md shadow-brand-red/40 animate-scaleIn">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <Link
                        to="/catalogo"
                        className="bg-brand-red text-white px-3 sm:px-5 h-[38px] sm:h-[42px] flex items-center justify-center rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg shadow-brand-red/25 hover:bg-brand-red/90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
                    >
                        <span>Catálogo</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
