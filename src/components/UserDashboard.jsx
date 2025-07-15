import { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  ExternalLink, 
  Phone, 
  CreditCard,
  Plus,
  Search,
  FileSpreadsheet,
  Check,
  X,
  Edit,
  Ban,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Grid3X3,
  LogOut,
  User,
  Settings as SettingsIcon
} from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate, getDaysUntilDue, getPaymentStatus } from '../lib/utils';
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
import { SubscriptionScanner } from './SubscriptionScanner';
import { ChangeSubscriptionDialog } from './ChangeSubscriptionDialog';
import { SubscriptionCard } from './SubscriptionCard';
import { toast } from '../hooks/use-toast';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { subscriptions, markAsPaid, deleteSubscription } = useSubscriptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showChangeSubscription, setShowChangeSubscription] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [sortBy, setSortBy] = useState('nextDue');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Calculate totals
  const totalMonthlyAmount = subscriptions.reduce((total, sub) => {
    if (sub.frequency === 'monthly') return total + sub.amount;
    if (sub.frequency === 'quarterly') return total + (sub.amount / 3);
    if (sub.frequency === 'yearly') return total + (sub.amount / 12);
    return total;
  }, 0);

  const totalYearlyAmount = subscriptions.reduce((total, sub) => {
    if (sub.frequency === 'monthly') return total + (sub.amount * 12);
    if (sub.frequency === 'quarterly') return total + (sub.amount * 4);
    if (sub.frequency === 'yearly') return total + sub.amount;
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

  // Calculate spending by category for analytics
  const spendingByCategory = subscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Other';
    let monthlyAmount = sub.amount;
    
    if (sub.frequency === 'quarterly') monthlyAmount = sub.amount / 3;
    if (sub.frequency === 'yearly') monthlyAmount = sub.amount / 12;
    
    acc[category] = (acc[category] || 0) + monthlyAmount;
    return acc;
  }, {});

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

  // Sort subscriptions
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (sortBy === 'nextDue') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleMarkAsPaid = (id, name) => {
    markAsPaid(id);
    toast({
      title: "Payment Marked",
      description: `${name} has been marked as paid.`,
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteSubscription(id);
      toast({
        title: "Subscription Deleted",
        description: `${name} has been removed.`,
      });
    }
  };

  const handleChangeSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setShowChangeSubscription(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  const getStatusBadge = (subscription) => {
    const status = getPaymentStatus(subscription.nextDue, subscription.isPaid);
    const styles = {
      paid: 'bg-green-600/20 text-green-400 border-green-600/30',
      overdue: 'bg-red-600/20 text-red-400 border-red-600/30',
      due: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      upcoming: 'bg-blue-600/20 text-blue-400 border-blue-600/30'
    };
    
    return (
      <span className={`px-3 py-1 rounded-2xl text-xs font-medium border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header with User Menu */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-100">Subscription Tracker</h1>
                <p className="text-xs text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-2xl transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 hidden sm:block">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-xl transition-colors">
                      <SettingsIcon className="w-4 h-4" />
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Your Subscriptions</h2>
            <p className="text-gray-400">Manage and track all your recurring payments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-2xl transition-colors border border-gray-700 shadow-lg"
            >
              <Search className="w-4 h-4" />
              Scan for Subscriptions
            </button>
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Subscription
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Monthly Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-100">{formatCurrency(totalMonthlyAmount)}</p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-600/20 rounded-2xl">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Yearly Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-100">{formatCurrency(totalYearlyAmount)}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-600/20 rounded-2xl">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Upcoming</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-100">{upcomingPayments.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-600/20 rounded-2xl">
                <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Overdue</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-100">{overduePayments.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-600/20 rounded-2xl">
                <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics and Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Analytics */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">Spending by Category</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(spendingByCategory)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, amount]) => {
                  const percentage = (amount / totalMonthlyAmount) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}></div>
                          <span className="text-sm sm:text-base text-gray-300">{category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm sm:text-base text-gray-100 font-medium">{formatCurrency(amount)}</span>
                          <span className="text-xs sm:text-sm text-gray-400 ml-1 sm:ml-2">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                        <div 
                          className={`h-1.5 sm:h-2 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">Quick Reports</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <div>
                    <p className="text-sm sm:text-base text-gray-100 font-medium">Monthly Growth</p>
                    <p className="text-xs sm:text-sm text-gray-400">vs last month</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base text-green-400 font-medium">+5.2%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <div>
                    <p className="text-sm sm:text-base text-gray-100 font-medium">Average per Service</p>
                    <p className="text-xs sm:text-sm text-gray-400">monthly cost</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base text-blue-400 font-medium">
                  {formatCurrency(totalMonthlyAmount / subscriptions.length || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <div>
                    <p className="text-sm sm:text-base text-gray-100 font-medium">Next Payment</p>
                    <p className="text-xs sm:text-sm text-gray-400">upcoming due date</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base text-purple-400 font-medium">
                  {subscriptions.length > 0 ? formatDate(
                    subscriptions
                      .filter(sub => !sub.isPaid)
                      .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))[0]?.nextDue || new Date()
                  ) : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Summary Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 sm:p-6 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-100">Subscription Summary</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      viewMode === 'table'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      viewMode === 'cards'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Cards
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  Total: {subscriptions.length} subscriptions
                </div>
              </div>
            </div>
          </div>

          {/* Card View */}
          {viewMode === 'cards' && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedSubscriptions.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            </div>
          )}

          {/* Mobile Card View (when in table mode) */}
          {viewMode === 'table' && (
            <div className="block lg:hidden">
              <div className="divide-y divide-gray-800">
                {sortedSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-100">{subscription.name}</h3>
                        <p className="text-sm text-gray-400">{subscription.category}</p>
                      </div>
                      {getStatusBadge(subscription)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-400">Amount: </span>
                        <span className="text-gray-100 font-medium">{formatCurrency(subscription.amount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Due: </span>
                        <span className="text-gray-100">{formatDate(subscription.nextDue)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {!subscription.isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(subscription.id, subscription.name)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 rounded-2xl text-xs hover:bg-green-600/30 transition-colors shadow-md"
                        >
                          <Check className="w-3 h-3" />
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleChangeSubscription(subscription)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600/20 text-yellow-400 rounded-2xl text-xs hover:bg-yellow-600/30 transition-colors shadow-md"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Table View */}
          {viewMode === 'table' && (
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50"
                      onClick={() => handleSort('name')}
                    >
                      Service Name
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50"
                      onClick={() => handleSort('nextDue')}
                    >
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-100">{subscription.name}</div>
                          <div className="text-sm text-gray-400">{subscription.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {formatCurrency(subscription.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300 capitalize">{subscription.frequency}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(subscription.nextDue)}</div>
                        {getDaysUntilDue(subscription.nextDue) < 0 && (
                          <div className="text-xs text-red-400">{Math.abs(getDaysUntilDue(subscription.nextDue))} days overdue</div>
                        )}
                        {getDaysUntilDue(subscription.nextDue) >= 0 && getDaysUntilDue(subscription.nextDue) <= 7 && (
                          <div className="text-xs text-yellow-400">{getDaysUntilDue(subscription.nextDue)} days left</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {!subscription.isPaid && (
                            <button
                              onClick={() => handleMarkAsPaid(subscription.id, subscription.name)}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-xl transition-all"
                              title="Mark as paid"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleChangeSubscription(subscription)}
                            className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-xl transition-all"
                            title="Edit subscription"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subscription.id, subscription.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all"
                            title="Delete subscription"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer with Totals */}
          <div className="bg-gray-800/50 px-4 sm:px-6 py-4 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-400">
                Showing {subscriptions.length} subscriptions
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Monthly Total</div>
                  <div className="text-lg font-bold text-gray-100">{formatCurrency(totalMonthlyAmount)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Yearly Total</div>
                  <div className="text-lg font-bold text-gray-100">{formatCurrency(totalYearlyAmount)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileSpreadsheet className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No subscriptions yet</h3>
            <p className="text-gray-500 mb-6 px-4">Add your first subscription to get started tracking your payments</p>
            <button
              onClick={() => setShowAddDialog(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25"
            >
              Add Your First Subscription
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
        <ChangeSubscriptionDialog
          open={showChangeSubscription}
          onOpenChange={setShowChangeSubscription}
          subscription={selectedSubscription}
        />
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}