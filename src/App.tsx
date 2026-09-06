/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Franchise from './pages/Franchise';
import About from './pages/About';
import CartPage from './pages/Cart';
import Profile from './pages/Profile';
import CartDrawer from './components/CartDrawer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/Auth';
import AdminPage from './pages/Admin';

import { useLocation } from 'react-router-dom';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#593222] font-serif">
      {!isAdmin && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/contact" element={<Contact />} />
          {/* Protected Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}


