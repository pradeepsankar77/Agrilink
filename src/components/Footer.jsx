import React from 'react';
import { Sprout, Shield, Truck, TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/50 text-brand-400 rounded-xl border border-brand-800/50">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Direct Market Pricing</h4>
              <p className="text-sm text-slate-400 mt-1">Eliminate middleman fees and maximize farmer earnings with real-time price transparency.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/50 text-brand-400 rounded-xl border border-brand-800/50">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Verified Farmers & Buyers</h4>
              <p className="text-sm text-slate-400 mt-1">Secure JWT role-based profiles ensuring trustworthy direct transaction channels.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/50 text-brand-400 rounded-xl border border-brand-800/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Order Tracking</h4>
              <p className="text-sm text-slate-400 mt-1">Real-time order confirmation, dispatching, and delivery status updates for buyers.</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-brand-500" />
            <span className="font-bold text-white tracking-wide">AgriLink</span>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()} AgriLink Marketplace. All rights reserved.</span>
          </div>

          <div className="flex gap-6 text-sm text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Farmer Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
