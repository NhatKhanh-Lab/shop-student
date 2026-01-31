import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout, login } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Demo helper to quickly switch accounts
  const handleQuickLogin = (role: UserRole) => {
    login("demo", role);
    navigate(role === UserRole.ADMIN ? '/admin' : '/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">shopping_bag</span>
              <span className="font-bold text-xl text-gray-900 tracking-tight">ShopStudent</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Trang chủ
              </Link>
              <Link to="/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Sản phẩm
              </Link>
              {user?.role === UserRole.ADMIN && (
                <Link to="/admin" className="border-transparent text-primary hover:text-blue-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search - Hidden on mobile for simplicity */}
            <div className="hidden lg:flex relative mx-4">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
               </span>
               <input 
                  type="text" 
                  className="bg-gray-100 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all w-64"
                  placeholder="Tìm kiếm sản phẩm..."
               />
            </div>

            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <img className="h-8 w-8 rounded-full object-cover border border-gray-200" src={user.avatar} alt={user.name} />
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-all duration-200">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ</Link>
                    <Link to="/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đơn mua</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Đăng xuất</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                 <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">Đăng nhập</Link>
                 <button onClick={() => handleQuickLogin(UserRole.USER)} className="hidden md:block text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200">User Demo</button>
                 <button onClick={() => handleQuickLogin(UserRole.ADMIN)} className="hidden md:block text-xs bg-blue-100 px-2 py-1 rounded text-blue-600 hover:bg-blue-200">Admin Demo</button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
              <div className="pt-2 pb-3 space-y-1">
                  <Link to="/" className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-indigo-50">Trang chủ</Link>
                  <Link to="/products" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">Sản phẩm</Link>
                  {user?.role === UserRole.ADMIN && (
                       <Link to="/admin" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">Quản trị</Link>
                  )}
              </div>
          </div>
      )}
    </nav>
  );
};

export default Navbar;
