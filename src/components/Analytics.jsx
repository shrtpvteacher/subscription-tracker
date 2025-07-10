import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3 } from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { formatCurrency } from '../lib/utils';

export function Analytics() {
  const { subscriptions } = useSubscriptions();
  const [timeRange, setTimeRange] = useState('monthly');

  // Calculate spending by category
  const spendingByCategory = subscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Other';
    let monthlyAmount = sub.amount;
    
    if (sub.frequency === 'quarterly') monthlyAmount = sub.amount / 3;
    if (sub.frequency === 'yearly') monthlyAmount = sub.amount / 12;
    
    acc[category] = (acc[category] || 0) + monthlyAmount;
    return acc;
  }, {});

  // Calculate totals
  const totalMonthly = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  const totalYearly = totalMonthly * 12;

  // Calculate trends (mock data for demo)
  const trends = {
    monthly: { change: 5.2, direction: 'up' },
    yearly: { change: 12.8, direction: 'up' }
  };

  const categoryColors = {
    'Entertainment': 'bg-purple-500',
    'Software': 'bg-blue-500',
    'Utilities': 'bg-green-500',
    'Insurance': 'bg-yellow-500',
    'Taxes': 'bg-red-500',
    'Government': 'bg-orange-500',
    'Storage': 'bg-pink-500',
    'Transportation': 'bg-indigo-500',
    'Other': 'bg-gray-500'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Analytics</h1>
          <p className="text-gray-400">Insights into your subscription spending patterns</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
        >
          <option value="monthly">Monthly View</option>
          <option value="yearly">Yearly View</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Monthly</p>
              <p className="text-2xl font-bold text-gray-100">{formatCurrency(totalMonthly)}</p>
            </div>
            <div className="p-3 bg-indigo-600/20 rounded-full">
              <DollarSign className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {trends.monthly.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-400" />
            )}
            <span className={`text-sm ${trends.monthly.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
              {trends.monthly.change}% vs last month
            </span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Yearly</p>
              <p className="text-2xl font-bold text-gray-100">{formatCurrency(totalYearly)}</p>
            </div>
            <div className="p-3 bg-purple-600/20 rounded-full">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">
              {trends.yearly.change}% vs last year
            </span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-100">{subscriptions.length}</p>
            </div>
            <div className="p-3 bg-green-600/20 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Categories</p>
              <p className="text-2xl font-bold text-gray-100">{Object.keys(spendingByCategory).length}</p>
            </div>
            <div className="p-3 bg-yellow-600/20 rounded-full">
              <PieChart className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-6">Spending by Category</h3>
          <div className="space-y-4">
            {Object.entries(spendingByCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / totalMonthly) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}></div>
                        <span className="text-gray-300">{category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-100 font-medium">{formatCurrency(amount)}</span>
                        <span className="text-gray-400 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Subscriptions */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-6">Most Expensive Subscriptions</h3>
          <div className="space-y-4">
            {subscriptions
              .sort((a, b) => {
                const aMonthly = a.frequency === 'monthly' ? a.amount : 
                               a.frequency === 'quarterly' ? a.amount / 3 : a.amount / 12;
                const bMonthly = b.frequency === 'monthly' ? b.amount : 
                               b.frequency === 'quarterly' ? b.amount / 3 : b.amount / 12;
                return bMonthly - aMonthly;
              })
              .slice(0, 8)
              .map((sub, index) => {
                const monthlyAmount = sub.frequency === 'monthly' ? sub.amount : 
                                    sub.frequency === 'quarterly' ? sub.amount / 3 : sub.amount / 12;
                return (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                      <div>
                        <p className="text-gray-100 font-medium">{sub.name}</p>
                        <p className="text-gray-400 text-sm">{sub.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-100 font-medium">{formatCurrency(monthlyAmount)}</p>
                      <p className="text-gray-400 text-sm">per month</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}