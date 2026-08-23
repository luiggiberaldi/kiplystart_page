import { useState } from 'react';
import { MapPin, Truck, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VENEZUELA_STATES = [
    { state: 'Distrito Capital', time: 'De 2 a 24 horas (Mismo Día)', type: 'Motorizado Express a Domicilio', operator: 'Mensajería Directa KiplyStart', fast: true },
    { state: 'Miranda', time: 'De 2 a 24 horas (Mismo Día)', type: 'Motorizado Express / Tealca', operator: 'Mensajería Directa / Tealca', fast: true },
    { state: 'La Guaira (Vargas)', time: '24 horas', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca Express', fast: true },
    { state: 'Carabobo', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Aragua', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Lara', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Zulia', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Anzoátegui', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Bolívar', time: '48 a 72 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Táchira', time: '48 a 72 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Mérida', time: '48 a 72 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Falcón', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Monagas', time: '48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Sucre', time: '48 a 72 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Nueva Esparta (Margarita)', time: '48 a 72 horas hábiles', type: 'Agencia Tealca', operator: 'Tealca Marítimo/Aéreo', fast: false },
    { state: 'Barinas', time: '48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Portuguesa', time: '48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Guárico', time: '48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Trujillo', time: '48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Yaracuy', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Cojedes', time: '48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
    { state: 'Apure', time: '48 a 72 horas hábiles', type: 'Agencia Tealca', operator: 'Tealca', fast: false },
    { state: 'Delta Amacuro', time: '48 a 72 horas hábiles', type: 'Agencia Tealca', operator: 'Tealca', fast: false },
    { state: 'Amazonas', time: '48 a 72 horas hábiles', type: 'Agencia Tealca', operator: 'Tealca', fast: false },
];

export default function DeliveryEstimator() {
    const [selectedState, setSelectedState] = useState('Distrito Capital');

    const currentZone = VENEZUELA_STATES.find(s => s.state === selectedState) || VENEZUELA_STATES[0];

    return (
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left: Headline & Selector */}
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0A2463] text-[11px] font-black uppercase tracking-wider mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Calculadora de Envíos en Venezuela</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
                            ¿Cuánto tarda en llegar a tu ciudad?
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm font-medium mb-4">
                            Selecciona tu estado y consulta el tiempo de entrega y operador garantizado:
                        </p>

                        <div className="relative max-w-sm">
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/10 outline-none transition-all cursor-pointer"
                            >
                                {VENEZUELA_STATES.map((s) => (
                                    <option key={s.state} value={s.state}>
                                        {s.state} {s.fast ? '⚡ (Express)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right: Dynamic Result Card */}
                    <div className="flex-1 bg-gradient-to-br from-slate-900 to-[#0A2463] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-xs font-bold text-slate-300">
                                    Destino: <strong className="text-white font-black">{currentZone.state}</strong>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                    Envío 100% Gratis
                                </span>
                            </div>

                            <div className="flex items-baseline gap-2 mb-2">
                                <Clock className="w-5 h-5 text-amber-400 shrink-0 self-center" />
                                <div>
                                    <p className="text-xs text-slate-400">Tiempo Estimado:</p>
                                    <p className="text-xl sm:text-2xl font-black text-amber-400">
                                        {currentZone.time}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/10">
                                <p className="flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Operador: <strong className="text-white">{currentZone.operator}</strong></span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Modalidad: <strong className="text-white">Pago Contra Entrega (BCV)</strong></span>
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/catalogo"
                            className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        >
                            <span>Ver Catálogo con Entrega en {currentZone.state}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
