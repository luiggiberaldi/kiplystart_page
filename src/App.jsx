/**
 * Main App Component
 * @description
 * Root application with React Router v6 configuration.
 * Implements SPA navigation following TECHNICAL_BRAIN_2026.md.
 * 
 * Routes:
 * - / → Home (landing page)
 * - /catalogo → Product catalog
 * - /producto/:id → Product detail
 * - /checkout → Checkout flow
 * - /admin-portal-2026 → Admin panel
 * 
 * @returns {JSX.Element} App with router
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Catalogo from './views/Catalogo';
import ProductDetail from './views/ProductDetail';
import Checkout from './views/Checkout';
import AdminPortal from './views/AdminPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin-portal-2026" element={<AdminPortal />} />

        {/* 404 Fallback */}
        <Route path="*" element={
          <div className="min-h-screen bg-brand-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-sans font-bold text-4xl text-brand-blue mb-4">404</h1>
              <p className="font-body text-lg mb-4">Página no encontrada</p>
              <a href="/" className="text-steel-blue hover:underline">Volver al inicio</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
