import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { ShoppingBag, Truck, MapPin, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = user?.role === 'farmer'
          ? await orderService.getFarmerOrders()
          : await orderService.getBuyerOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('[Orders Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {user?.role === 'farmer' ? 'Incoming Buyer Orders' : 'My Direct Market Orders'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track order processing, dispatch status, and fulfillment logs
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-colors w-fit"
        >
          Explore Marketplace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
          Retrieving order records...
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card p-6 border-l-4 border-l-brand-600 space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">
                      Order ID: #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold border uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Ordered on {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">Total Payment</div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{(order.farmerTotal || order.totalAmount).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Purchased Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{item.productName || item.product?.name}</div>
                        <div className="text-xs text-slate-500">
                          {item.quantity} {item.unit || 'kg'} × ₹{item.unitPrice} = <strong className="text-brand-700">₹{item.quantity * item.unitPrice}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" />
                  Delivery Destination: <span className="font-semibold text-slate-800">{order.deliveryAddress}</span>
                </div>
                {user?.role === 'buyer' && order.farmerIds?.[0]?.name && (
                  <div>
                    Producer: <span className="font-semibold text-slate-800">{order.farmerIds[0].name}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders placed yet</h3>
          <p className="text-xs text-slate-500">Explore fresh farm produce listed by local agricultural producers.</p>
          <Link
            to="/marketplace"
            className="inline-block px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow"
          >
            Browse Marketplace Catalog
          </Link>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
