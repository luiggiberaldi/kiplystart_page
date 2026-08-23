import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, PackageSearch, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav() {
    const location = useLocation();
    const { cartItems, setIsCartOpen } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '584124340546';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola KiplyStart! Deseo información sobre un producto con Pago al Recibir.')}`;

    // Hide bottom nav on admin routes
    if (location.pathname.startsWith('/admin')) return null;

    const navItems = [
        { label: 'Inicio', icon: Home, path: '/' },
        { label: 'Catálogo', icon: Sparkles, path: '/catalogo' },
        { label: 'Rastrear', icon: PackageSearch, path: '/rastreo' },
    ];

    return (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden pb-safe">
            <div className="bg-white/90 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-2xl flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                                isActive
                                    ? 'text-[#0A2463] font-black scale-105'
                                    : 'text-slate-500 font-bold hover:text-slate-900'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}

                {/* WhatsApp Action */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-emerald-600 font-bold hover:text-emerald-700 transition-all cursor-pointer"
                >
                    <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] mt-0.5 tracking-tight">WhatsApp</span>
                </a>

                {/* Cart Action */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer"
                    aria-label="Ver Carrito de Compras"
                >
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5 stroke-2" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-brand-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight">Carrito</span>
                </button>
            </div>
        </div>
    );
}
