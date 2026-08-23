import { useState, useRef, useEffect } from 'react';
import { MapPin, Truck, Clock, ShieldCheck, ArrowRight, ChevronDown, Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const VENEZUELA_STATES = [
    { state: 'Distrito Capital', time: '60 Minutos (Express)', type: 'Motorizado Express a Domicilio', operator: 'Mensajería Directa KiplyStart', fast: true },
    { state: 'Miranda', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Tealca', operator: 'Mensajería / Tealca', fast: false },
    { state: 'La Guaira (Vargas)', time: '24 a 48 horas hábiles', type: 'Entrega a Domicilio / Agencia', operator: 'Tealca', fast: false },
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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentZone = VENEZUELA_STATES.find(s => s.state === selectedState) || VENEZUELA_STATES[0];

    // Close on click outside or Escape
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(event) {
            if (event.key === 'Escape') setIsOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl relative">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left: Headline & Custom Rounded Selector */}
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

                        {/* Custom Rounded Dropdown */}
                        <div className="relative max-w-sm" ref={dropdownRef}>
                            {/* Trigger Button */}
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-haspopup="listbox"
                                aria-expanded={isOpen}
                                className={`w-full bg-slate-50 border-2 ${
                                    isOpen ? 'border-[#0A2463] ring-4 ring-[#0A2463]/10 bg-white' : 'border-slate-300 hover:border-slate-400'
                                } rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-xs`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <MapPin className="w-4 h-4 text-[#0A2463] shrink-0" />
                                    <span className="truncate">{currentZone.state}</span>
                                    {currentZone.fast && (
                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
                                            <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                                            Express
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                                        isOpen ? 'rotate-180 text-[#0A2463]' : ''
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 max-h-64 overflow-y-auto animate-fadeIn divide-y divide-slate-100">
                                    <div className="space-y-0.5" role="listbox">
                                        {VENEZUELA_STATES.map((s) => {
                                            const isSelected = s.state === selectedState;
                                            return (
                                                <button
                                                    key={s.state}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => {
                                                        setSelectedState(s.state);
                                                        setIsOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-blue-50 text-[#0A2463] font-black shadow-2xs'
                                                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className="truncate">{s.state}</span>
                                                        {s.fast && (
                                                            <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                                                                <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                                                                Express
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="w-4 h-4 text-[#0A2463] shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
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
