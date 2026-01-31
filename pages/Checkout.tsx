
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Address } from '../types';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, saveAddress } = useAuth();
  const navigate = useNavigate();

  const [paymentStep, setPaymentStep] = useState<'info' | 'processing_vnpay'>('info');
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'vnpay' // 'vnpay' or 'cod'
  });

  // Effect to handle saved address logic
  useEffect(() => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
        setUseSavedAddress(true);
        const defaultAddr = user.savedAddresses.find(a => a.isDefault) || user.savedAddresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData(prev => ({
            ...prev,
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            address: defaultAddr.address,
            city: defaultAddr.city
        }));
    }
  }, [user]);

  if (cartItems.length === 0) {
      return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSelectSavedAddress = (addr: Address) => {
      setSelectedAddressId(addr.id);
      setFormData(prev => ({
          ...prev,
          fullName: addr.fullName,
          phone: addr.phone,
          address: addr.address,
          city: addr.city
      }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address) {
        showToast('error', 'Lỗi thông tin', 'Vui lòng điền đầy đủ các thông tin giao hàng.');
        return;
    }

    // Save address if requested
    if (!useSavedAddress && saveThisAddress) {
        const newAddr: Address = {
            id: `ADDR-${Date.now()}`,
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
        };
        await saveAddress(newAddr);
        showToast('success', 'Địa chỉ', 'Đã lưu địa chỉ vào danh sách của bạn.');
    }

    if (formData.paymentMethod === 'vnpay') {
        setPaymentStep('processing_vnpay');
        showToast('info', 'VNPAY', 'Đang kết nối tới cổng thanh toán VNPAY...');
        
        // Simulating VNPAY redirect and payment process
        setTimeout(() => {
            clearCart();
            showToast('success', 'Thanh toán', 'Giao dịch qua VNPAY thành công!');
            navigate('/payment-success', { 
                state: { 
                    orderId: `VNP-${Date.now().toString().slice(-8)}`, 
                    amount: cartTotal,
                    method: 'VNPAY (Thẻ ATM/QR-Code)' 
                } 
            });
        }, 3500);
    } else {
        // COD logic: Immediate confirmation
        showToast('info', 'Xác nhận', 'Đang tạo đơn hàng...');
        setTimeout(() => {
            clearCart();
            showToast('success', 'Đặt hàng', 'Đơn hàng của bạn đã được ghi nhận.');
            navigate('/payment-success', { 
                state: { 
                    orderId: `COD-${Date.now().toString().slice(-8)}`, 
                    amount: cartTotal,
                    method: 'Thanh toán khi nhận hàng (COD)' 
                } 
            });
        }, 1200);
    }
  };

  if (paymentStep === 'processing_vnpay') {
      return (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                  <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.png" alt="VNPAY" className="h-12 mx-auto" />
                  
                  <div className="relative">
                      <div className="w-24 h-24 border-4 border-gray-100 border-t-primary rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <h2 className="text-xl font-black text-gray-900">Đang xử lý thanh toán an toàn</h2>
                      <p className="text-gray-500 text-sm">Vui lòng không đóng trình duyệt hoặc tải lại trang. Hệ thống đang xác thực giao dịch với ngân hàng.</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-4 text-left">
                      <div className="bg-white p-3 rounded-xl shadow-sm">
                          <span className="material-symbols-outlined text-primary">qr_code_2</span>
                      </div>
                      <div>
                          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Số tiền thanh toán</p>
                          <p className="text-lg font-black text-primary">{cartTotal.toLocaleString()} đ</p>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm">
             <button className="cursor-pointer hover:text-primary" onClick={() => navigate('/cart')}>Giỏ hàng</button>
             <span>/</span>
             <span className="text-gray-900 font-semibold">Thanh toán</span>
         </div>

         <form onSubmit={handlePayment} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            
            {/* Shipping Info */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            Địa chỉ giao hàng
                        </h2>
                        {user?.savedAddresses && user.savedAddresses.length > 0 && (
                            <button 
                                type="button"
                                onClick={() => setUseSavedAddress(!useSavedAddress)}
                                className="text-sm font-bold text-primary hover:text-blue-700 underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {useSavedAddress ? 'edit_note' : 'list_alt'}
                                </span>
                                {useSavedAddress ? 'Nhập địa chỉ mới' : 'Chọn từ địa chỉ đã lưu'}
                            </button>
                        )}
                    </div>
                    
                    {useSavedAddress && user?.savedAddresses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {user.savedAddresses.map((addr) => (
                                <div 
                                    key={addr.id}
                                    onClick={() => handleSelectSavedAddress(addr)}
                                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                        selectedAddressId === addr.id 
                                        ? 'border-primary bg-blue-50 ring-1 ring-primary' 
                                        : 'border-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                                            {addr.isDefault && <span className="bg-green-100 text-green-700 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Mặc định</span>}
                                        </div>
                                        {selectedAddressId === addr.id && (
                                            <span className="material-symbols-outlined text-primary text-[20px] fill-current">check_circle</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{addr.phone}</p>
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">{addr.address}, {addr.city}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="fullName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Họ và tên</label>
                                <input type="text" name="fullName" required value={formData.fullName} className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 bg-gray-50/50" placeholder="Nguyễn Văn A" onChange={handleInputChange} />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Số điện thoại</label>
                                <input type="tel" name="phone" required value={formData.phone} className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 bg-gray-50/50" placeholder="0912..." onChange={handleInputChange} />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tỉnh / Thành phố</label>
                                <input type="text" name="city" required value={formData.city} className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 bg-gray-50/50" placeholder="Hà Nội" onChange={handleInputChange} />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Địa chỉ chi tiết</label>
                                <input type="text" name="address" required value={formData.address} className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 bg-gray-50/50" placeholder="Số 123, đường ABC..." onChange={handleInputChange} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={saveThisAddress} 
                                        onChange={(e) => setSaveThisAddress(e.target.checked)}
                                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-600">Lưu địa chỉ này vào danh sách cá nhân</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <label htmlFor="note" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ghi chú đơn hàng (Tùy chọn)</label>
                        <textarea name="note" rows={2} className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 bg-gray-50/50" placeholder="Ví dụ: Giao vào giờ hành chính..." onChange={handleInputChange}></textarea>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        Phương thức thanh toán
                    </h2>

                    <div className="space-y-4">
                        <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'vnpay' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="vnpay" 
                                checked={formData.paymentMethod === 'vnpay'} 
                                onChange={handleInputChange} 
                                className="h-5 w-5 text-primary border-gray-300 focus:ring-primary" 
                            />
                            <div className="ml-4 flex flex-1 items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="block text-sm font-black text-gray-900">Thanh toán VNPAY (Khuyên dùng)</span>
                                    <span className="block text-xs text-gray-500 mt-1">Hỗ trợ QR-Code, Ví điện tử, Thẻ ATM/Visa</span>
                                </div>
                                <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.png" alt="VNPAY" className="h-8 object-contain" />
                            </div>
                        </label>

                        <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="cod" 
                                checked={formData.paymentMethod === 'cod'} 
                                onChange={handleInputChange} 
                                className="h-5 w-5 text-primary border-gray-300 focus:ring-primary" 
                            />
                            <div className="ml-4 flex flex-col">
                                <span className="block text-sm font-black text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                                <span className="block text-xs text-gray-500 mt-1">Giao hàng và thu tiền mặt tận nơi</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0 lg:col-span-5">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                         <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Tóm tắt đơn hàng</h3>
                    </div>
                    <div className="px-6 py-6 max-h-96 overflow-y-auto no-scrollbar">
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex gap-4 items-center">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                            <p className="ml-4 text-sm font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}đ</p>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400 font-medium">Qty: {item.quantity} × {item.price.toLocaleString()}đ</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-4">
                        <div className="flex justify-between text-sm font-medium text-gray-600">
                            <p>Tạm tính</p>
                            <p>{cartTotal.toLocaleString()} đ</p>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-gray-600">
                            <p>Phí vận chuyển</p>
                            <p className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Miễn phí</p>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                            <p className="text-base font-bold text-gray-900 uppercase tracking-widest">Tổng cộng</p>
                            <p className="text-3xl font-black text-primary">{cartTotal.toLocaleString()} <span className="text-sm">đ</span></p>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 transform active:scale-95 flex justify-center items-center gap-2 group"
                        >
                            {formData.paymentMethod === 'vnpay' ? 'Thanh toán ngay' : 'Xác nhận đặt hàng'}
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                {formData.paymentMethod === 'vnpay' ? 'credit_card' : 'task_alt'}
                            </span>
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                            <span className="material-symbols-outlined text-[14px]">verified_user</span>
                            Bảo mật bởi SSL & AES-256
                        </div>
                    </div>
                </div>
            </div>
         </form>
      </div>
    </div>
  );
};

export default Checkout;
