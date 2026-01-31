
import React, { useState } from 'react';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_USERS } from '../data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OrderStatus, Product, User, UserRole, Order } from '../types';
import { useAuth } from '../context/AuthContext';
/* Import useNavigate from react-router to fix missing exported member error */
import { useNavigate } from 'react-router';

// Mock chart data
const REVENUE_DATA = [
  { name: 'T1', revenue: 40000000 },
  { name: 'T2', revenue: 30000000 },
  { name: 'T3', revenue: 20000000 },
  { name: 'T4', revenue: 27800000 },
  { name: 'T5', revenue: 18900000 },
  { name: 'T6', revenue: 23900000 },
  { name: 'T7', revenue: 34900000 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Product Form State
  const [prodForm, setProdForm] = useState({
      name: '', category: '', price: 0, stock: 0, image: '', description: ''
  });

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  // --- PRODUCT ACTIONS ---
  const handleOpenProductModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setProdForm({
              name: product.name,
              category: product.category,
              price: product.price,
              stock: product.stock,
              image: product.image,
              description: product.description
          });
      } else {
          setEditingProduct(null);
          setProdForm({ name: '', category: '', price: 0, stock: 0, image: 'https://picsum.photos/200', description: '' });
      }
      setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...prodForm, rating: p.rating } : p));
      } else {
          const newProduct: Product = {
              id: Date.now(),
              ...prodForm,
              rating: 5.0
          };
          setProducts([newProduct, ...products]);
      }
      setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
          setProducts(products.filter(p => p.id !== id));
      }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = (orderId: string) => {
      if (window.confirm('Xóa lịch sử đơn hàng này?')) {
          setOrders(orders.filter(o => o.id !== orderId));
      }
  };

  const handleViewOrder = (order: Order) => {
      setSelectedOrder(order);
      setIsOrderModalOpen(true);
  };

  // --- USER ACTIONS ---
  const handleDeleteUser = (userId: number) => {
      if (userId === user?.id) {
          alert("Không thể tự xóa tài khoản admin đang đăng nhập!");
          return;
      }
      if (window.confirm('Xóa người dùng này khỏi hệ thống?')) {
          setUsers(users.filter(u => u.id !== userId));
      }
  };

  const handleToggleRole = (userId: number) => {
      setUsers(users.map(u => {
          if (u.id === userId) {
              return { ...u, role: u.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN };
          }
          return u;
      }));
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  const SidebarItem = ({ id, icon, label }: { id: typeof activeTab, icon: string, label: string }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
            activeTab === id 
            ? 'bg-primary text-white shadow-lg shadow-blue-500/30' 
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        <span className={`material-symbols-outlined text-[20px] ${activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</span>
        {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 h-full">
        <div className="flex items-center px-8 h-20 border-b border-gray-50">
           <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
                <span className="font-bold text-xl tracking-tight text-gray-900 uppercase">Vercel Deploy</span>
           </div>
        </div>
        
        <div className="flex-1 flex flex-col p-6 space-y-2 overflow-y-auto">
           <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Management</p>
           <SidebarItem id="overview" icon="dashboard" label="Tổng quan" />
           <SidebarItem id="products" icon="inventory_2" label="Sản phẩm" />
           <SidebarItem id="orders" icon="shopping_bag" label="Đơn hàng" />
           <SidebarItem id="users" icon="group" label="Khách hàng" />
        </div>

        <div className="p-6 border-t border-gray-50">
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <span className="material-symbols-outlined text-sm">cloud_done</span>
                    <span className="text-xs font-bold uppercase">Deployment Status</span>
                </div>
                <p className="text-[10px] text-blue-600 font-medium leading-tight">Ứng dụng đã sẵn sàng cho Production trên Vercel.</p>
            </div>
            <div className="flex items-center gap-3 mb-4 px-4">
                <img src={user?.avatar || "https://i.pravatar.cc/150?u=admin"} alt="Admin" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">Administrator</p>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2.5 rounded-lg transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Đăng xuất
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
              {/* Header with Deployment Info */}
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Live Production</span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">
                        {activeTab === 'overview' ? 'Bảng điều khiển' : 
                         activeTab === 'products' ? 'Quản lý kho' : 
                         activeTab === 'orders' ? 'Đơn hàng' : 'Người dùng'}
                    </h2>
                  </div>
                  <div className="flex gap-3">
                      <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs font-medium text-gray-500">
                          <span className="material-symbols-outlined text-sm">lan</span>
                          Region: sin1
                      </div>
                      {activeTab === 'products' && (
                          <button onClick={() => handleOpenProductModal()} className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 flex items-center gap-2 transition-transform active:scale-95">
                              <span className="material-symbols-outlined text-[18px]">add</span>
                              Thêm mới
                          </button>
                      )}
                  </div>
              </div>
          
              {/* --- OVERVIEW TAB --- */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                   {/* Stat Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                          { label: 'Doanh thu', value: `${totalRevenue.toLocaleString()} đ`, icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
                          { label: 'Đơn hàng', value: orders.length, icon: 'shopping_cart', color: 'text-blue-600', bg: 'bg-blue-50' },
                          { label: 'Sản phẩm', value: products.length, icon: 'inventory', color: 'text-purple-600', bg: 'bg-purple-50' },
                          { label: 'User', value: users.length, icon: 'person', color: 'text-orange-600', bg: 'bg-orange-50' }
                      ].map((stat, index) => (
                          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary transition-all group">
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                   <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                   <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                             </div>
                          </div>
                      ))}
                   </div>

                   {/* Charts */}
                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Hiệu suất kinh doanh</h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                    <span className="w-3 h-3 rounded-full bg-primary opacity-20"></span> Doanh thu dự kiến
                                </span>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                                <Tooltip 
                                contentStyle={{backgroundColor: '#111827', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                itemStyle={{color: '#fff', fontWeight: 'bold'}}
                                cursor={{stroke: '#2563EB', strokeWidth: 2, strokeDasharray: '5 5'}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
              )}

              {/* ... Rest of the tabs (Products, Orders, Users) ... */}
              {activeTab === 'products' && (
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                       <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50/50">
                             <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá bán</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kho</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Tùy chọn</th>
                             </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                             {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                   <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                         <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img className="h-full w-full object-cover" src={product.image} alt="" />
                                         </div>
                                         <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[200px]">{product.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono tracking-tighter">SKU: {product.id}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-lg bg-gray-100 text-gray-500 uppercase tracking-widest border border-gray-200">
                                        {product.category}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{product.price.toLocaleString()} đ</td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                         <div className={`h-1.5 w-1.5 rounded-full mr-2 ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                         <span className={`text-sm font-medium ${product.stock > 10 ? 'text-gray-600' : 'text-red-600 font-bold'}`}>{product.stock} pcs</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button onClick={() => handleOpenProductModal(product)} className="text-gray-400 hover:text-primary mx-1 p-2 hover:bg-blue-50 rounded-lg transition-all"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                      <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500 mx-1 p-2 hover:bg-red-50 rounded-lg transition-all"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {/* Reuse other parts of AdminDashboard but with this enhanced styling */}
              {activeTab === 'orders' && (
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                       <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50/50">
                             <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Tác vụ</th>
                             </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                             {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                   <td className="px-6 py-4 whitespace-nowrap">
                                       <span className="text-sm font-black text-primary font-mono tracking-tighter">#{order.id}</span>
                                       <div className="text-[10px] text-gray-400 mt-0.5">{order.date}</div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{order.customerName}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">{order.totalAmount.toLocaleString()} đ</td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                      <select 
                                        value={order.status}
                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                        className={`block w-full pl-3 pr-8 py-1.5 text-xs font-black rounded-lg border-gray-200 focus:outline-none focus:ring-primary focus:border-primary uppercase tracking-wider cursor-pointer transition-all
                                            ${order.status === OrderStatus.COMPLETED ? 'bg-green-50 text-green-700' : 
                                              order.status === OrderStatus.PENDING ? 'bg-yellow-50 text-yellow-700' :
                                              order.status === OrderStatus.SHIPPING ? 'bg-blue-50 text-blue-700' :
                                              'bg-red-50 text-red-700'
                                            }
                                        `}
                                      >
                                          {Object.values(OrderStatus).map((status) => (
                                              <option key={status} value={status}>{status}</option>
                                          ))}
                                      </select>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button 
                                        onClick={() => handleViewOrder(order)} 
                                        className="text-gray-400 hover:text-primary p-2 hover:bg-blue-50 rounded-lg transition-all"
                                      >
                                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {activeTab === 'users' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50/50">
                              <tr>
                                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quyền hạn</th>
                                 <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Tác vụ</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                              {users.map((u) => (
                                 <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="flex items-center">
                                          <img className="h-10 w-10 rounded-full border-2 border-white shadow-sm" src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} alt="" />
                                          <div className="ml-4">
                                             <div className="text-sm font-black text-gray-900">{u.name}</div>
                                             <div className="text-[10px] text-gray-400 font-mono">UID: {u.id}</div>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleToggleRole(u.id)}
                                            className={`px-3 py-1 inline-flex text-[10px] font-black rounded-lg border uppercase tracking-widest cursor-pointer hover:shadow-md transition-all
                                            ${u.role === UserRole.ADMIN ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-gray-600 border-gray-200'}
                                        `}>
                                            {u.role}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                       <button onClick={() => handleDeleteUser(u.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all">
                                           <span className="material-symbols-outlined text-[20px]">delete</span>
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
              )}
          </div>
        </main>
      </div>

      {/* --- MODAL ADD/EDIT PRODUCT (Simplified for brevity, assuming existing logic) --- */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-[60] overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen p-4">
                  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                      <div className="p-8">
                          <h3 className="text-2xl font-black text-gray-900 mb-6">
                              {editingProduct ? 'Cập nhật sản phẩm' : 'Sản phẩm mới'}
                          </h3>
                          <form onSubmit={handleSaveProduct} className="space-y-5">
                              <div>
                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tên hiển thị</label>
                                  <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium"
                                      value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phân loại</label>
                                      <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium"
                                          value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Số lượng kho</label>
                                      <input type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium"
                                          value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: Number(e.target.value)})} />
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Giá niêm yết (VNĐ)</label>
                                  <input type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold text-primary"
                                      value={prodForm.price} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                              </div>
                              <div className="flex gap-4 pt-4">
                                  <button type="submit" className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                                      {editingProduct ? 'Lưu thay đổi' : 'Thêm vào kho'}
                                  </button>
                                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                                      Hủy
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL VIEW ORDER --- */}
      {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[60] overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen p-4">
                  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)}></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
                      <div className="p-8">
                          <div className="flex justify-between items-start mb-8">
                              <div>
                                  <h3 className="text-2xl font-black text-gray-900">Chi tiết hóa đơn</h3>
                                  <p className="text-xs text-gray-500 mt-1 font-mono tracking-tight uppercase">Order ID: {selectedOrder.id}</p>
                              </div>
                              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                ${selectedOrder.status === OrderStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-100' : 
                                  selectedOrder.status === OrderStatus.PENDING ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                  selectedOrder.status === OrderStatus.SHIPPING ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  'bg-red-50 text-red-700 border-red-100'}`}>
                                  {selectedOrder.status}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                              <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Khách hàng</p>
                                  <p className="text-base font-bold text-gray-900">{selectedOrder.customerName}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Thời gian đặt</p>
                                  <p className="text-base font-bold text-gray-900">{selectedOrder.date}</p>
                              </div>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Danh mục sản phẩm</p>
                              <div className="space-y-4">
                                 {Array.from({ length: selectedOrder.items }).map((_, idx) => {
                                     const demoProd = products[idx % products.length] || products[0];
                                     return (
                                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                                                    <img src={demoProd.image} className="w-full h-full object-cover" alt=""/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{demoProd.name}</p>
                                                    <p className="text-[10px] text-gray-500">{demoProd.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{demoProd.price.toLocaleString()}đ</p>
                                                <p className="text-[10px] text-gray-400">Qty: 01</p>
                                            </div>
                                        </div>
                                     )
                                 })}
                              </div>
                          </div>

                          <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900 uppercase tracking-widest">Tổng tiền</span>
                              <span className="text-3xl font-black text-primary">{selectedOrder.totalAmount.toLocaleString()} <span className="text-sm font-medium">đ</span></span>
                          </div>
                          
                          <div className="mt-8">
                             <button onClick={() => setIsOrderModalOpen(false)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl">Đóng cửa sổ</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
