import { useState, useEffect } from 'react';
import { Clock, Zap, Truck } from 'lucide-react';

/**
 * DeliveryUrgencyTimer
 * Neuromarketing urgency trigger tailored to Venezuelan logistics:
 * - Mon-Sat dispatch cut-off timer.
 * - Highlights Caracas < 2h express and national 24-48h Tealca shipping.
 */
export default function DeliveryUrgencyTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 45, seconds: 20 });
    const [isSunday, setIsSunday] = useState(false);

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 is Sunday, 1-6 Mon-Sat

            if (dayOfWeek === 0) {
                setIsSunday(true);
                return;
            }

            setIsSunday(false);

            // Cut-off time is 4:00 PM (16:00) Venezuela time
            const target = new Date();
            target.setHours(16, 0, 0, 0);

            let diff = target.getTime() - now.getTime();

            // If past 4 PM, set countdown to next day's morning dispatch (9 AM)
            if (diff <= 0) {
                target.setDate(target.getDate() + 1);
                target.setHours(9, 0, 0, 0);
                diff = target.getTime() - now.getTime();
            }

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours, minutes, seconds });
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatNum = (n) => String(n).padStart(2, '0');

    return (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border border-amber-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span>Despachos de Lunes a Sábado</span>
                </div>

                {!isSunday ? (
                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-900 bg-white/90 px-2 py-0.5 rounded-md border border-amber-300/60 shadow-2xs font-mono">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>
                            {formatNum(timeLeft.hours)}h : {formatNum(timeLeft.minutes)}m : {formatNum(timeLeft.seconds)}s
                        </span>
                    </div>
                ) : (
                    <span className="text-[10px] font-black text-amber-900 bg-white/90 px-2 py-0.5 rounded-md">
                        Ruta de Lunes
                    </span>
                )}
            </div>

            <p className="text-xs text-amber-900 leading-snug font-medium">
                {!isSunday ? (
                    <>
                        ⚡ Ordena antes de que cierre el contador para <strong>despacho hoy mismo</strong>.
                    </>
                ) : (
                    <>
                        🚚 Ordena hoy domingo y sal en la <strong>primera ruta express del lunes</strong>.
                    </>
                )}
            </p>

            <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[10px] font-bold text-amber-950 flex-wrap gap-2">
                <span className="flex items-center gap-1 text-emerald-800">
                    <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                    <strong>Caracas:</strong> Entrega en &lt; 2h
                </span>
                <span className="flex items-center gap-1 text-blue-900">
                    <Truck className="w-3 h-3 text-blue-700" />
                    <strong>Nacional:</strong> 24-48h por Tealca
                </span>
            </div>
        </div>
    );
}
