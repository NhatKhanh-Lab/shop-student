import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { UserRole } from './types';

// Protected Route for Admin
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: UserRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === UserRole.ADMIN && user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Protected Route for Authenticated Users
const UserRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<ProductList />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              
              {/* User Routes */}
              <Route path="history" element={
                  <UserRoute>
                      <OrderHistory />
                  </UserRoute>
              } />
              <Route path="profile" element={
                  <UserRoute>
                      <UserProfile />
                  </UserRoute>
              } />
            </Route>
            
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;