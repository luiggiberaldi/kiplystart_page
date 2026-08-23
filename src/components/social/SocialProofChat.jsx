import { 
    MessageCircle, CheckCheck, Star, ShieldCheck, 
    Play, MapPin, CheckCircle2, PackageCheck
} from 'lucide-react';

/**
 * SocialProofChat Component
 * Hyper-realistic WhatsApp testimonials for Venezuelan COD dropshipping.
 */
export default function SocialProofChat({ messages }) {
    if (!messages || messages.length === 0) return null;

    const AVATAR_COLORS = [
        'bg-blue-600 text-white',
        'bg-emerald-600 text-white',
        'bg-purple-600 text-white',
        'bg-amber-600 text-white',
        'bg-rose-600 text-white',
        'bg-indigo-600 text-white'
    ];

    return (
        <div className="w-full max-w-full my-8 space-y-3 font-sans">
            {/* Header */}
            <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                    <span>Opiniones y Entregas Reales</span>
                </div>
                <h3 className="text-base font-black text-gray-950 flex items-center justify-center gap-1.5">
                    <span>Experiencias Contra Entrega</span>
                    <span className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                    </span>
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">
                    Clientes verificados que pagaron en efectivo o pago móvil al recibir en su hogar.
                </p>
            </div>

            {/* Chat Box Container */}
            <div className="bg-[#EFEAE2]/70 border border-amber-900/10 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                {/* Security Pill */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-gray-600 bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-full border border-gray-200/80 shadow-2xs mx-auto w-fit">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Despachos asegurados por Tealca / DroPanas · Pagas al recibir</span>
                </div>

                {/* Messages List */}
                <div className="space-y-3">
                    {messages.map((msg, index) => {
                        const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
                        const initials = msg.user
                            ? msg.user.replace('@', '').slice(0, 2).toUpperCase()
                            : 'CL';

                        return (
                            <div 
                                key={index} 
                                className="bg-white rounded-2xl rounded-tl-xs p-3.5 border border-gray-200/70 shadow-xs space-y-2 relative"
                            >
                                {/* Header: User, Location & Verified Badge */}
                                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 shadow-2xs ${avatarColor}`}>
                                            {initials}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-xs text-gray-900 truncate flex items-center gap-1.5">
                                                <span>{msg.user}</span>
                                                {msg.location && (
                                                    <span className="text-[10px] font-bold text-gray-500 font-normal truncate flex items-center gap-0.5">
                                                        <MapPin className="w-2.5 h-2.5 text-gray-400" />
                                                        {msg.location}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200/60">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                        <span className="hidden xs:inline">Entrega Verificada</span>
                                        <span className="xs:hidden">Verificado</span>
                                    </span>
                                </div>

                                {/* Voice Note Preview (Static Visual Element) */}
                                {msg.hasVoiceNote && (
                                    <div className="bg-slate-50 border border-gray-200/80 rounded-xl p-2.5 flex items-center gap-2.5 select-none pointer-events-none">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                                        </div>
                                        
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-0.5 h-4">
                                                {[3, 6, 8, 4, 10, 7, 5, 9, 4, 7, 8, 3, 6, 9, 5, 4, 8, 6, 3, 7].map((h, i) => (
                                                    <span 
                                                        key={i} 
                                                        style={{ height: `${h * 1.5}px` }}
                                                        className="w-1 rounded-full bg-gray-300" 
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex justify-between text-[9px] text-gray-500 font-mono font-bold">
                                                <span>0:14</span>
                                                <span className="text-emerald-700">Nota de voz</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Message Text */}
                                <p className="text-xs text-gray-800 leading-relaxed font-normal">
                                    {msg.text}
                                </p>

                                {/* Footer: Timestamp & WhatsApp Double Check */}
                                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 font-medium pt-1">
                                    <span>{msg.time || 'Ayer'}</span>
                                    <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Trust Guarantee */}
                <div className="pt-2 text-center border-t border-amber-900/10 flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-700">
                    <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Revisas tu producto al recibir y pagas directo al repartidor</span>
                </div>
            </div>
        </div>
    );
}
