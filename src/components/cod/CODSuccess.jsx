import { CheckCircle2, MessageCircle } from 'lucide-react';

export default function CODSuccess() {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <div className="relative bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl animate-scaleIn border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-600/20">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-gray-950 mb-2">¡Pedido Confirmado!</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Estamos preparando tu despacho a bodega central.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2 px-3 rounded-xl">
                    <MessageCircle className="w-4 h-4" />
                    <span>Conectando con WhatsApp...</span>
                </div>
            </div>
        </div>
    );
}
