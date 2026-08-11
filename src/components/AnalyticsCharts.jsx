import React from 'react';
import { DollarSign, Package, ShoppingBag, TrendingUp, CheckCircle, Clock, Truck } from 'lucide-react';

const AnalyticsCharts = ({ analytics }) => {
  if (!analytics) return null;

  const {
    totalSales = 0,
    totalOrders = 0,
    totalItemsSold = 0,
    totalListings = 0,
    statusCounts = {},
    topProducts = [],
    monthlyTrends = [],
  } = analytics;

  const maxSalesTrend = Math.max(...monthlyTrends.map((t) => t.sales), 1000);

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 border-l-4 border-l-brand-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalSales.toLocaleString()}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4% this month
            </span>
          </div>
          <div className="p-3 bg-brand-50 text-brand-700 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-blue-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Listings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalListings}</h3>
            <span className="text-xs text-slate-500 mt-1">Published crops</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Orders Received</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrders}</h3>
            <span className="text-xs text-slate-500 mt-1">From direct buyers</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Volume Sold</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalItemsSold} units</h3>
            <span className="text-xs text-slate-500 mt-1">Produce dispatched</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid: Sales Trend & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Sales Performance</h3>
              <p className="text-xs text-slate-500">Direct sales revenue over the past 6 months</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full">
              INR (₹)
            </span>
          </div>

          <div className="mt-8 flex items-end justify-between h-48 px-4 gap-3">
            {monthlyTrends.map((trend, idx) => {
              const heightPercent = Math.max(12, Math.round((trend.sales / maxSalesTrend) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Hover tooltip */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                    ₹{trend.sales.toLocaleString()}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-xl flex items-end h-36 overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-xl group-hover:from-brand-600 group-hover:to-emerald-400 transition-all duration-300 shadow-inner"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{trend.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            Top Selling Produce
          </h3>
          <div className="mt-4 space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => {
                const percent = Math.round((item.revenue / (totalSales || 1)) * 100);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span className="truncate max-w-[140px]">{item.name}</span>
                      <span className="text-brand-700">₹{item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent || 10}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{item.quantity} units sold</span>
                      <span>{percent}% of total</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No completed order data available yet
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Order Status Breakdown */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-slate-900 text-base mb-4">Fulfillment Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xl font-bold text-amber-900">{statusCounts.pending || 0}</div>
              <div className="text-xs font-semibold text-amber-700">Pending Approval</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-xl font-bold text-blue-900">{statusCounts.confirmed || 0}</div>
              <div className="text-xs font-semibold text-blue-700">Confirmed</div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/60 border border-indigo-200/60 rounded-xl flex items-center gap-3">
            <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xl font-bold text-indigo-900">{statusCounts.shipped || 0}</div>
              <div className="text-xs font-semibold text-indigo-700">In Transit</div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xl font-bold text-emerald-900">{statusCounts.delivered || 0}</div>
              <div className="text-xs font-semibold text-emerald-700">Delivered</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
