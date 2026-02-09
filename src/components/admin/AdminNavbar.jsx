import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";

export default function AdminNavbar() {
    const { currency, toggleCurrency, exchangeRate } = useCurrency();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 text-soft-black p-4 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[32px] text-brand-blue">admin_panel_settings</span>
                    <div>
                        <h1 className="text-xl font-bold font-display text-brand-blue">KiplyStart Admin</h1>
                        <p className="text-xs text-gray-500 font-mono">Scientific Dashboard v2.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Currency Widget */}
                    <div
                        onClick={toggleCurrency}
                        className="hidden md:flex flex-col items-end cursor-pointer group"
                        title="Click to toggle currency"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${currency === 'USD' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>USD</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${currency === 'VES' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>VES</span>
                        </div>
                        {exchangeRate && (
                            <span className="text-[10px] text-gray-400 font-mono group-hover:text-brand-blue transition-colors">
                                BCV: Bs. {exchangeRate.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <Link to="/" className="text-sm hover:text-brand-blue flex items-center gap-1 transition-colors font-medium">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        Ir a la Web
                    </Link>
                </div>
            </div>
        </nav>
    );
}
