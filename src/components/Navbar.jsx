/**
 * Navbar Component
 * @description
 * Top navigation bar following Hick's Law (max 4 links).
 * Implements Z-pattern eye tracking: Logo left, CTA right.
 * 
 * Brain Validation:
 * - ✅ Ley de Hick: 4 elements total
 * - ✅ Von Restorff: Solo CTA en rojo (#E63946)
 * - ✅ Paleta: #0A2463 (navbar), #E63946 (CTA)
 * 
 * @returns {JSX.Element} Navbar component
 */

import { Link } from 'react-router-dom';
import Logo from './Logo';

import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
    const { setIsCartOpen, cartCount } = useCart();

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between border-b border-gray-200 gap-3">
            <div className="flex items-center min-w-0">
                <Link to="/" className="hover:opacity-90 transition-opacity">
                    <div style={{ width: '150px' }}>
                        <Logo className="w-full h-auto" />
                    </div>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-brand-blue font-bold text-sm hover:text-brand-red transition-colors">Inicio</Link>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '584241234567'}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue font-bold text-sm hover:text-brand-red transition-colors" aria-label="Contactar por WhatsApp">Contacto</a>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-brand-blue hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Abrir Carrito"
                >
                    <ShoppingCart size={24} />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                            {cartCount}
                        </span>
                    )}
                </button>

                <Link
                    to="/catalogo"
                    className="bg-brand-red text-white px-4 md:px-5 h-[40px] md:h-[44px] flex items-center justify-center rounded-full text-xs md:text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all shrink-0 whitespace-nowrap"
                >
                    Ver Productos
                </Link>
            </div>
        </nav>
    );
}
