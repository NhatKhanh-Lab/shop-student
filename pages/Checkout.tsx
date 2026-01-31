
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'vnpay' // 'vnpay' or 'cod'
  });

  if (cartItems.length === 0) {
      return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address) {
        showToast('error', 'Lỗi thông tin', 'Vui lòng điền đầy đủ các thông tin giao hàng.');
        return;
    }

    setLoading(true);
    showToast('info', 'Đang xử lý', 'Hệ thống đang chuẩn bị cổng thanh toán...');

    if (formData.paymentMethod === 'vnpay') {
        setTimeout(() => {
            clearCart();
            showToast('success', 'Thanh toán', 'Thanh toán qua VNPAY thành công!');
            navigate('/payment-success', { 
                state: { 
                    orderId: `ORD-${Date.now()}`, 
                    amount: cartTotal,
                    method: 'VNPAY Sandbox' 
                } 
            });
        }, 2500);
    } else {
        setTimeout(() => {
            clearCart();
            showToast('success', 'Đặt hàng', 'Đơn hàng COD của bạn đã được ghi nhận.');
            navigate('/payment-success', { 
                state: { 
                    orderId: `ORD-${Date.now()}`, 
                    amount: cartTotal,
                    method: 'Thanh toán khi nhận hàng (COD)' 
                } 
            });
        }, 2000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm">
             <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/cart')}>Giỏ hàng</span>
             <span>/</span>
             <span className="text-gray-900 font-semibold">Thanh toán</span>
         </div>

         {loading ? (
             <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                 <h3 className="text-xl font-bold text-gray-800">Đang chuyển hướng đến VNPAY...</h3>
                 <p className="text-gray-500">Vui lòng không tắt trình duyệt.</p>
             </div>
         ) : (
             <form onSubmit={handlePayment} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                
                {/* Shipping Info */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Thông tin giao hàng
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                <input type="text" name="fullName" required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white" placeholder="Nguyễn Văn A" onChange={handleInputChange} />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input type="tel" name="phone" required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white" placeholder="0912..." onChange={handleInputChange} />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh / Thành phố</label>
                                <input type="text" name="city" required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white" placeholder="Hà Nội" onChange={handleInputChange} />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ chi tiết</label>
                                <input type="text" name="address" required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white" placeholder="Số 123, đường ABC..." onChange={handleInputChange} />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700">Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea name="note" rows={3} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white" onChange={handleInputChange}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Phương thức thanh toán
                        </h2>

                        <div className="space-y-4">
                            <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'vnpay' ? 'border-primary ring-1 ring-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="vnpay" 
                                    checked={formData.paymentMethod === 'vnpay'} 
                                    onChange={handleInputChange} 
                                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" 
                                />
                                <div className="ml-3 flex flex-1 items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="block text-sm font-bold text-gray-900">Thanh toán qua VNPAY</span>
                                        <span className="block text-xs text-gray-500 mt-1">Quét mã QR hoặc dùng thẻ ATM/Visa nội địa</span>
                                    </div>
                                    <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.png" alt="VNPAY" className="h-8 object-contain" />
                                </div>
                            </label>

                            <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary ring-1 ring-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="cod" 
                                    checked={formData.paymentMethod === 'cod'} 
                                    onChange={handleInputChange} 
                                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" 
                                />
                                <div className="ml-3">
                                    <span className="block text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                                    <span className="block text-xs text-gray-500 mt-1">Thanh toán tiền mặt cho shipper khi nhận hàng</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mt-8 lg:mt-0 lg:col-span-5">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                             <h3 className="text-lg font-bold text-gray-900">Đơn hàng của bạn ({cartItems.length} sản phẩm)</h3>
                        </div>
                        <div className="px-6 py-6 max-h-96 overflow-y-auto">
                            <ul className="space-y-4">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3 className="line-clamp-1 text-sm">{item.name}</h3>
                                                    <p className="ml-4 text-sm">{item.price.toLocaleString()}đ</p>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="text-gray-500">x {item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-3">
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <p>Tạm tính</p>
                                <p>{cartTotal.toLocaleString()} đ</p>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <p>Phí vận chuyển</p>
                                <p className="text-green-600">Miễn phí</p>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                                <p>Tổng cộng</p>
                                <p className="text-primary">{cartTotal.toLocaleString()} đ</p>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform active:scale-95 flex justify-center items-center gap-2"
                            >
                                {formData.paymentMethod === 'vnpay' ? 'Thanh toán ngay' : 'Đặt hàng'}
                            </button>
                        </div>
                    </div>
                </div>
             </form>
         )}
      </div>
    </div>
  );
};

export default Checkout;
