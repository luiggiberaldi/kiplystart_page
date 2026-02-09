import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Hero from './Hero';
import TrustBar from './TrustBar';
import ProductCard from './ProductCard';
import CoverageSection from './CoverageSection';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <Hero />
            <TrustBar />

            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-[#0A2463]">Catálogo <span className="text-[#E63946]">Destacado</span></h2>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-xl">Aún no hay productos disponibles.</p>
                        <p className="text-sm">Ve al Admin Dashboard para agregar inventario.</p>
                    </div>
                )}
            </div>

            <CoverageSection />
        </div>
    );
};

export default Home;
