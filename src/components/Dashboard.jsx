import { useState } from 'react';
import { Plus, DollarSign, Calendar, AlertCircle, Search } from 'lucide-react';
import { SubscriptionCard } from './SubscriptionCard';
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
import { SubscriptionScanner } from './SubscriptionScanner';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { formatCurrency, getDaysUntilDue } from '../lib/utils';

export function Dashboard() {
  const { subscriptions } = useSubscriptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const totalMonthlyAmount = subscriptions.reduce((total, sub) => {
    if (sub.frequency === 'monthly') return total + sub.amount;
    if (sub.frequency === 'quarterly') return total + (sub.amount / 3);
    if (sub.frequency === 'yearly') return total + (sub.amount / 12);
    return total;
  }, 0);

  const upcomingPayments = subscriptions.filter(sub => {
    const daysUntil = getDaysUntilDue(sub.nextDue);
    return !sub.isPaid && daysUntil <= 7;
  });

  const overduePayments = subscriptions.filter(sub => {
    const daysUntil = getDaysUntilDue(sub.nextDue);
    return !sub.isPaid && daysUntil < 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              Subscription Tracker
            </h1>
            <p className="text-lg text-gray-400">
              Manage your subscriptions and never miss a payment
            </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 card-hover">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Monthly Total</p>
                <p className="text-3xl font-bold text-gray-100">{formatCurrency(totalMonthlyAmount)}</p>
              </div>
              <div className="p-3 bg-indigo-600/20 rounded-full">
                <DollarSign className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 card-hover">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Upcoming Payments</p>
                <p className="text-3xl font-bold text-gray-100">{upcomingPayments.length}</p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-full">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 card-hover">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Overdue</p>
                <p className="text-3xl font-bold text-gray-100">{overduePayments.length}</p>
              </div>
              <div className="p-3 bg-red-600/20 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No subscriptions yet</h3>
            <p className="text-gray-500 mb-6">Add your first subscription to get started</p>
            <button
              onClick={() => setShowAddDialog(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add Subscription
            </button>
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
    </div>
  );
}