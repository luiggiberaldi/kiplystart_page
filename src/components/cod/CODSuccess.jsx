import { CheckCircle2, MessageCircle, PhoneCall, ShieldCheck, X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function CODSuccess({
    orderId,
    customerName,
    customerPhone,
    productName,
    totalPrice,
    onClose
}) {
    const { formatUSD, formatBs, exchangeRate } = useCurrency();

    const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '584124340546';
    
    // Pre-crafted WhatsApp message
    const message = 
        `Hola KiplyStart, acabo de registrar mi pedido #${orderId || ''}.\n\n` +
        `👤 Nombre: ${customerName || ''}\n` +
        (productName ? `📦 Producto: ${productName}\n` : '') +
        (totalPrice ? `💵 Total: ${formatUSD(totalPrice)}${exchangeRate ? ` (${formatBs(totalPrice)})` : ''}\n\n` : '\n') +
        `Deseo confirmar los datos de entrega para el despacho Contra Entrega.`;

    const whatsappUrl = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 text-center max-w-md w-full shadow-2xl animate-scaleIn border border-gray-100 overflow-hidden">
                {/* Close Button */}
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Top Success Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-600/20">
                    <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 animate-bounce" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0A2463] text-xs font-black rounded-full mb-2">
                    <span>Orden Registrada:</span>
                    <span className="font-mono text-emerald-700">#{orderId || 'PENDIENTE'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                    ¡Pedido Recibido con Éxito!
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2 leading-relaxed">
                    {customerName ? <strong>{customerName}, </strong> : ''}
                    tu orden ha quedado registrada en nuestro sistema.
                </p>

                {/* Assurance Card */}
                <div className="my-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-left flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-amber-900 leading-relaxed">
                        <p className="font-bold text-amber-950 mb-0.5">
                            Pronto nos comunicaremos contigo
                        </p>
                        <p className="text-[11px] text-amber-800">
                            Nuestro equipo te contactará por WhatsApp al <strong className="font-mono text-gray-900">{customerPhone || 'tu número'}</strong> para verificar los datos de entrega antes de realizar el despacho.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
                        <span>¿Deseas confirmar ya? Escríbenos</span>
                    </a>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 text-xs font-extrabold text-gray-600 hover:text-gray-950 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                        >
                            Esperaré su mensaje · Volver a la tienda
                        </button>
                    )}
                </div>

                {/* Trust Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Pago 100% Contra Entrega · Revisas al recibir</span>
                </div>
            </div>
        </div>
    );
}
