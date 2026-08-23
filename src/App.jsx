/**
 * Main App Component
 * @description
 * Root application with React Router v6 configuration.
 * Implements SPA navigation following TECHNICAL_BRAIN_2026.md.
 * Uses React.lazy for route-level code splitting.
 * 
 * Routes:
 * - / → Home (landing page)
 * - /catalogo → Product catalog
 * - /producto/:id → Product detail
 * - /terminos → Terms & Conditions
 * - /privacidad → Privacy Policy
 * - /soporte → Support / Help Center
 * - /admin-portal-2026 → Admin panel
 * 
 * @returns {JSX.Element} App with router
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';

import { lazyWithRetry } from './utils/lazyWithRetry';

// Lazy-loaded routes with auto-recovery for stale chunks after new deployments
const Catalogo = lazyWithRetry(() => import('./views/Catalogo'));
const ProductDetail = lazyWithRetry(() => import('./views/ProductDetail'));
const Terminos = lazyWithRetry(() => import('./views/Terminos'));
const Privacidad = lazyWithRetry(() => import('./views/Privacidad'));
const Soporte = lazyWithRetry(() => import('./views/Soporte'));
const TrackingPage = lazyWithRetry(() => import('./views/TrackingPage'));
const AdminPortal = lazyWithRetry(() => import('./views/AdminPortal'));
const NotFound = lazyWithRetry(() => import('./views/NotFound'));

// Loading fallback for lazy routes
function PageLoader() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-display">Cargando...</p>
      </div>
    </div>
  );
}

import usePageTracker from './hooks/usePageTracker';

import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import CartDrawer from './components/cart/CartDrawer';
import FacebookPixel from './components/FacebookPixel';
import LiveSalesToast from './components/home/LiveSalesToast';
import MobileBottomNav from './components/MobileBottomNav';

function PageTracker() {
  usePageTracker();
  return null;
}

function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <Router>
          <PageTracker />
          <FacebookPixel />
          <LiveSalesToast />
          <MobileBottomNav />
          <Suspense fallback={<PageLoader />}>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/producto/:slug" element={<ProductDetail />} />

              <Route path="/terminos" element={<Terminos />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/soporte" element={<Soporte />} />
              <Route path="/rastreo" element={<TrackingPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/admin-portal-2026" element={<AdminPortal />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </SettingsProvider>
  );
}

export default App;
