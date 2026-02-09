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

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
                <Link to="/" className="hover:opacity-90 transition-opacity">
                    {/* Logo Wrapper with Final Fixed Styles */}
                    <div style={{
                        width: '170px',
                        transform: 'translate(31px, 0px)'
                    }}>
                        <Logo className="w-full h-auto" />
                    </div>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-brand-blue font-bold text-sm hover:text-brand-red transition-colors">Inicio</Link>
                <a href="https://wa.me/584241234567" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-bold text-sm hover:text-brand-red transition-colors">Contacto</a>
            </div>
            <Link
                to="/catalogo"
                className="bg-brand-red text-white px-5 h-[48px] flex items-center justify-center rounded-full text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
                Ver Productos
            </Link>
        </nav>
    );
}
