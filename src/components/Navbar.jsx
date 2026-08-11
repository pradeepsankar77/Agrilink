import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, ShoppingBag, LayoutDashboard, LogOut, Menu, X, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                Agri<span className="text-brand-600">Link</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 -mt-1">
                Direct Farmer Market
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                isActive('/') ? 'text-brand-700 font-semibold' : 'text-slate-600'
              }`}
            >
              Home
            </Link>

            <Link
              to="/marketplace"
              className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                isActive('/marketplace') ? 'text-brand-700 font-semibold' : 'text-slate-600'
              }`}
            >
              Marketplace
            </Link>

            {isAuthenticated && user?.role === 'farmer' && (
              <Link
                to="/farmer-dashboard"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-600 ${
                  isActive('/farmer-dashboard') ? 'text-brand-700 font-semibold' : 'text-slate-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Farmer Dashboard
              </Link>
            )}

            {isAuthenticated && user?.role === 'buyer' && (
              <Link
                to="/orders"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-600 ${
                  isActive('/orders') ? 'text-brand-700 font-semibold' : 'text-slate-600'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                My Orders
              </Link>
            )}
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-brand-700 uppercase font-bold tracking-wider">
                      {user?.role === 'farmer' ? '👨‍🌾 Farmer' : `🛒 ${user?.buyerType || 'Buyer'}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-md shadow-brand-600/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Marketplace Catalog
          </Link>
          {isAuthenticated && user?.role === 'farmer' && (
            <Link
              to="/farmer-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-brand-700 hover:bg-brand-50"
            >
              Farmer Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'buyer' && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-brand-700 hover:bg-brand-50"
            >
              My Orders
            </Link>
          )}
          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <div className="text-xs text-slate-500 font-semibold px-3 uppercase">Logged in as {user?.name}</div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg text-slate-700 border border-slate-300 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg text-white bg-brand-600 font-medium"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
