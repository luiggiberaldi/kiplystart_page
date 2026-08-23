import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_SALES = [
    { name: 'Carlos M.', city: 'Caracas (Distrito Capital)', product: 'Compresor de Aire Portátil Digital', price: '$29', time: 'Hace 4 min', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=100&q=80' },
    { name: 'Mariana V.', city: 'Valencia (Carabobo)', product: 'Combo Serum Facial & Skincare', price: '$19', time: 'Hace 7 min', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&q=80' },
    { name: 'José L.', city: 'Maracay (Aragua)', product: 'Reloj Táctico Militar Sumergible', price: '$24', time: 'Hace 11 min', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=100&q=80' },
    { name: 'Elena R.', city: 'Barquisimeto (Lara)', product: 'Organizador Multifuncional para Carro', price: '$16', time: 'Hace 15 min', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=100&q=80' },
    { name: 'Andrés G.', city: 'Maracaibo (Zulia)', product: 'Depiladora Corporal Recargable', price: '$22', time: 'Hace 19 min', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&q=80' },
    { name: 'Gabriela S.', city: 'Lechería (Anzoátegui)', product: 'Cepillo Secador Multifuncional 5 en 1', price: '$27', time: 'Hace 23 min', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=100&q=80' },
];

export default function LiveSalesToast() {
    const [currentSale, setCurrentSale] = useState(null);
    const [visible, setVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (isDismissed) return;

        // Show first notification after 6 seconds
        const initialTimeout = setTimeout(() => {
            triggerNotification();
        }, 6000);

        // Then cycle every 18 seconds
        const interval = setInterval(() => {
            triggerNotification();
        }, 18000);

        function triggerNotification() {
            const random = SAMPLE_SALES[Math.floor(Math.random() * SAMPLE_SALES.length)];
            setCurrentSale(random);
            setVisible(true);

            // Hide after 6 seconds
            setTimeout(() => {
                setVisible(false);
            }, 6000);
        }

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [isDismissed]);

    if (!currentSale || !visible || isDismissed) return null;

    return (
        <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm animate-slideUp">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-gray-200/90 flex items-center gap-3 relative group">
                {/* Dismiss Button */}
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                    aria-label="Cerrar notificación"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                {/* Icon Thumbnail */}
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
                    <ShoppingBag className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <span className="font-bold text-gray-900 truncate">{currentSale.name}</span>
                        <span>en</span>
                        <span className="truncate text-emerald-700 font-bold">{currentSale.city}</span>
                    </div>
                    <p className="text-xs font-black text-gray-950 truncate mt-0.5">
                        {currentSale.product}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
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
