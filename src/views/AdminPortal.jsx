import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Admin Components
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardStats from "../components/admin/DashboardStats";
import ProductList from "../components/admin/ProductList";
import ProductDrawer from "../components/admin/ProductDrawer";
import OrdersManager from "../components/admin/OrdersManager";
import SyncDashboard from "../components/admin/SyncDashboard";
import CustomersManager from "../components/admin/CustomersManager"; // New Component
import AdminAnalytics from "../components/admin/AdminAnalytics";
import ActivityLog from "../components/admin/ActivityLog";
import AdminSettings from "../components/admin/AdminSettings";
import { SettingsProvider } from "../context/SettingsContext";

/**
 * AdminPortal v2.0
 * @description
 * Full admin panel with sidebar navigation, auth gate, and 8 modules.
 * Optimized for dropshipping (no inventory ownership).
 */
export default function AdminPortal() {
    const [authenticated, setAuthenticated] = useState(
        () => sessionStorage.getItem('admin_auth') === 'true'
    );
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (authenticated && (activeTab === 'productos' || activeTab === 'dashboard')) {
            fetchProducts();
        }
    }, [activeTab, authenticated]);

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
                const { error } = await supabase
                    .from("products")
                    .update(productData)
                    .eq('id', editingProduct.id);
                if (error) throw error;

                await logActivity('product_update', 'product', editingProduct.id, {
                    name: productData.name || editingProduct.name
                });
                showMessage('success', '✅ Producto actualizado exitosamente');
                setEditingProduct(null);
                setDrawerOpen(false);
            } else {
                const { data, error } = await supabase
                    .from("products")
                    .insert([productData])
                    .select();
                if (error) throw error;

                await logActivity('product_create', 'product', data?.[0]?.id, {
                    name: productData.name
                });
                showMessage('success', '✅ Producto creado exitosamente');
                setDrawerOpen(false);
            }
            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
        try {
            const product = products.find(p => p.id === id);
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;

            await logActivity('product_delete', 'product', id, { name: product?.name });
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
        setDrawerOpen(true);
        setActiveTab('productos');
    }

    function handleClone(product) {
        const cloned = { ...product, id: undefined, name: `${product.name} (Copia)`, created_at: undefined };
        setEditingProduct(null);
        // Small delay so form resets, then set cloned data
        setTimeout(() => {
            setEditingProduct(cloned);
            setDrawerOpen(true);
        }, 50);
    }

    function openNewProduct() {
        setEditingProduct(null);
        setDrawerOpen(true);
    }

    function handleLogout() {
        sessionStorage.removeItem('admin_auth');
        setAuthenticated(false);
    }

    function showMessage(type, text) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    }

    async function logActivity(action, entityType, entityId, details) {
        try {
            await supabase.from('activity_log').insert({
                action,
                entity_type: entityType,
                entity_id: entityId,
                details
            });
        } catch (e) {
            console.error('Activity log error:', e);
        }
    }

    // Auth Gate
    if (!authenticated) {
        return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
    }

    const sidebarWidth = sidebarCollapsed ? 68 : 240;

    return (
        <SettingsProvider>
            <div className="min-h-screen bg-gray-50/80 font-body text-soft-black">
                {/* Sidebar */}
                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />

                {/* Main Content Area */}
                <div
                    className="transition-all duration-300"
                    style={{ marginLeft: sidebarWidth }}
                >
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold font-display text-brand-blue capitalize">
                                {activeTab === 'dashboard' && 'Panel de Control'}
                                {activeTab === 'productos' && 'Productos'}
                                {activeTab === 'pedidos' && 'Pedidos COD'}
                                {activeTab === 'sync' && 'Sync DroPanas'}
                                {activeTab === 'clientes' && 'Clientes'}
                                {activeTab === 'analytics' && 'Analytics'}
                                {activeTab === 'actividad' && 'Actividad'}
                                {activeTab === 'config' && 'Configuración'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                title="Cerrar sesión"
                            >
                                <span className="material-symbols-outlined text-[16px]">logout</span>
                                Salir
                            </button>
                        </div>
                    </header>

                    {/* Flash Message */}
                    {message && (
                        <div className="fixed top-16 right-4 z-50 animate-slideInRight">
                            <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${message.type === 'success'
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-red-100 text-red-700 border border-red-300'
                                }`}>
                                {message.text}
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <main className="p-6 max-w-7xl">

                        {/* ===== DASHBOARD ===== */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-display text-brand-blue mb-1">¡Hola! 👋</h2>
                                    <p className="text-gray-500 text-sm">Resumen de tu tienda dropshipping</p>
                                </div>
                                <DashboardStats />

                                {/* Quick Actions */}
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-8">Acciones Rápidas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <QuickAction
                                        icon="add_box"
                                        title="Añadir Producto"
                                        desc="Crear nuevo producto con bundles"
                                        onClick={() => { openNewProduct(); setActiveTab('productos'); }}
                                    />
                                    <QuickAction
                                        icon="sync"
                                        title="Sincronizar DroPanas"
                                        desc="Importar reporte del scraper"
                                        onClick={() => setActiveTab('sync')}
                                    />
                                    <QuickAction
                                        icon="group"
                                        title="Ver Clientes"
                                        desc="Base de datos de compradores"
                                        onClick={() => setActiveTab('clientes')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ===== PRODUCTOS ===== */}
                        {activeTab === 'productos' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold font-display text-brand-blue mb-1">Catálogo</h2>
                                        <p className="text-gray-500 text-sm">{products.length} productos en tu tienda</p>
                                    </div>
                                    <button
                                        onClick={openNewProduct}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-[#E63946] hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        Nuevo Producto
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center p-10">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
                                    </div>
                                ) : (
                                    <ProductList
                                        products={products}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onRefresh={fetchProducts}
                                        onToggleStatus={handleToggleStatus}
                                        onClone={handleClone}
                                    />
                                )}

                                <ProductDrawer
                                    isOpen={drawerOpen}
                                    onClose={() => { setDrawerOpen(false); setEditingProduct(null); }}
                                    editingProduct={editingProduct}
                                    onSuccess={handleProductSubmit}
                                />
                            </div>
                        )}

                        {/* ===== PEDIDOS ===== */}
                        {activeTab === 'pedidos' && <OrdersManager />}

                        {/* ===== SYNC ===== */}
                        {activeTab === 'sync' && <SyncDashboard />}

                        {/* ===== CLIENTES ===== */}
                        {activeTab === 'clientes' && <CustomersManager />}

                        {/* ===== ANALYTICS ===== */}
                        {activeTab === 'analytics' && <AdminAnalytics />}

                        {/* ===== ACTIVIDAD ===== */}
                        {activeTab === 'actividad' && <ActivityLog />}

                        {/* ===== CONFIG ===== */}
                        {activeTab === 'config' && <AdminSettings />}
                    </main>
                </div>
            </div >
        </SettingsProvider >
    );
}

function QuickAction({ icon, title, desc, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-white p-5 rounded-xl border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all text-left group"
        >
            <span className="material-symbols-outlined text-brand-blue text-[36px] mb-2 block group-hover:scale-110 transition-transform">
                {icon}
            </span>
            <h3 className="font-bold text-base mb-0.5">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
        </button>
    );
}
