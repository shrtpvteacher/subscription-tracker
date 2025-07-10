import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { SubscriptionCard } from './SubscriptionCard';
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
import { SubscriptionScanner } from './SubscriptionScanner';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { formatCurrency } from '../lib/utils';

export function CardView() {
  const { subscriptions } = useSubscriptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const totalMonthlyAmount = subscriptions.reduce((total, sub) => {
    if (sub.frequency === 'monthly') return total + sub.amount;
    if (sub.frequency === 'quarterly') return total + (sub.amount / 3);
    if (sub.frequency === 'yearly') return total + (sub.amount / 12);
    return total;
  }, 0);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || sub.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(subscriptions.map(sub => sub.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Card View</h1>
          <p className="text-gray-400">Visual overview of all your subscriptions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700"
          >
            <Search className="w-4 h-4" />
            Scan for Subscriptions
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Subscriptions</p>
              <p className="text-2xl font-bold text-gray-100">{subscriptions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Monthly Total</p>
              <p className="text-2xl font-bold text-gray-100">{formatCurrency(totalMonthlyAmount)}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((subscription) => (
          <SubscriptionCard key={subscription.id} subscription={subscription} />
        ))}
      </div>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchTerm || filterCategory !== 'all' ? 'No matching subscriptions' : 'No subscriptions yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first subscription to get started'
            }
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button
              onClick={() => setShowAddDialog(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add Subscription
            </button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddSubscriptionDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      <SubscriptionScanner 
        open={showScanner} 
        onOpenChange={setShowScanner} 
      />
    </div>
  );
}