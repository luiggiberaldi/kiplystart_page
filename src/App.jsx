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

// Lazy-loaded routes for code splitting
const Catalogo = React.lazy(() => import('./views/Catalogo'));
const ProductDetail = React.lazy(() => import('./views/ProductDetail'));

const Terminos = React.lazy(() => import('./views/Terminos'));
const Privacidad = React.lazy(() => import('./views/Privacidad'));
const Soporte = React.lazy(() => import('./views/Soporte'));
const AdminPortal = React.lazy(() => import('./views/AdminPortal'));
const NotFound = React.lazy(() => import('./views/NotFound'));

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

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductDetail />} />

          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/admin-portal-2026" element={<AdminPortal />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
