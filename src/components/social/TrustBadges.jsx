import React from 'react';

const TrustBadges = ({ badges }) => {
    if (!badges) return null;

    return (
        <div className="w-full space-y-3 my-6 px-2">
            {/* Scarcity / Sales Badge */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-3 animate-pulse-slow">
                <div className="bg-red-500 text-white rounded-full p-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                </div>
                <div className="flex-1">
                    <p className="text-brand-red font-bold text-xs uppercase tracking-wide">¡Se están agotando!</p>
                    <p className="text-gray-700 text-sm font-medium">Más de <span className="font-bold underline text-gray-900">{badges.salesCount} personas</span> compraron esto en Caracas esta semana.</p>
                </div>
            </div>

            {/* Verification Badge */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                <div className="bg-brand-blue text-white rounded-full p-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="flex-1">
                    <p className="text-brand-blue font-bold text-xs uppercase tracking-wide">{badges.badgeTitle || 'KiplyStart Verificado'}</p>
                    <p className="text-gray-700 text-sm font-medium">
                        {badges.badgeText ? (
                            badges.badgeText
                        ) : badges.installationTime ? (
                            <>Instalación: <span className="font-bold">{badges.installationTime}</span>. No necesitas mecánico ni herramientas complejas.</>
                        ) : (
                            'Compra Segura. Envío gratis y pagas al recibir.'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrustBadges;
