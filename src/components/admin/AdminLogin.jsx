import { useState } from 'react';

/**
 * AdminLogin Component
 * @description Simple password gate for admin access.
 * Uses a hardcoded password check (no backend auth needed for single-user admin).
 */
export default function AdminLogin({ onSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const ADMIN_PASSWORD = 'kiplystart2026'; // Change this

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem('admin_auth', 'true');
                onSuccess();
            } else {
                setError('Contraseña incorrecta');
            }
            setLoading(false);
        }, 500);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#0D2E7A] to-[#1A3A8F] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                        <span className="material-symbols-outlined text-white text-[40px]">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-bold font-display text-white">KiplyStart Admin</h1>
                    <p className="text-blue-200/60 text-sm mt-1">Panel de Control v2.0</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-blue-200/80 uppercase tracking-wider mb-2">
                                Contraseña de Acceso
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50 text-[20px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full py-3 bg-[#E63946] hover:bg-[#d32f3c] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">login</span>
                                    Acceder al Panel
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-blue-300/30 text-xs mt-6">
                    © 2026 KiplyStart — Acceso restringido
                </p>
            </div>
        </div>
    );
}
