import React from 'react';
import { 
    MapPin, 
    Building2, 
    Mountain, 
    Palmtree, 
    Trees, 
    Sparkles, 
    Factory, 
    Zap, 
    Clock, 
    Truck, 
    CheckCircle2, 
    MessageCircle,
    ShieldCheck
} from 'lucide-react';

const coverageData = [
    { 
        state: "Distrito Capital", 
        cities: ["Caracas (Municipio Libertador)", "Chacao / Baruta / Sucre / El Hatillo"], 
        time: "Express 60 Minutos", 
        icon: Building2,
        express: true
    },
    { 
        state: "Miranda", 
        cities: ["Los Teques", "Guatire", "Guarenas", "San Antonio de los Altos"], 
        time: "24 a 48 horas hábiles", 
        icon: Mountain,
        express: false
    },
    { 
        state: "La Guaira", 
        cities: ["La Guaira", "Maiquetía", "Catia la Mar", "Caraballeda"], 
        time: "24 a 48 horas hábiles", 
        icon: Palmtree,
        express: false
    },
    { 
        state: "Carabobo", 
        cities: ["Valencia", "Tocuyito", "Naguanagua", "San Diego", "Los Guayos", "Guacara"], 
        time: "24 a 48 horas hábiles", 
        icon: Factory,
        express: false
    },
    { 
        state: "Aragua", 
        cities: ["Maracay", "El Limón", "Las Delicias", "Turmero", "Cagua"], 
        time: "24 a 48 horas hábiles", 
        icon: Sparkles,
        express: false
    },
    { 
        state: "Lara", 
        cities: ["Barquisimeto", "Cabudare"], 
        time: "24 a 48 horas hábiles", 
        icon: Trees,
        express: false
    },
    { 
        state: "Zulia", 
        cities: ["Maracaibo", "San Francisco"], 
        time: "24 a 48 horas hábiles", 
        icon: Zap,
        express: false
    },
    { 
        state: "Yaracuy", 
        cities: ["San Felipe", "Cocorote"], 
        time: "24 a 48 horas hábiles", 
        icon: Trees,
        express: false
    }
];

const CoverageSection = () => {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '584124340546';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hola KiplyStart, quisiera consultar si hacen envíos gratis con pago al recibir a mi ciudad.')}`;

    return (
        <section className="py-12 sm:py-16 bg-white border-t border-slate-100 rounded-3xl" id="coverage">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Envío a Domicilio 100% Gratis</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#0A2463] tracking-tight">
                        ¿Dónde Recibes a Domicilio y <span className="text-[#E63946]">Pagas al Recibir</span>?
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl mx-auto font-medium">
                        Despachamos directamente a tu puerta en las principales ciudades sin costo de envío. Para el resto de Venezuela, enviamos gratis a agencias Tealca con pago al retirar.
                    </p>
                </div>

                {/* Coverage Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {coverageData.map((region, index) => {
                        const Icon = region.icon;
                        return (
                            <div 
                                key={index} 
                                className="bg-slate-50/80 hover:bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0A2463] shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {region.express ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                                                <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                                                Express
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                                A Domicilio
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-black text-[#0A2463] text-base sm:text-lg mb-2">
                                        {region.state}
                                    </h3>

                                    <ul className="text-xs text-slate-600 mb-4 space-y-1 font-medium">
                                        {region.cities.map((city, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5">
                                                <span className="text-emerald-500 font-bold">•</span>
                                                <span className="truncate">{city}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 py-2 px-3 rounded-xl shadow-2xs">
                                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span className="truncate">{region.time}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Reassurance Banner */}
                <div className="mt-10 sm:mt-12 bg-gradient-to-br from-slate-900 to-[#0A2463] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-slate-800">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-2">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Cobertura en los 24 Estados</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-1">
                            ¿Tu ciudad o municipio no aparece en la lista?
                        </h3>
                        <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
                            ¡Tranquilo! Hacemos despachos a <strong>toda Venezuela con Envío Gratis vía Tealca</strong> y Pago al Recibir en tu agencia más cercana.
                        </p>
                    </div>

                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Consultar mi Ciudad por WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CoverageSection;
