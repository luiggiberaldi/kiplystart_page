import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { slugify } from "../utils/slugify";

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
import AdminMobileNav from "../components/admin/AdminMobileNav";
import ConfirmModal from "../components/admin/ConfirmModal";
import { SettingsProvider } from "../context/SettingsContext";
import useIsMobile from "../hooks/useIsMobile";
import useOrderNotifications from "../hooks/useOrderNotifications";

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
    const [orderNotification, setOrderNotification] = useState(null);
    const isMobile = useIsMobile();

    // ── New order real-time notifications ──
    useOrderNotifications((newOrder) => {
        setOrderNotification(newOrder);
        // Auto-dismiss after 8s
        setTimeout(() => setOrderNotification(null), 8000);
    }, authenticated);

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
            // Auto-generate SEO slug from product name
            if (productData.name) {
                productData.slug = slugify(productData.name);
            }

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

    // ── Delete confirmation flow ──
    const [deleteTarget, setDeleteTarget] = useState(null);

    function handleDelete(id) {
        const product = products.find(p => p.id === id);
        setDeleteTarget(product || { id });
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        try {
            const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
            if (error) throw error;

            await logActivity('product_delete', 'product', deleteTarget.id, { name: deleteTarget?.name });
            showMessage('success', '✅ Producto eliminado permanentemente');
            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        } finally {
            setDeleteTarget(null);
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
                    className="transition-all duration-300 min-h-screen"
                    style={{
                        marginLeft: isMobile ? 0 : sidebarWidth,
                        paddingBottom: isMobile ? '72px' : 0
                    }}
                >
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {isMobile && (
                                <div className="w-8 h-8 bg-[#0A2463] rounded-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
                                </div>
                            )}
                            <h1 className="text-base md:text-lg font-bold font-display text-brand-blue capitalize truncate">
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
                    <main className="p-4 md:p-6 max-w-7xl">

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
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold font-display text-brand-blue mb-0.5">Catálogo</h2>
                                        <p className="text-gray-500 text-xs md:text-sm">{products.length} productos en tu tienda</p>
                                    </div>
                                    <button
                                        onClick={openNewProduct}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E63946] hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-500/20 w-full md:w-auto"
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

                    {/* Delete Confirmation Modal */}
                    <ConfirmModal
                        isOpen={!!deleteTarget}
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={confirmDelete}
                        title="Eliminar producto"
                        message={`"${deleteTarget?.name || ''}" será eliminado permanentemente de tu catálogo. Esta acción no se puede deshacer.`}
                        confirmText="Eliminar permanentemente"
                        icon="delete_forever"
                    />

                    {/* New Order Notification Toast */}
                    {orderNotification && (
                        <div
                            className="fixed top-4 right-4 z-[300] max-w-sm w-full animate-slideUp cursor-pointer"
                            onClick={() => { setActiveTab('pedidos'); setOrderNotification(null); }}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                                <div className="p-4 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-green-600 text-[22px]">shopping_bag</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm text-gray-900">🎉 ¡Nuevo Pedido!</p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {orderNotification.user_name} — {orderNotification.product_name}
                                        </p>
                                        <p className="text-xs font-bold text-green-600 mt-0.5">
                                            ${orderNotification.total_price?.toFixed(2)} USD
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setOrderNotification(null); }}
                                        className="text-gray-300 hover:text-gray-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </div>
                                <div className="px-4 pb-3">
                                    <p className="text-[10px] text-gray-400">Toca para ver pedidos</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Bottom Navigation */}
                    {isMobile && (
                        <AdminMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    )}
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
