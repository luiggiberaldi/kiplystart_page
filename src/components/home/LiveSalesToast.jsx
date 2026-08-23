import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SAMPLE_SALES = [
    { name: 'Carlos M.', city: 'Caracas (Distrito Capital)', product: 'Compresor de Aire Portátil Digital', time: 'Hace 4 min' },
    { name: 'Mariana V.', city: 'Valencia (Carabobo)', product: 'Combo Serum Facial & Skincare', time: 'Hace 7 min' },
    { name: 'José L.', city: 'Maracay (Aragua)', product: 'Reloj Táctico Militar Sumergible', time: 'Hace 11 min' },
    { name: 'Elena R.', city: 'Barquisimeto (Lara)', product: 'Organizador Multifuncional para Carro', time: 'Hace 15 min' },
    { name: 'Andrés G.', city: 'Maracaibo (Zulia)', product: 'Depiladora Corporal Recargable', time: 'Hace 19 min' },
    { name: 'Gabriela S.', city: 'Lechería (Anzoátegui)', product: 'Cepillo Secador Multifuncional 5 en 1', time: 'Hace 23 min' },
];

export default function LiveSalesToast() {
    const location = useLocation();
    const [currentSale, setCurrentSale] = useState(null);
    const [visible, setVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // Never show on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    useEffect(() => {
        if (isDismissed) return;

        // Show first notification after 8 seconds
        const initialTimeout = setTimeout(() => {
            triggerNotification();
        }, 8000);

        // Then cycle every 26 seconds
        const interval = setInterval(() => {
            triggerNotification();
        }, 26000);

        function triggerNotification() {
            const random = SAMPLE_SALES[Math.floor(Math.random() * SAMPLE_SALES.length)];
            setCurrentSale(random);
            setVisible(true);

            // Auto-hide after 4.5 seconds
            setTimeout(() => {
                setVisible(false);
            }, 4500);
        }

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [isDismissed]);

    if (!currentSale || !visible || isDismissed) return null;

    return (
        <div className="fixed top-14 sm:top-auto sm:bottom-6 left-3 right-3 sm:right-auto sm:left-6 z-40 max-w-sm mx-auto sm:mx-0 animate-slideDown sm:animate-slideUp select-none">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-gray-200/90 flex items-center gap-3 relative ring-1 ring-black/5">
                {/* Dismiss Button - Always accessible on mobile touch */}
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-slate-900 transition-colors"
                    aria-label="Cerrar notificación"
                >
                    <X className="w-3 h-3" />
                </button>

                {/* Icon Thumbnail */}
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
                    <ShoppingBag className="w-4 h-4" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 pr-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <span className="font-bold text-gray-900 truncate">{currentSale.name}</span>
                        <span>en</span>
                        <span className="truncate text-emerald-700 font-bold">{currentSale.city}</span>
                    </div>
                    <p className="text-xs font-black text-gray-950 truncate mt-0.5">
                        {currentSale.product}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-md">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Pago al Recibir
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            {currentSale.time}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
