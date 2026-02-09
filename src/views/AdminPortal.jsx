import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Import admin components
import DashboardStats from "../components/admin/DashboardStats";
import ProductForm from "../components/admin/ProductForm";
import ProductList from "../components/admin/ProductList";
import OrdersManager from "../components/admin/OrdersManager";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminTabs from "../components/admin/AdminTabs";

/**
 * AdminPortal View (Enhanced)
 * @description
 * Professional admin panel with tabs for products, orders, and dashboard.
 * Follows BRANDING_CIENTIFICO_V2 and TECHNICAL_BRAIN_2026 guidelines.
 */
export default function AdminPortal() {
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | productos | pedidos
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (activeTab === 'productos') {
            fetchProducts();
        }
    }, [activeTab]);

    async function fetchProducts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleProductSubmit(productData) {
        try {
            if (editingProduct) {
                // Update existing product
                const { error } = await supabase
                    .from("products")
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (error) throw error;
                showMessage('success', '✅ Producto actualizado exitosamente');
                setEditingProduct(null);
            } else {
                // Create new product
                const { error } = await supabase
                    .from("products")
                    .insert([productData]);

                if (error) throw error;
                showMessage('success', '✅ Producto creado exitosamente');
            }

            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
            showMessage('success', '✅ Producto eliminado');
            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        }
    }

    async function handleToggleStatus(product) {
        try {
            const { error } = await supabase
                .from("products")
                .update({ is_active: !product.is_active })
                .eq('id', product.id);

            if (error) throw error;
            showMessage('success', `✅ Producto ${product.is_active ? 'desactivado' : 'activado'}`);
            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        }
    }

    function handleEdit(product) {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showMessage(type, text) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    }

    return (
        <div className="min-h-screen bg-gray-50 font-body text-soft-black">
            {/* Modular Navbar */}
            <AdminNavbar />

            {/* Modular Tabs */}
            <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Flash Message */}
            {message && (
                <div className="fixed top-20 right-4 z-50 animate-slideInRight">
                    <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                        {message.text}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-brand-blue mb-2">Panel de Control</h2>
                            <p className="text-gray-600">Resumen general de tu tienda</p>
                        </div>
                        <DashboardStats />

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <button
                                onClick={() => setActiveTab('productos')}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-blue hover:shadow-md transition-all text-left group"
                            >
                                <span className="material-symbols-outlined text-brand-blue text-[48px] mb-2 group-hover:scale-110 transition-transform">add_box</span>
                                <h3 className="font-bold text-lg mb-1">Añadir Producto</h3>
                                <p className="text-sm text-gray-600">Crear nuevo producto con bundles</p>
                            </button>

                            <button
                                onClick={() => setActiveTab('pedidos')}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-blue hover:shadow-md transition-all text-left group"
                            >
                                <span className="material-symbols-outlined text-brand-blue text-[48px] mb-2 group-hover:scale-110 transition-transform">receipt_long</span>
                                <h3 className="font-bold text-lg mb-1">Ver Pedidos</h3>
                                <p className="text-sm text-gray-600">Gestionar órdenes COD</p>
                            </button>

                            <button
                                onClick={() => setActiveTab('productos')}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-blue hover:shadow-md transition-all text-left group"
                            >
                                <span className="material-symbols-outlined text-brand-blue text-[48px] mb-2 group-hover:scale-110 transition-transform">inventory</span>
                                <h3 className="font-bold text-lg mb-1">Inventario</h3>
                                <p className="text-sm text-gray-600">Revisar stock de productos</p>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'productos' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold font-display text-brand-blue mb-2">
                                    {editingProduct ? 'Editar Producto' : 'Gestión de Productos'}
                                </h2>
                                <p className="text-gray-600">
                                    {editingProduct ? 'Modifica la información del producto' : 'Administra tu catálogo completo'}
                                </p>
                            </div>
                            {editingProduct && (
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancelar Edición
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Form Column */}
                            <div className="lg:col-span-1">
                                <ProductForm
                                    onSuccess={handleProductSubmit}
                                    editingProduct={editingProduct}
                                />
                            </div>

                            {/* List Column */}
                            <div className="lg:col-span-2">
                                {loading ? (
                                    <div className="flex justify-center p-10">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                                    </div>
                                ) : (
                                    <ProductList
                                        products={products}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onRefresh={fetchProducts}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'pedidos' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-brand-blue mb-2">Gestión de Pedidos</h2>
                            <p className="text-gray-600">Administra las órdenes de pago contra entrega</p>
                        </div>
                        <OrdersManager />
                    </div>
                )}
            </div>
        </div>
    );
}
