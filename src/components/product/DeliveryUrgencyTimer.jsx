import { useState, useEffect } from 'react';
import { Clock, Zap, Truck, CalendarCheck, Sparkles } from 'lucide-react';

/**
 * DeliveryUrgencyTimer
 * Professional urgency trigger for Venezuelan logistics (No raw emojis, 100% SVG icons).
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
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
            {/* Top row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span>Despachos de Lunes a Sábado</span>
                </div>

                {!isSunday ? (
                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-900 bg-white/95 px-2 py-0.5 rounded-lg border border-amber-300/70 shadow-2xs font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>
                            {formatNum(timeLeft.hours)}h : {formatNum(timeLeft.minutes)}m : {formatNum(timeLeft.seconds)}s
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-[10px] font-black text-amber-900 bg-white/95 px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                        <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Ruta de Lunes</span>
                    </div>
                )}
            </div>

            {/* Instruction line with clean SVG icon */}
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium">
                {!isSunday ? (
                    <>
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                        <span>Ordena antes del cierre del contador para <strong>despacho hoy mismo</strong>.</span>
                    </>
                ) : (
                    <>
                        <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Ordena hoy domingo para salir en la <strong>primera ruta express del lunes</strong>.</span>
                    </>
                )}
            </div>

            {/* Bottom info tags */}
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] font-bold text-amber-950 flex-wrap gap-2">
                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600 shrink-0" />
                    <span><strong>Caracas &amp; Zonas Directas:</strong> Domicilio Express (&lt; 2h)</span>
                </span>
                <span className="flex items-center gap-1 text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded-md border border-blue-200/50">
                    <Truck className="w-3 h-3 text-blue-700 shrink-0" />
                    <span><strong>Nacional:</strong> Domicilio u Oficina Tealca (24-48h)</span>
                </span>
            </div>
        </div>
    );
}
