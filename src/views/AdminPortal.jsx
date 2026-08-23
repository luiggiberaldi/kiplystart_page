import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { slugify } from "../utils/slugify";
import { Link } from "react-router-dom";

// Admin Components
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardStats from "../components/admin/DashboardStats";
import ProductList from "../components/admin/ProductList";
import ProductDrawer from "../components/admin/ProductDrawer";
import OrdersManager from "../components/admin/OrdersManager";
import SyncDashboard from "../components/admin/SyncDashboard";
import CustomersManager from "../components/admin/CustomersManager";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import ActivityLog from "../components/admin/ActivityLog";
import AdminSettings from "../components/admin/AdminSettings";
import AdminMobileNav from "../components/admin/AdminMobileNav";
import ConfirmModal from "../components/admin/ConfirmModal";
import { SettingsProvider } from "../context/SettingsContext";
import useIsMobile from "../hooks/useIsMobile";
import useOrderNotifications from "../hooks/useOrderNotifications";
import { 
    Plus, RefreshCw, Users, ShoppingBag, 
    LogOut, ExternalLink, ShieldCheck, 
    CheckCircle2, Sparkles, Package, Bell, 
    ChevronRight, ArrowUpRight, Store
} from 'lucide-react';

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

    const handleNewOrder = useCallback((newOrder) => {
        setOrderNotification(newOrder);
        setTimeout(() => setOrderNotification(null), 8000);
    }, []);

    useOrderNotifications(handleNewOrder, authenticated);

    const fetchProducts = useCallback(async () => {
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
            setMessage({ type: "error", text: "Error al cargar productos" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authenticated && (activeTab === 'productos' || activeTab === 'dashboard')) {
            fetchProducts();
        }
    }, [activeTab, authenticated, fetchProducts]);

    async function handleProductSubmit(productData) {
        try {
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
                showMessage('success', 'Producto actualizado exitosamente');
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
                showMessage('success', 'Producto creado exitosamente');
                setDrawerOpen(false);
            }
            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        }
    }

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
            showMessage('success', 'Producto eliminado permanentemente');
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
            showMessage('success', `Producto ${product.is_active ? 'desactivado' : 'activado'}`);
            fetchProducts();
        } catch (err) {
            showMessage('error', `Error: ${err.message}`);
        }
    }

    async function handleToggleFeatured(product) {
        try {
            const { error } = await supabase
                .from("products")
                .update({ featured: !product.featured })
                .eq('id', product.id);
            if (error) throw error;
            showMessage('success', `${!product.featured ? 'Producto destacado' : 'Destacado removido'}`);
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
        setTimeout(() => {
            setEditingProduct(cloned);
            setDrawerOpen(true);
        }, 50);
    }

    async function logActivity(action, entityType, entityId, details) {
        try {
            await supabase.from('admin_activity_log').insert({
                action,
                entity_type: entityType,
                entity_id: entityId ? String(entityId) : null,
                details: details || {}
            });
        } catch (e) {
            console.warn('Could not log activity:', e);
        }
    }

    function showMessage(type, text) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    }

    function handleLogout() {
        if (confirm('¿Deseas cerrar sesión del Panel Admin?')) {
            sessionStorage.removeItem('admin_auth');
            setAuthenticated(false);
        }
    }

    function openNewProduct() {
        setEditingProduct(null);
        setDrawerOpen(true);
    }

    if (!authenticated) {
        return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
    }

    const sidebarWidth = sidebarCollapsed ? '72px' : '250px';

    const tabTitles = {
        dashboard: 'Panel General y Métricas',
        productos: 'Gestión de Productos',
        pedidos: 'Pedidos COD & DroPanas',
        sync: 'Sincronización de Catálogo',
        clientes: 'Base de Datos de Clientes',
        analytics: 'Analítica de Rendimiento',
        actividad: 'Registro de Auditoría',
        config: 'Configuración del Sistema'
    };

    return (
        <SettingsProvider>
            <div className="min-h-screen bg-slate-50 text-gray-900 flex font-sans">
                {/* Desktop Sidebar */}
                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />

                {/* Main Content Area */}
                <div
                    className="flex-1 transition-all duration-300 min-h-screen flex flex-col"
                    style={{
                        marginLeft: isMobile ? 0 : sidebarWidth,
                        paddingBottom: isMobile ? '72px' : 0
                    }}
                >
                    {/* Modern Top Bar */}
                    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                                <span className="text-gray-400">Admin</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                                <span className="text-gray-950 font-extrabold">{tabTitles[activeTab] || activeTab}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                target="_blank"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-gray-700 transition-colors"
                            >
                                <Store className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Ver Tienda</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Cerrar sesión"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    </header>

                    {/* Flash Message Toast */}
                    {message && (
                        <div className="fixed top-16 right-6 z-50 animate-slideInRight">
                            <div className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-extrabold flex items-center gap-2 border ${
                                message.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-600/10'
                                    : 'bg-red-50 text-red-800 border-red-200 shadow-red-600/10'
                            }`}>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{message.text}</span>
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <main className="p-5 sm:p-8 max-w-7xl w-full flex-1">

                        {/* ===== DASHBOARD ===== */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                                            ¡Hola, Administrador! 👋
                                        </h2>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-medium">
                                            Resumen operativo y métricas en tiempo real de tu tienda dropshipping KiplyStart.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { openNewProduct(); setActiveTab('productos'); }}
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-brand-red/25 cursor-pointer active:scale-95"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Nuevo Producto</span>
                                    </button>
                                </div>

                                <DashboardStats onNavigate={setActiveTab} />

                                {/* Quick Actions */}
                                <div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Acciones Rápidas del Sistema</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <QuickAction
                                            icon={Plus}
                                            title="Añadir Producto"
                                            desc="Crear nuevo producto con ofertas y bundles"
                                            onClick={() => { openNewProduct(); setActiveTab('productos'); }}
                                        />
                                        <QuickAction
                                            icon={RefreshCw}
                                            title="Sincronizar DroPanas"
                                            desc="Actualizar inventario y catálogo de DroPanas"
                                            onClick={() => setActiveTab('sync')}
                                        />
                                        <QuickAction
                                            icon={Users}
                                            title="Base de Clientes"
                                            desc="Consultar compradores, teléfonos y estados"
                                            onClick={() => setActiveTab('clientes')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== PRODUCTOS ===== */}
                        {activeTab === 'productos' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Catálogo de Productos</h2>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{products.length} productos registrados en base de datos</p>
                                    </div>
                                    <button
                                        onClick={openNewProduct}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-red hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-brand-red/25 w-full sm:w-auto cursor-pointer active:scale-95"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Crear Producto</span>
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center p-16">
                                        <div className="w-10 h-10 border-3 border-[#0A2463]/20 border-t-[#0A2463] rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <ProductList
                                        products={products}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onRefresh={fetchProducts}
                                        onToggleStatus={handleToggleStatus}
                                        onToggleFeatured={handleToggleFeatured}
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
                            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                                <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-green-600" />
                                <div className="p-4 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-extrabold text-sm text-gray-950">🎉 ¡Nuevo Pedido COD!</p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate font-medium">
                                            {orderNotification.user_name} — {orderNotification.product_name}
                                        </p>
                                        <p className="text-xs font-black text-emerald-600 mt-0.5">
                                            ${orderNotification.total_price?.toFixed(2)} USD
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 pb-3">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Toca para gestionar pedido</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Bottom Navigation */}
                    {isMobile && (
                        <AdminMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    )}
                </div>
            </div>
        </SettingsProvider>
    );
}

function QuickAction({ icon: Icon, title, desc, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-[#0A2463] hover:shadow-lg transition-all text-left group cursor-pointer"
        >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A2463] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-950 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 font-medium">{desc}</p>
        </button>
    );
}
