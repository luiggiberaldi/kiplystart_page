import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";

export default function AdminNavbar() {
    const { exchangeRate, rateSource } = useCurrency();

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
                    {/* Exchange Rate Display */}
                    {exchangeRate && (
                        <div className="hidden md:flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-gray-400">currency_exchange</span>
                            <span className="text-xs text-gray-500 font-mono">
                                Bs {exchangeRate.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-gray-300 font-mono">
                                {rateSource === 'manual' ? 'manual' : 'BCV'}
                            </span>
                        </div>
                    )}

                    <Link to="/" className="text-sm hover:text-brand-blue flex items-center gap-1 transition-colors font-medium">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        Ir a la Web
                    </Link>
                </div>
            </div>
        </nav>
    );
}
