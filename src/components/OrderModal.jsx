import React, { useState } from 'react';
import { X, ShoppingBag, MapPin, Truck, CheckCircle2 } from 'lucide-react';

const OrderModal = ({ isOpen, onClose, product, onSubmit, loading }) => {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const maxQuantity = product.quantity || 1000;
  const totalPrice = (product.price * quantity).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!deliveryAddress.trim()) {
      setError('Please provide a valid delivery address');
      return;
    }

    if (quantity < 1 || quantity > maxQuantity) {
      setError(`Quantity must be between 1 and ${maxQuantity}`);
      return;
    }

    const orderPayload = {
      items: [
        {
          productId: product._id,
          quantity: Number(quantity),
        },
      ],
      deliveryAddress: deliveryAddress.trim(),
    };

    onSubmit(orderPayload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-100 text-brand-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Direct Farmer Checkout</h2>
              <p className="text-xs text-slate-500">Bypass intermediaries & order directly from source</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Selected Product Summary Card */}
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-4">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-xl border border-slate-200"
          />
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">{product.name}</h3>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-brand-600" />
              {product.location || product.farmerId?.farmLocation || 'Farm Origin'}
            </div>
            <div className="text-sm font-bold text-brand-700 mt-2">
              ₹{product.price} <span className="text-xs font-normal text-slate-500">/ {product.unit}</span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Order Quantity ({product.unit}s)
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Max Stock: {maxQuantity} {product.unit}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
                className="w-32 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <div className="text-sm text-slate-600 font-medium">
                × ₹{product.price} = <span className="font-extrabold text-slate-900 text-lg">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Delivery Address
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                required
                rows="3"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Full delivery address, street, city, pin code..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl flex items-center gap-2 text-xs font-medium text-brand-800">
            <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Direct contract to farmer Ramesh GreenFields Farm upon confirmation.</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? 'Processing Order...' : `Confirm & Pay ₹${totalPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
