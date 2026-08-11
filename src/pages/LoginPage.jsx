import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, LogIn, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.user.role === 'farmer') {
        navigate(from || '/farmer-dashboard');
      } else {
        navigate(from || '/marketplace');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Credentials Pre-fill Helper
  const fillDemoCredentials = (role) => {
    if (role === 'farmer') {
      setEmail('farmer@agrilink.com');
      setPassword('password123');
    } else {
      setEmail('buyer@agrilink.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 shadow-2xl relative border border-slate-200/80">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back to AgriLink</h2>
          <p className="text-xs text-slate-500">Sign in to access your direct marketplace dashboard</p>
        </div>

        {/* Demo Fast Pre-fills */}
        <div className="mt-5 p-3 bg-brand-50/70 border border-brand-200/60 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Instant Demo Sign In:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('farmer')}
              className="px-3 py-1.5 bg-white hover:bg-brand-100 text-brand-900 border border-brand-200 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              👨‍🌾 Farmer Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('buyer')}
              className="px-3 py-1.5 bg-white hover:bg-brand-100 text-brand-900 border border-brand-200 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              🛒 Buyer Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@agrilink.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:underline">
            Register as Farmer or Buyer
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
