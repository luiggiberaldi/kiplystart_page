import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
    Sparkles, Car, HeartPulse, Smartphone, 
    Watch, ShoppingBag, Home, Scissors, Baby, Package
} from 'lucide-react';

const categoryMeta = {
    'Salud & Bienestar': { icon: HeartPulse, color: 'bg-emerald-50/80 border-emerald-200 text-emerald-700' },
    'Relojes & Accesorios': { icon: Watch, color: 'bg-blue-50/80 border-blue-200 text-blue-800' },
    'Tecnología & Gadgets': { icon: Smartphone, color: 'bg-indigo-50/80 border-indigo-200 text-indigo-700' },
    'Accesorios para Carros': { icon: Car, color: 'bg-amber-50/80 border-amber-200 text-amber-700' },
    'Belleza & Skincare': { icon: Sparkles, color: 'bg-pink-50/80 border-pink-200 text-pink-700' },
    'Hogar & Estilo': { icon: Home, color: 'bg-teal-50/80 border-teal-200 text-teal-700' },
    'Cuidado Capilar': { icon: Scissors, color: 'bg-purple-50/80 border-purple-200 text-purple-700' },
    'Bolsos & Moda': { icon: ShoppingBag, color: 'bg-rose-50/80 border-rose-200 text-rose-700' },
    'Bebés & Niños': { icon: Baby, color: 'bg-orange-50/80 border-orange-200 text-orange-700' },
};

const fallback = { icon: Package, color: 'bg-slate-50 border-slate-200 text-slate-700' };

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('category')
                    .eq('is_active', true);

                if (error) throw error;

                const counts = {};
                (data || []).forEach(p => {
                    if (p.category) {
                        counts[p.category] = (counts[p.category] || 0) + 1;
                    }
                });

                const sorted = Object.entries(counts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, count]) => ({ name, count }));

                setCategories(sorted);
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="h-8 w-48 bg-gray-200 rounded-2xl animate-pulse mb-8 mx-auto"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <span className="text-xs font-black text-brand-red uppercase tracking-wider">Explora por Categoría</span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mt-1">
                    Encuentra lo que Necesitas
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Todos los productos con Envío Gratis y Pago Contra Entrega a Tasa BCV Oficial
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categories.map(cat => {
                    const meta = categoryMeta[cat.name] || fallback;
                    const Icon = meta.icon;
                    return (
                        <Link
                            key={cat.name}
                            to={`/catalogo?category=${encodeURIComponent(cat.name)}`}
                            className={`${meta.color} border-2 rounded-3xl p-5 flex flex-col items-center text-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all group bg-white`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-extrabold text-gray-950 mt-1">{cat.name}</span>
                            <span className="text-xs text-gray-500 font-bold bg-white/80 px-2.5 py-0.5 rounded-full border border-gray-100 shadow-2xs">
                                {cat.count} {cat.count === 1 ? 'producto' : 'productos'}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
