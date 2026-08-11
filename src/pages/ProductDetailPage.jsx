import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import OrderModal from '../components/OrderModal';
import { MapPin, Tag, Phone, ShieldCheck, ArrowLeft, ShoppingCart, User, Truck } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        setProduct(res.product);
      } catch (err) {
        console.error('[ProductDetail Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrderSubmit = async (orderPayload) => {
    setOrderLoading(true);
    try {
      await orderService.createOrder(orderPayload);
      setOrderModalOpen(false);
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">The requested produce listing may have been removed.</p>
        <Link to="/marketplace" className="inline-block px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const farmer = product.farmerId || {};
  const isFarmerOwner = user?.role === 'farmer' && user?._id === (farmer._id || farmer);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Product Media Column */}
        <div className="lg:col-span-6 glass-card overflow-hidden p-4 space-y-4">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl border border-slate-100 shadow-sm"
          />
        </div>

        {/* Product Details & Purchase Column */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-200 mb-2">
              <Tag className="w-3.5 h-3.5" />
              {product.category}
            </div>
            <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
            
            <div className="mt-3 flex items-center gap-3">
              <div className="text-3xl font-extrabold text-brand-700">
                ₹{product.price} <span className="text-sm font-normal text-slate-500">/ {product.unit}</span>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                Available: {product.quantity} {product.unit}s
              </span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Farmer & Origin Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-400 font-medium">Producer</div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <User className="w-4 h-4 text-brand-600" />
                  {farmer.name || 'Local Farmer'}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-medium">Origin Location</div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  {product.location || farmer.farmLocation || 'Farm Location'}
                </div>
              </div>
            </div>

            {farmer.phone && (
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Contact Producer: <span className="font-semibold text-slate-800">{farmer.phone}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Produce Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
              {product.description}
            </p>
          </div>

          {/* Action CTA */}
          <div className="pt-4">
            {!isFarmerOwner ? (
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate('/login');
                  else setOrderModalOpen(true);
                }}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Order Direct from Producer
              </button>
            ) : (
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-center text-xs font-bold text-brand-800">
                You are the producer of this listing.
              </div>
            )}
          </div>

        </div>

      </div>

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        product={product}
        onSubmit={handleOrderSubmit}
        loading={orderLoading}
      />

    </div>
  );
};

export default ProductDetailPage;
