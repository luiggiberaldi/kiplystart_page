import React from 'react';

export default function AdminTabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'productos', label: 'Productos', icon: 'inventory_2' },
        { id: 'pedidos', label: 'Pedidos', icon: 'shopping_cart' }
    ];

    return (
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200 sticky top-[73px] z-20">
            <div className="max-w-7xl mx-auto flex gap-1 px-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === tab.id
                            ? 'text-brand-blue'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>
                            {tab.icon}
                        </span>
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue animate-slideInRight"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
