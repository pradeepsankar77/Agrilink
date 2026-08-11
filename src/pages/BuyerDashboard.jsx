import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import OrderModal from '../components/OrderModal';
import { Search, Filter, SlidersHorizontal, Tag, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic', 'Spices'];

const BuyerDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Checkout Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (maxPrice) params.maxPrice = maxPrice;
      if (locationFilter) params.location = locationFilter;
      if (sortBy) params.sort = sortBy;

      const res = await productService.getProducts(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error('[Marketplace Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleSelectProduct = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'farmer') {
      alert('You are logged in as a Farmer. Switch to a Buyer account to place orders.');
      return;
    }
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (orderPayload) => {
    setOrderLoading(true);
    try {
      await orderService.createOrder(orderPayload);
      setOrderModalOpen(false);
      setSuccessBanner(`Order placed successfully for ${selectedProduct.name}!`);
      setTimeout(() => setSuccessBanner(''), 5000);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Marketplace Header */}
      <div className="glass-card p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-500/30">
            Transparent Pricing • Zero Middlemen
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Direct Agriculture Marketplace
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Source fresh crops, grains, and farm produce directly from verified farmers across regions.
          </p>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-bold text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-bold underline hover:text-emerald-950"
          >
            View My Orders
          </button>
        </div>
      )}

      {/* Category Pills & Search Controls */}
      <div className="space-y-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <form onSubmit={handleSearchSubmit} className="glass-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce (e.g. Tomatoes, Wheat)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="lg:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Origin (e.g. Punjab)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="newest">Sort: Latest Additions</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" /> Apply Filters
            </button>
          </div>

        </form>

      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
          Searching active farm listings...
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500 space-y-3 max-w-md mx-auto">
          <div className="text-3xl">🌾</div>
          <h3 className="font-bold text-slate-900 text-base">No produce found matching your query</h3>
          <p className="text-xs text-slate-500">Try clearing filters or searching for alternative crop categories.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setLocationFilter('');
              fetchProducts();
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Direct Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleOrderSubmit}
        loading={orderLoading}
      />

    </div>
  );
};

export default BuyerDashboard;
