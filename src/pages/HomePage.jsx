import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingBag, ShieldCheck, TrendingUp, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-50/80 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-brand-600" />
                Direct Digital Agriculture Marketplace
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Connecting <span className="gradient-text">Farmers Directly</span> with Buyers.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                AgriLink eliminates intermediaries to give agricultural producers fair market prices and buyers transparent, fresh produce straight from farm origins.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-600/25 transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Browse Marketplace
                </Link>

                {!isAuthenticated ? (
                  <Link
                    to="/register?role=farmer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl border border-slate-300 shadow-sm transition-all hover:border-brand-300"
                  >
                    Sell Produce as Farmer
                    <ArrowRight className="w-4 h-4 text-brand-600" />
                  </Link>
                ) : (
                  <Link
                    to={user?.role === 'farmer' ? '/farmer-dashboard' : '/orders'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl shadow-md transition-all"
                  >
                    Go to {user?.role === 'farmer' ? 'Farmer Dashboard' : 'My Orders'}
                  </Link>
                )}
              </div>

              {/* Quick Key Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-slate-900">0%</div>
                  <div className="text-xs text-slate-500 font-medium">Middleman Fees</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Price Transparency</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">2,500+</div>
                  <div className="text-xs text-slate-500 font-medium">Active Farmers</div>
                </div>
              </div>

            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-emerald-500 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative glass-card overflow-hidden p-3 border-2 border-white/60">
                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
                    alt="Fresh Farm Produce"
                    className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-sm"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                          🌾
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Direct Farm Fresh</div>
                          <div className="text-xs text-slate-500">Verified Origin & Quality</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                        Live Market
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Empowering Agricultural Supply Chains</h2>
          <p className="text-slate-600 mt-2">Built specifically for farmers, retailers, wholesalers, and consumers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Farmer Profit Growth</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Farmers post listings with custom pricing per unit and receive order payments directly without commission skimming.
            </p>
          </div>

          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Secure Role-Based Access</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              JWT authentication with strict role permissions prevents unauthorized modifications to product listings or orders.
            </p>
          </div>

          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Buyer Flexibility</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Wholesalers and retailers can source high-volume crops directly from certified farm locations across categories.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Transform Your Agricultural Trade?</h2>
            <p className="text-slate-300 text-base">
              Join thousands of farmers and commercial buyers experiencing direct, transparent digital commerce today.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold rounded-xl shadow-md transition-all"
              >
                Register Account Now
              </Link>
              <Link
                to="/marketplace"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
