import { useState } from 'react';

const PRIMARY_TABS = [
    { id: 'dashboard', label: 'Inicio', icon: 'dashboard' },
    { id: 'productos', label: 'Items', icon: 'inventory_2' },
    { id: 'pedidos', label: 'Ventas', icon: 'shopping_cart' },
    { id: 'clientes', label: 'Clientes', icon: 'groups' },
];

const MORE_TABS = [
    { id: 'sync', label: 'Sync DroPanas', icon: 'sync' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'actividad', label: 'Actividad', icon: 'history' },
    { id: 'config', label: 'Configuración', icon: 'settings' },
];

/**
 * AdminMobileNav
 * Bottom navigation bar for mobile devices.
 * Shows 4 primary tabs + a "More" menu that expands upward.
 */
export default function AdminMobileNav({ activeTab, setActiveTab }) {
    const [moreOpen, setMoreOpen] = useState(false);

    const isActiveInMore = MORE_TABS.some(t => t.id === activeTab);

    function handleTabClick(id) {
        setActiveTab(id);
        setMoreOpen(false);
    }

    return (
        <>
            {/* More Menu Overlay */}
            {moreOpen && (
                <div className="fixed inset-0 z-[98] bg-black/30 backdrop-blur-[2px]" onClick={() => setMoreOpen(false)} />
            )}

            {/* More Menu Sheet */}
            {moreOpen && (
                <div className="fixed bottom-[64px] left-3 right-3 z-[99] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slideUp">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Más opciones</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                        {MORE_TABS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm transition-all ${activeTab === item.id
                                        ? 'bg-[#0A2463] text-white font-bold'
                                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Nav Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-[100] safe-area-bottom">
                <div className="flex justify-around items-stretch h-[64px] px-1">
                    {PRIMARY_TABS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all relative ${activeTab === item.id
                                    ? 'text-[#E63946]'
                                    : 'text-gray-400'
                                }`}
                        >
                            {activeTab === item.id && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#E63946] rounded-b-full" />
                            )}
                            <span className={`material-symbols-outlined text-[22px] transition-transform ${activeTab === item.id ? 'scale-110' : ''
                                }`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] tracking-tight ${activeTab === item.id ? 'font-bold' : 'font-medium'
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    ))}

                    {/* More Button */}
                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all relative ${moreOpen || isActiveInMore ? 'text-[#E63946]' : 'text-gray-400'
                            }`}
                    >
                        {isActiveInMore && !moreOpen && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#E63946] rounded-b-full" />
                        )}
                        <span className={`material-symbols-outlined text-[22px] transition-transform ${moreOpen ? 'rotate-45' : ''}`}>
                            {moreOpen ? 'close' : 'more_horiz'}
                        </span>
                        <span className={`text-[10px] tracking-tight ${moreOpen || isActiveInMore ? 'font-bold' : 'font-medium'
                            }`}>
                            Más
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
}
