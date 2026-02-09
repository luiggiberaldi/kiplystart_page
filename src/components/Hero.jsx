import React, { useState } from 'react';

const Hero = () => {
    // Temporary State for Logo Placement on Box
    const [logoStyle, setLogoStyle] = useState({
        top: 45,
        left: 50,
        width: 25,
        rotate: -5,
        opacity: 0.9
    });

    return (
        <div className="bg-[#F5F5F5] py-16 md:py-24 text-center px-4 relative overflow-hidden">
            {/* Clean Background to preserve true colors */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">

                {/* Text Content */}
                <div className="flex-1 text-left md:pl-10 z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#0A2463] mb-6 leading-tight">
                        Primero en tus manos,<br />
                        <span className="text-[#E63946]">después tu pago.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                        La forma más segura de comprar en internet. Pides hoy, recibes mañana y pagas solo cuando estés conforme con tu producto.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="#catalog"
                            className="inline-block bg-[#E63946] text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg shadow-red-500/30 text-center"
                        >
                            Pagar al Recibir
                        </a>
                        <div className="flex items-center gap-2 text-gray-500 text-sm px-4">
                            <span>🔒 Sin riesgos. Sin tarjetas.</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image with Logo Overlay */}
                <div className="flex-1 relative w-full max-w-lg mx-auto">
                    {/* Normal Image Container - No Blend Mode */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
                        <img
                            src="/hero.png"
                            alt="Cliente feliz recibiendo paquete"
                            className="w-full h-auto object-cover"
                        />

                        {/* The Overlay Logo on the Box */}
                        <div
                            className="absolute z-20 pointer-events-none mix-blend-multiply"
                            style={{
                                top: `${logoStyle.top}%`,
                                left: `${logoStyle.left}%`,
                                width: `${logoStyle.width}%`,
                                transform: `translate(-50%, -50%) rotate(${logoStyle.rotate}deg)`,
                                opacity: logoStyle.opacity
                            }}
                        >
                            <img src="/logo.webp" alt="" className="w-full h-auto" />
                        </div>
                    </div>

                    {/* Temporary Controls */}
                    <div className="absolute top-4 right-4 bg-white/90 p-3 rounded shadow-lg text-xs z-30 w-48 backdrop-blur-sm border border-brand-blue/20 text-left">
                        <h4 className="font-bold mb-2 text-brand-blue border-b pb-1">Ajustar Logo en Caja</h4>
                        <div className="space-y-2">
                            <label className="flex justify-between items-center">
                                <span>Top</span>
                                <input type="range" min="0" max="100" value={logoStyle.top} onChange={e => setLogoStyle({ ...logoStyle, top: Number(e.target.value) })} className="w-24 accent-brand-red" />
                            </label>
                            <label className="flex justify-between items-center">
                                <span>Left</span>
                                <input type="range" min="0" max="100" value={logoStyle.left} onChange={e => setLogoStyle({ ...logoStyle, left: Number(e.target.value) })} className="w-24 accent-brand-red" />
                            </label>
                            <label className="flex justify-between items-center">
                                <span>Size</span>
                                <input type="range" min="5" max="50" value={logoStyle.width} onChange={e => setLogoStyle({ ...logoStyle, width: Number(e.target.value) })} className="w-24 accent-brand-red" />
                            </label>
                            <label className="flex justify-between items-center">
                                <span>Rotate</span>
                                <input type="range" min="-180" max="180" value={logoStyle.rotate} onChange={e => setLogoStyle({ ...logoStyle, rotate: Number(e.target.value) })} className="w-24 accent-brand-red" />
                            </label>
                            <label className="flex justify-between items-center">
                                <span>Opacity</span>
                                <input type="range" min="0" max="1" step="0.1" value={logoStyle.opacity} onChange={e => setLogoStyle({ ...logoStyle, opacity: Number(e.target.value) })} className="w-24 accent-brand-red" />
                            </label>
                        </div>
                        <div className="mt-2 pt-2 border-t text-[10px] text-gray-500">
                            {JSON.stringify(logoStyle)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
