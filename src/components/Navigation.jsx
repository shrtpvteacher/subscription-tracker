import { useState } from 'react';
import { 
  Home, 
  CreditCard, 
  Grid3X3, 
  Settings, 
  Search,
  Bell,
  FileText,
  PieChart,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export function Navigation({ currentPage, onPageChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Payment Accounts', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'scanner', label: 'Scanner', icon: Search },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Payment Due Soon',
      message: 'Amazon Prime payment due in 2 days',
      type: 'warning',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Payment Overdue',
      message: 'Storage Unit payment is 3 days overdue',
      type: 'error',
      time: '1 day ago'
    },
    {
      id: 3,
      title: 'Payment Successful',
      message: 'YouTube Premium payment processed',
      type: 'success',
      time: '3 days ago'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 shadow-md ${
                    currentPage === item.id
                      ? 'bg-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                      : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800 hover:shadow-lg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side - Notifications and Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-3 rounded-2xl text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Menu */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
                  </div>
                  <div className="py-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-100 truncate">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <button className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-700 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-xs font-medium transition-all duration-200 shadow-md ${
                      currentPage === item.id
                        ? 'bg-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
                        : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800 hover:shadow-lg'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close notifications */}
      {isNotificationsOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsNotificationsOpen(false)}
        />
      )}
    </nav>
  );
}