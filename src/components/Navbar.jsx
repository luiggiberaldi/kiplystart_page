import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="KiplyStart Logo" className="h-8 w-8" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            KiplyStart
                        </span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="#home" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Inicio</a>
                            <a href="#services" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Servicios</a>
                            <a href="#about" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Nosotros</a>
                            <a href="#contact" className="btn btn-primary text-sm px-4 py-2">Empezar</a>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-dark-card border-b border-white/5">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-white/5">Inicio</a>
                        <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-white/5">Servicios</a>
                        <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-white/5">Nosotros</a>
                        <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-white/5">Empezar</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
