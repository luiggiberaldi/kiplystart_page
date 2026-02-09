import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminView = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image_url: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProducts(data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    image_url: formData.image_url
                }]);

            if (error) throw error;

            setFormData({ name: '', price: '', description: '', image_url: '' });
            fetchProducts();
            alert('Producto agregado con éxito');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .match({ id });

        if (!error) fetchProducts();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-[#0A2463] mb-8">KiplyStart Admin Dashboard</h1>

            {/* Product Form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-12">
                <h2 className="text-xl font-bold mb-4 text-[#0A2463]">Agregar Nuevo Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#0A2463]" placeholder="Ej. Smartwatch X" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#0A2463]" placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#0A2463]" placeholder="Detalles del producto..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                        <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#0A2463]" placeholder="https://..." />
                    </div>

                    <button type="submit" disabled={loading} className="bg-[#E63946] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 w-full md:w-auto">
                        {loading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </form>
            </div>

            {/* Product List */}
            <h2 className="text-xl font-bold mb-4 text-[#0A2463]">Inventario Actual</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image_url || 'https://via.placeholder.com/40'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">${product.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminView;
