
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderHistory from './pages/OrderHistory';
import UserProfile from './pages/UserProfile';
import AIChatbot from './components/AIChatbot';
import { UserRole } from './types';

// Protected Route for Admin - Fix: Make children optional to avoid missing prop error in some TS environments
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra quyền truy cập...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Protected Route for Users - Fix: Make children optional to avoid missing prop error in some TS environments
const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductList />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                
                {/* Private Routes */}
                <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
                <Route path="history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route 
                  path="admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>
            <AIChatbot />
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;