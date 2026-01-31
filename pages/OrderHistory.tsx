import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ORDERS } from '../data'; // Trong thực tế sẽ gọi API
import { OrderStatus, Order } from '../types';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      // Lọc đơn hàng của user đang đăng nhập
      // Trong thực tế, đây sẽ là API call: await getOrdersByUserId(user.id)
      const myOrders = MOCK_ORDERS.filter(o => o.userId === user.id);
      setOrders(myOrders);
    }
  }, [user]);

  const filteredOrders = activeStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeStatus);

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
          case OrderStatus.SHIPPING: return 'bg-blue-100 text-blue-700 border-blue-200';
          case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-gray-900">Lịch sử đơn hàng</h1>
            <Link to="/profile" className="text-primary hover:underline flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined">person</span>
                Hồ sơ của tôi
            </Link>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 no-scrollbar">
            {['All', ...Object.values(OrderStatus)].map((status) => (
                <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                        activeStatus === status 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {status === 'All' ? 'Tất cả đơn' : status}
                </button>
            ))}
        </div>

        {/* Order List */}
        <div className="space-y-6">
            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-primary rounded-xl">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                    <p className="font-bold text-gray-900">{order.id}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-3">
                                <span className="text-sm text-gray-500">{order.date}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{order.items} sản phẩm</p>
                                <p className="text-xl font-black text-gray-900">{order.totalAmount.toLocaleString()} đ</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-gray-400 text-4xl">shopping_bag</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong trạng thái này.</p>
                    <Link to="/products" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-700 transition">
                        Khám phá cửa hàng
                    </Link>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;