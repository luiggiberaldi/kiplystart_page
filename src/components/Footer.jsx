import React from 'react';

const Footer = () => {
    return (
        <footer className="py-8 border-t border-white/5 bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    KiplyStart
                </div>
                <div className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} KiplyStart. Todos los derechos reservados.
                </div>
                <div className="flex space-x-6 text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
