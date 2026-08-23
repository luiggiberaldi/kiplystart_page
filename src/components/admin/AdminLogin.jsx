import { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import Logo from '../Logo';

export default function AdminLogin({ onSuccess }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
                sessionStorage.setItem('admin_auth', 'true');
                localStorage.setItem('kp_admin_device', 'true');
                onSuccess();
            } else {
                setError('Contraseña incorrecta. Verifica e intenta de nuevo.');
            }
            setLoading(false);
        }, 350);
    }

    return (
        <div className="min-h-screen bg-[#070D1E] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-scaleIn">
                {/* Brand Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl mb-4 border border-white/15 shadow-xl shadow-black/40">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                        <span>KiplyStart Admin</span>
                        <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">v2.0</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
                        Centro de Control & Gestión de Dropshipping
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-white/10 shadow-2xl shadow-black/60">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                                <span>Contraseña de Acceso</span>
                                <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
                                    <KeyRound className="w-3 h-3" /> Clave Maestra
                                </span>
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Introduce tu contraseña..."
                                    className="w-full pl-11 pr-12 py-3.5 bg-slate-950/70 border-2 border-slate-800 focus:border-blue-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-mono text-sm"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl transition-colors cursor-pointer"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-300 bg-red-950/50 p-3 rounded-2xl border border-red-500/30 animate-fadeIn">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-[#0A2463] hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl font-extrabold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Acceder al Panel</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center text-slate-500 text-xs mt-6 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Sesión Segura Encriptada · KiplyStart 2026</span>
                </div>
            </div>
        </div>
    );
}
