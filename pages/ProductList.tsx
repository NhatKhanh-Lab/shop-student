import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header & Filter Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cửa hàng</h1>
                <p className="text-gray-500 mt-2">Tìm kiếm thiết bị phù hợp nhất cho việc học tập của bạn.</p>
             </div>
             
             {/* Search Input */}
             <div className="w-full md:w-96 relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                   <span className="material-symbols-outlined">search</span>
                </span>
                <input 
                   type="text" 
                   placeholder="Tìm kiếm sản phẩm (Macbook, Chuột...)" 
                   className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          {/* Category Pills */}
          <div className="mt-8 flex overflow-x-auto pb-2 no-scrollbar gap-3">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                   selectedCategory === cat 
                   ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                   : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                 }`}
               >
                 {cat === 'All' ? 'Tất cả' : cat}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredProducts.length > 0 ? (
            <div>
                <p className="text-sm text-gray-500 mb-6 font-medium">Hiển thị {filteredProducts.length} sản phẩm</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                    <span className="material-symbols-outlined text-gray-300 text-6xl">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">Chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchTerm}".</p>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('All')}} 
                    className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
                >
                    Xóa bộ lọc
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;