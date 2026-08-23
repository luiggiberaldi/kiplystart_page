import { useState, useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

/**
 * LiveSalesToast Component
 * Displays discreet, high-converting social proof toasts of recent purchases.
 */
export default function LiveSalesToast({ productName = 'producto' }) {
    const [currentToast, setCurrentToast] = useState(null);
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const buyers = [
        { name: 'Carlos M.', city: 'Valencia, Carabobo', qty: 'Pack x2 Unidades', time: 'hace 4 min' },
        { name: 'Daniela R.', city: 'Los Palos Grandes, Caracas', qty: 'Pack x3 Unidades', time: 'hace 7 min' },
        { name: 'Andrés G.', city: 'Maracay, Aragua', qty: 'Pack x2 Unidades', time: 'hace 11 min' },
        { name: 'Yusmari V.', city: 'Barquisimeto, Lara', qty: '1 Unidad', time: 'hace 15 min' },
        { name: 'Roberto S.', city: 'Lechería, Anzoátegui', qty: 'Pack x3 Unidades', time: 'hace 19 min' },
        { name: 'Mariana P.', city: 'Chacao, Caracas', qty: 'Pack x2 Unidades', time: 'hace 24 min' }
    ];

    useEffect(() => {
        if (dismissed) return;

        let currentIndex = 0;
        let showTimer, hideTimer;

        const cycleToast = () => {
            setCurrentToast(buyers[currentIndex % buyers.length]);
            setVisible(true);
            currentIndex++;

            // Hide after 5.5 seconds
            hideTimer = setTimeout(() => {
                setVisible(false);
            }, 5500);
        };

        // Initial trigger after 6 seconds
        const initialTimer = setTimeout(() => {
            cycleToast();
            // Then every 24 seconds
            showTimer = setInterval(cycleToast, 24000);
        }, 6000);

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(hideTimer);
            clearInterval(showTimer);
        };
    }, [dismissed]);

    if (dismissed || !currentToast || !visible) return null;

    const shortProd = productName.length > 26 ? productName.slice(0, 24) + '...' : productName;

    return (
        <div className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-[320px] bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-gray-200/90 shadow-xl shadow-black/10 flex items-center gap-3 animate-slideUp">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBag className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1">
                    <p className="text-xs font-black text-gray-900 truncate">
                        {currentToast.name} <span className="text-[10px] text-gray-500 font-medium">({currentToast.city.split(',')[0]})</span>
                    </p>
                </div>
                <p className="text-[11px] text-gray-600 truncate">
                    Pidió <strong>{currentToast.qty}</strong>
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-700 font-extrabold mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Paga al Recibir · {currentToast.time}</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5"
                title="Cerrar"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
