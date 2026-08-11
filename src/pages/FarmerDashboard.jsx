import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { analyticsService } from '../services/analyticsService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Plus, LayoutDashboard, Package, ShoppingBag, MapPin, RefreshCw, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'orders'
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, analyticsRes] = await Promise.all([
        productService.getFarmerProducts(),
        orderService.getFarmerOrders(),
        analyticsService.getFarmerAnalytics(),
      ]);

      setProducts(prodRes.products || []);
      setOrders(orderRes.orders || []);
      setAnalytics(analyticsRes.analytics || null);
    } catch (err) {
      console.error('[FarmerDashboard Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleProductSubmit = async (formData, productId) => {
    setSubmitLoading(true);
    try {
      if (productId) {
        await productService.updateProduct(productId, formData);
      } else {
        await productService.createProduct(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product listing');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this produce listing?')) return;
    try {
      await productService.deleteProduct(productId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-700/60 rounded-full text-xs font-bold text-brand-200 border border-brand-500/30">
            <MapPin className="w-3.5 h-3.5" />
            {user?.farmLocation || 'Farm Operator'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}! 👨‍🌾
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 opacity-90">
            Manage produce listings, track direct buyer orders, and view sales performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/20"
            title="Refresh Dashboard Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-brand-900 font-bold text-sm rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 text-brand-700" />
            List New Produce
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Sales Analytics
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          My Produce ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Incoming Orders ({orders.length})
        </button>
      </div>

      {/* Main Tab Contents */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
          Loading farmer workspace...
        </div>
      ) : (
        <>
          {/* TAB 1: Analytics */}
          {activeTab === 'analytics' && <AnalyticsCharts analytics={analytics} />}

          {/* TAB 2: Products */}
          {activeTab === 'products' && (
            <div>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onEdit={handleOpenEditModal}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No produce listings published yet</h3>
                  <p className="text-xs text-slate-500">Post crops, vegetables, or fruits directly to commercial buyers.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md"
                  >
                    Create First Listing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-brand-600">
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900 text-sm">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-sm font-semibold text-slate-800">
                              • {item.productName} — <span className="text-brand-700 font-bold">{item.quantity} {item.unit}</span> @ ₹{item.unitPrice}/{item.unit}
                            </div>
                          ))}
                        </div>

                        {/* Buyer & Address info */}
                        <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Buyer: <strong className="text-slate-700">{order.buyerId?.name || 'Commercial Buyer'}</strong> ({order.buyerId?.buyerType || 'Retailer'})</span>
                          <span>Delivery: <strong className="text-slate-700">{order.deliveryAddress}</strong></span>
                        </div>
                      </div>

                      {/* Right Action: Status Updater */}
                      <div className="flex flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <div className="text-right">
                          <div className="text-xs text-slate-500 font-bold uppercase">Order Total</div>
                          <div className="text-xl font-black text-slate-900">₹{(order.farmerTotal || order.totalAmount).toLocaleString()}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-600">Update Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center text-slate-500 text-sm">
                  No incoming orders received yet.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Product Listing Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProductSubmit}
        editingProduct={editingProduct}
        loading={submitLoading}
      />

    </div>
  );
};

export default FarmerDashboard;
