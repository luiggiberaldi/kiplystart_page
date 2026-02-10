/**
 * Success overlay — checkmark animation before WhatsApp redirect
 */
export default function CODSuccess() {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-scaleIn">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-[40px] animate-checkmark">check_circle</span>
                </div>
                <h3 className="text-xl font-bold font-display text-brand-blue mb-2">¡Pedido Enviado!</h3>
                <p className="text-sm text-gray-500">Redirigiendo a WhatsApp...</p>
            </div>
        </div>
    );
}
