import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_ORDERS } from '../data';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Tính toán nhanh số liệu (Mock)
  const myOrders = MOCK_ORDERS.filter(o => o.userId === user.id);
  const totalSpent = myOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Header Cover */}
           <div className="relative h-48 rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
               <div className="absolute inset-0 opacity-30">
                   <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                   </svg>
               </div>
           </div>

           {/* Profile Card */}
           <div className="relative -mt-20 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
               <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
                   <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                   />
                   <div className="flex-1 text-center sm:text-left mb-2">
                       <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
                       <p className="text-gray-500 font-medium">{user.email}</p>
                       <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                           {user.role} Member
                       </span>
                   </div>
                   <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                       Chỉnh sửa
                   </button>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                       <span className="material-symbols-outlined text-3xl text-blue-500 mb-2">shopping_bag</span>
                       <p className="text-gray-500 text-sm font-medium">Đơn hàng</p>
                       <p className="text-2xl font-black text-gray-900">{myOrders.length}</p>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                       <span className="material-symbols-outlined text-3xl text-green-500 mb-2">payments</span>
                       <p className="text-gray-500 text-sm font-medium">Chi tiêu</p>
                       <p className="text-2xl font-black text-gray-900">{totalSpent.toLocaleString()} đ</p>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                       <span className="material-symbols-outlined text-3xl text-purple-500 mb-2">loyalty</span>
                       <p className="text-gray-500 text-sm font-medium">Điểm tích lũy</p>
                       <p className="text-2xl font-black text-gray-900">{Math.floor(totalSpent / 10000)}</p>
                   </div>
               </div>

               {/* Menu Options */}
               <div className="space-y-2">
                   <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Cài đặt & Tùy chọn</h3>
                   
                   <Link to="/history" className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 group transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                               <span className="material-symbols-outlined">receipt_long</span>
                           </div>
                           <span className="font-semibold text-gray-700 group-hover:text-gray-900">Lịch sử mua hàng</span>
                       </div>
                       <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                   </Link>

                   <Link to="/cart" className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 group transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                               <span className="material-symbols-outlined">shopping_cart</span>
                           </div>
                           <span className="font-semibold text-gray-700 group-hover:text-gray-900">Giỏ hàng của tôi</span>
                       </div>
                       <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                   </Link>

                   <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 group transition-colors text-left">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                               <span className="material-symbols-outlined">lock</span>
                           </div>
                           <span className="font-semibold text-gray-700 group-hover:text-gray-900">Đổi mật khẩu</span>
                       </div>
                       <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                   </button>

                   <div className="border-t border-gray-100 my-4 pt-2"></div>

                   <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 group transition-colors text-left">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                               <span className="material-symbols-outlined">logout</span>
                           </div>
                           <span className="font-semibold text-gray-700 group-hover:text-red-700">Đăng xuất</span>
                       </div>
                   </button>
               </div>
           </div>
       </div>
    </div>
  );
};

export default UserProfile;