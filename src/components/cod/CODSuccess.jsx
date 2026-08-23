import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    CheckCircle2, MessageCircle, PhoneCall, ShieldCheck, 
    X, Copy, Check, Truck, ArrowRight, MapPin, Package 
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function CODSuccess({
    orderId,
    customerName,
    customerPhone,
    productName,
    bumpItem,
    totalPrice,
    city,
    state,
    onClose
}) {
    const { formatUSD, formatBs, exchangeRate } = useCurrency();
    const [copied, setCopied] = useState(false);

    const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '584124340546';
    
    // Format amounts cleanly
    const usdText = totalPrice ? formatUSD(totalPrice) : '';
    const bsText = (totalPrice && exchangeRate) ? ` (${formatBs(totalPrice)})` : '';
    const totalLine = (usdText || bsText) ? `• *Total a Pagar:* ${usdText}${bsText}\n` : '';
    const bumpLine = bumpItem ? `• *Oferta Especial:* ${bumpItem.name} (+$${bumpItem.price} USD)\n` : '';
    const locationLine = (city || state) ? `• *Destino:* ${[city, state].filter(Boolean).join(', ')}\n` : '';

    // Clean, professional WhatsApp message
    const message = 
        `¡Hola KiplyStart! 👋\n` +
        `Acabo de registrar mi pedido en la tienda web:\n\n` +
        `*DETALLES DEL PEDIDO*\n` +
        `• *Nro de Orden:* #${orderId || ''}\n` +
        `• *Cliente:* ${customerName || ''}\n` +
        (productName ? `• *Producto:* ${productName}\n` : '') +
        bumpLine +
        locationLine +
        totalLine +
        `• *Método de Pago:* Contra Entrega (Pagas al recibir)\n\n` +
        `Quedo atento a su mensaje para verificar los datos de entrega y coordinar el despacho. ¡Muchas gracias!`;

    const whatsappUrl = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;

    const copyOrderId = () => {
        if (orderId && navigator.clipboard) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
            
            <div 
                className="relative bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-scaleIn border border-gray-100 max-h-[95vh] overflow-y-auto"
                style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
                {/* Close Button */}
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Cerrar"
                        aria-label="Cerrar ventana"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Top Header & Celebratory Icon */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-50">
                        <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5] animate-scaleIn" />
                    </div>

                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs">
                            <span className="text-gray-500 font-bold">Nro. de Orden:</span>
                            <span className="font-mono font-black text-[#0A2463]">#{orderId || 'PENDIENTE'}</span>
                            <button
                                onClick={copyOrderId}
                                className="p-0.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                                title="Copiar número de orden"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                            ¡Pedido Recibido con Éxito!
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-sm mx-auto">
                            {customerName ? <strong className="text-gray-900">{customerName}, </strong> : ''}
                            tu solicitud de despacho ya está registrada en nuestro sistema central.
                        </p>
                    </div>
                </div>

                {/* Order Summary Breakdown Card */}
                <div className="my-5 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3 text-left">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Resumen de Entrega</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Truck className="w-3 h-3" />
                            <span>Envío 100% Gratis</span>
                        </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                        {productName && (
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500 font-medium">Producto:</span>
                                <span className="font-bold text-gray-900 text-right truncate max-w-[220px]">{productName}</span>
                            </div>
                        )}

                        {bumpItem && (
                            <div className="flex justify-between gap-3 text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100">
                                <span className="font-bold">+ {bumpItem.name}:</span>
                                <span className="font-black">+${bumpItem.price} USD</span>
                            </div>
                        )}

                        {(city || state) && (
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500 font-medium">Destino:</span>
                                <span className="font-bold text-gray-800 text-right">{[city, state].filter(Boolean).join(', ')}</span>
                            </div>
                        )}

                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500 font-medium">Método de Pago:</span>
                            <span className="font-extrabold text-[#0A2463] text-right">Contra Entrega (Al Recibir)</span>
                        </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/80 flex items-baseline justify-between">
                        <span className="text-xs font-black text-gray-700">Total a Pagar al Recibir:</span>
                        <div className="text-right">
                            <span className="text-lg sm:text-xl font-black text-emerald-700">{usdText}</span>
                            {bsText && (
                                <span className="block text-[11px] font-bold text-gray-500 font-mono">{bsText}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3-Step Micro-Timeline of Delivery */}
                <div className="mb-5 bg-blue-50/60 rounded-2xl p-4 border border-blue-100 text-left space-y-3">
                    <h4 className="text-xs font-black text-[#0A2463] uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span>Próximos Pasos para tu Entrega:</span>
                    </h4>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black mx-auto flex items-center justify-center text-[10px]">✓</div>
                            <p className="font-bold text-gray-900 leading-tight">1. Registrado</p>
                            <p className="text-gray-400 text-[9px]">Listo en sistema</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-emerald-300 shadow-xs ring-2 ring-emerald-400/20 space-y-1">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black mx-auto flex items-center justify-center text-[10px] animate-pulse">2</div>
                            <p className="font-bold text-emerald-800 leading-tight">2. Verificación</p>
                            <p className="text-emerald-600 font-semibold text-[9px]">Por WhatsApp</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs space-y-1 opacity-80">
                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-black mx-auto flex items-center justify-center text-[10px]">3</div>
                            <p className="font-bold text-gray-700 leading-tight">3. Despacho</p>
                            <p className="text-gray-400 text-[9px]">Revisas y Pagas</p>
                        </div>
                    </div>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="space-y-2.5">
                    {/* Big WhatsApp CTA */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
                    >
                        <MessageCircle className="w-5 h-5 shrink-0 fill-current" />
                        <span>⚡ Agilizar Despacho por WhatsApp</span>
                        <ArrowRight className="w-4 h-4 ml-0.5" />
                    </a>

                    <div className="flex items-center gap-2 pt-1">
                        {orderId && (
                            <Link
                                to={`/rastreo?orden=${orderId}`}
                                onClick={onClose}
                                className="flex-1 py-2.5 text-xs font-extrabold text-[#0A2463] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center border border-slate-200"
                            >
                                📍 Rastrear Envío en Vivo
                            </Link>
                        )}
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
                            >
                                Volver a la Tienda
                            </button>
                        )}
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Pago 100% Contra Entrega · Primero revisas, luego pagas</span>
                </div>
            </div>
        </div>
    );
}
