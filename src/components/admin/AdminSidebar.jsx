import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'productos', label: 'Productos', icon: 'inventory_2' },
    { id: 'pedidos', label: 'Pedidos', icon: 'shopping_cart' },
    { id: 'sync', label: 'Sync DroPanas', icon: 'sync' },
    { id: 'clientes', label: 'Clientes', icon: 'groups' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'actividad', label: 'Actividad', icon: 'history' },
    { id: 'config', label: 'Configuración', icon: 'settings' },
];

export default function AdminSidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
    const { exchangeRate, rateSource } = useCurrency();

    return (
        <aside className={`fixed left-0 top-0 h-full bg-[#0A2463] text-white z-40 transition-all duration-300 flex flex-col ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-sm font-bold font-display truncate">KiplyStart</h1>
                        <p className="text-[10px] text-blue-200/50">Admin v2.0</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group
                            ${activeTab === item.id
                                ? 'bg-white/15 text-white font-medium'
                                : 'text-blue-200/60 hover:bg-white/5 hover:text-white'
                            }`}
                        title={collapsed ? item.label : undefined}
                    >
                        {activeTab === item.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#E63946] rounded-r" />
                        )}
                        <span className={`material-symbols-outlined text-[20px] shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 p-3 space-y-2">
                {/* Exchange Rate Display */}
                {!collapsed && exchangeRate && (
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-blue-200/50">currency_exchange</span>
                            <span className="text-[10px] text-blue-200/60">Tasa BCV</span>
                        </div>
                        <span className="text-[11px] text-white font-mono font-medium">Bs {exchangeRate.toFixed(2)}</span>
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-blue-200/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                    <span className={`material-symbols-outlined text-[18px] transition-transform ${collapsed ? 'rotate-180' : ''}`}>
                        chevron_left
                    </span>
                    {!collapsed && <span className="text-xs">Colapsar</span>}
                </button>

                {/* Store Link */}
                <Link
                    to="/"
                    className="w-full flex items-center justify-center gap-2 py-2 text-blue-200/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="Ir a la tienda"
                >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    {!collapsed && <span className="text-xs">Ver Tienda</span>}
                </Link>
            </div>
        </aside>
    );
}
