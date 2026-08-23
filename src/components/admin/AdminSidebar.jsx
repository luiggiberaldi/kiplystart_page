import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";
import { 
    LayoutDashboard, Package, ShoppingBag, RefreshCw, 
    Users, BarChart3, Activity, Settings, 
    ChevronLeft, ChevronRight, Store, LogOut, ShieldCheck
} from 'lucide-react';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'pedidos', label: 'Pedidos COD', icon: ShoppingBag },
    { id: 'sync', label: 'Sync DroPanas', icon: RefreshCw },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'actividad', label: 'Actividad', icon: Activity },
    { id: 'config', label: 'Configuración', icon: Settings },
];

export default function AdminSidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
    const { exchangeRate } = useCurrency();

    const handleLogout = () => {
        if (confirm('¿Cerrar sesión de administrador?')) {
            sessionStorage.removeItem('admin_auth');
            window.location.reload();
        }
    };

    return (
        <aside className={`fixed left-0 top-0 h-full bg-[#080E1E] text-white z-40 transition-all duration-300 hidden md:flex flex-col border-r border-slate-800/80 shadow-2xl ${collapsed ? 'w-[72px]' : 'w-[250px]'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-[#0A2463] rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 border border-blue-400/20">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-sm font-black tracking-tight text-white truncate">KiplyStart</h1>
                            <p className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider">Admin Panel</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all relative group cursor-pointer ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                            }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer Area */}
            <div className="border-t border-slate-800/80 p-3 space-y-2">
                {/* Exchange Rate Badge */}
                {!collapsed && exchangeRate && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Tasa BCV</span>
                        </div>
                        <span className="text-xs text-amber-300 font-black tabular-nums">Bs. {exchangeRate.toFixed(2)}</span>
                    </div>
                )}

                {/* View Store Action */}
                <Link
                    to="/"
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700"
                    title="Ver Tienda Online"
                >
                    <Store className="w-4 h-4 text-emerald-400" />
                    {!collapsed && <span>Ver Tienda</span>}
                </Link>

                {/* Collapse & Logout Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/60 cursor-pointer"
                        title={collapsed ? "Expandir" : "Colapsar"}
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        {!collapsed && <span className="text-xs font-semibold">Colapsar</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
