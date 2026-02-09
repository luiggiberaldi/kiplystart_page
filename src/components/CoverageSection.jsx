import React from 'react';

const coverageData = [
    { state: "Distrito Capital", cities: ["Caracas"], time: "24 horas", icon: "🏙️" },
    { state: "Miranda", cities: ["Los Teques", "Guatire", "Guarenas", "San Antonio de los Altos"], time: "24 horas", icon: "⛰️" },
    { state: "La Guaira", cities: ["La Guaira", "Maiquetía", "Catia la Mar", "Caraballeda"], time: "24 horas", icon: "🏖️" },
    { state: "Yaracuy", cities: ["San Felipe", "Cocorote"], time: "24 a 48 horas", icon: "🌿" },
    { state: "Lara", cities: ["Barquisimeto", "Cabudare"], time: "24 a 48 horas", icon: "🎻" },
    { state: "Carabobo", cities: ["Valencia", "Tocuyito", "Naguanagua", "San Diego", "Los Guayos", "Guacara"], time: "24 a 48 horas", icon: "🏭" },
    { state: "Aragua", cities: ["Maracay", "El Limón", "Las Delicias", "Turmero", "Cagua"], time: "24 a 48 horas", icon: "🐯" },
    { state: "Zulia", cities: ["Maracaibo", "San Francisco"], time: "24 a 48 horas", icon: "⚡" }
];

const CoverageSection = () => {
    return (
        <section className="py-16 bg-white border-t border-gray-100" id="coverage">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0A2463] mb-4">
                        📍 ¿Dónde puedes <span className="text-[#E63946]">Pagar al Recibir?</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cubrimos las principales ciudades del país con nuestro servicio de Contraentrega.
                        Para el resto de Venezuela, enviamos por encomienda tradicional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coverageData.map((region, index) => (
                        <div key={index} className="bg-[#F5F5F5] rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{region.icon}</span>
                                <h3 className="font-bold text-[#0A2463] text-lg">{region.state}</h3>
                            </div>
                            <ul className="text-sm text-gray-600 mb-4 space-y-1">
                                {region.cities.map((city, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-[#E63946] mt-1">•</span>
                                        {city}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2463] bg-[#0A2463]/10 py-2 px-3 rounded-lg">
                                <span>⏳</span>
                                {region.time}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-[#0A2463] text-white rounded-2xl p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">¿Tu ciudad no está en la lista?</h3>
                        <p className="text-blue-100">
                            Tranquilo, hacemos envíos a toda Venezuela por <strong>MRW, Zoom y Tealca</strong>.
                        </p>
                    </div>
                    <a href="#contact" className="bg-[#E63946] hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-transform transform hover:scale-105 shadow-lg shadow-red-900/20 whitespace-nowrap">
                        Consultar envío
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CoverageSection;
