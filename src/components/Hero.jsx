import React from 'react';

const Hero = () => {
    return (
        <div id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-[100%] blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-[100%] blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Crea Software <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Fácil y Personalizable
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Impulsa tu empresa o emprendimiento con soluciones tecnológicas a medida.
                        Sin complicaciones, diseño premium y adaptado a tus necesidades.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn btn-primary text-lg">
                            Comenzar Ahora
                        </button>
                        <button className="btn bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all">
                            Ver Demo
                        </button>
                    </div>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-20 relative mx-auto max-w-5xl">
                    <div className="bg-dark-card border border-white/10 rounded-xl p-2 shadow-2xl shadow-primary/20 backdrop-blur-sm">
                        <div className="bg-dark rounded-lg overflow-hidden aspect-video relative flex items-center justify-center border border-white/5">
                            <div className="text-gray-500 text-lg">
                                {/* Placeholder for dashboard image - dynamic content */}
                                [Panel de Control Interactivo KiplyStart]
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
