import React from 'react';
import { MapPin, Tag, Edit, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onSelect, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'farmer' && user?._id === (product.farmerId?._id || product.farmerId);

  const fallbackImage = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;

  return (
    <div className="glass-card glass-card-hover flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Product Image & Badges */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1 border border-white/50">
            <Tag className="w-3 h-3 text-brand-600" />
            {product.category}
          </div>

          <div className="absolute bottom-3 right-3 bg-brand-700 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-md">
            ₹{product.price} <span className="text-[11px] font-normal opacity-90">/ {product.unit}</span>
          </div>
        </div>

        {/* Product Info Body */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-slate-600 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            {/* Farmer & Location info */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                {product.location || product.farmerId?.farmLocation || 'Farm Origin'}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                Stock: {product.quantity} {product.unit}
              </span>
            </div>

            {product.farmerId?.name && (
              <div className="text-xs text-slate-500">
                By: <span className="font-semibold text-slate-700">{product.farmerId.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
        {isOwner ? (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-brand-700" /> Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="flex items-center justify-center p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
              title="Delete Listing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSelect(product)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md shadow-brand-600/20 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Order Direct
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
