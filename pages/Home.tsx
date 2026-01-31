import React from 'react';
import { MOCK_PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  const scrollToFeatured = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('featured');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Modern Hero Section */}
      <div className="relative bg-white overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-indigo-100 blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left z-10 relative">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
                    🚀 Dành riêng cho sinh viên
                </span>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                    Nâng cấp <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Góc học tập</span> <br/>
                    của bạn.
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Sở hữu ngay laptop, tai nghe và phụ kiện công nghệ với mức giá ưu đãi nhất. Hỗ trợ trả góp, bảo hành chính hãng.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to="/products" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Mua sắm ngay
                        <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                    </Link>
                    <button 
                        onClick={scrollToFeatured}
                        className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Xem ưu đãi
                    </button>
                </div>
                
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-gray-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">check_circle</span> Chính hãng 100%
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">check_circle</span> Freeship
                    </div>
                </div>
            </div>
            
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] group">
                    <img 
                        src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
                        alt="Hero Device" 
                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Floating Cards */}
                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg animate-bounce duration-[3000ms]">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <span className="material-symbols-outlined">percent</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Giảm giá</p>
                                <p className="font-bold text-gray-900">đến 30%</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Khám phá danh mục</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-96">
            {/* Large Card */}
            <Link to="/products" className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Laptop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end">
                    <h3 className="text-3xl font-bold text-white mb-2">Laptops & MacBooks</h3>
                    <p className="text-gray-200">Hiệu năng mạnh mẽ cho mọi tác vụ.</p>
                </div>
            </Link>
            
            {/* Small Card 1 */}
            <Link to="/products" className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all bg-gray-100">
                 <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Audio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors p-6 flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-4xl text-white mb-2">headphones</span>
                    <h3 className="text-xl font-bold text-white">Âm thanh</h3>
                 </div>
            </Link>

            {/* Small Card 2 */}
            <Link to="/products" className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all bg-indigo-50">
                 <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors p-6 flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-4xl text-white mb-2">keyboard</span>
                    <h3 className="text-xl font-bold text-white">Phụ kiện</h3>
                 </div>
            </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
                    <p className="text-gray-500 mt-2">Được nhiều sinh viên lựa chọn nhất tuần qua</p>
                </div>
                <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-blue-700 transition-colors group">
                    Xem tất cả 
                    <span className="bg-blue-100 rounded-full p-1 group-hover:bg-blue-200 transition-colors">
                        <span className="material-symbols-outlined text-sm block">arrow_forward</span>
                    </span>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
                <Link to="/products" className="inline-block px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Xem tất cả sản phẩm</Link>
            </div>
        </div>
      </section>
      
       {/* Promo Banner */}
       <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden bg-gray-900 text-white relative">
             <div className="absolute inset-0">
                 <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" alt="Tech" className="w-full h-full object-cover opacity-30" />
                 <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
             </div>
             <div className="relative py-16 px-8 sm:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="max-w-lg">
                     <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm">Flash Sale</span>
                     <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight">Giảm ngay 20% cho thành viên mới</h2>
                     <p className="text-gray-300 text-lg mb-8">Đăng ký tài khoản ngay hôm nay để nhận mã giảm giá đặc biệt. Áp dụng cho toàn bộ đơn hàng đầu tiên.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/login" className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-center">Đăng ký ngay</Link>
                        <button className="px-8 py-3 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition backdrop-blur-sm">Tìm hiểu thêm</button>
                     </div>
                 </div>
                 <div className="hidden lg:block bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-xs transform rotate-3">
                     <div className="text-center">
                         <p className="text-gray-300 text-sm uppercase tracking-widest mb-2">Code: STUDENT20</p>
                         <div className="text-3xl font-mono font-bold text-white tracking-widest border-2 border-dashed border-white/30 p-4 rounded-lg">
                             SAVE20%
                         </div>
                         <p className="text-xs text-gray-400 mt-3">Hết hạn sau 3 ngày</p>
                     </div>
                 </div>
             </div>
          </div>
       </section>
    </div>
  );
};

export default Home;