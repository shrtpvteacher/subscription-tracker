import { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  CreditCard, 
  Edit, 
  Trash2, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { formatCurrency, formatDate, getDaysUntilDue, getPaymentStatus } from '../lib/utils';
import { toast } from '../hooks/use-toast';

export function SubscriptionCard({ subscription }) {
  const { updateSubscription, deleteSubscription, markAsPaid } = useSubscriptions();
  const [showDetails, setShowDetails] = useState(false);
  
  const daysUntilDue = getDaysUntilDue(subscription.nextDue);
  const status = getPaymentStatus(subscription.nextDue, subscription.isPaid);

  const handleMarkAsPaid = () => {
    markAsPaid(subscription.id);
    toast({
      title: "Payment Marked",
      description: `${subscription.name} has been marked as paid.`,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${subscription.name}?`)) {
      deleteSubscription(subscription.id);
      toast({
        title: "Subscription Deleted",
        description: `${subscription.name} has been removed.`,
      });
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'overdue':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'due':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      default:
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 card-hover animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-100 mb-1">{subscription.name}</h3>
          {subscription.description && (
            <p className="text-sm text-gray-400">{subscription.description}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle details"
          >
            {showDetails ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Delete subscription"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Amount and Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <span className="text-2xl font-bold text-gray-100">
            {formatCurrency(subscription.amount)}
          </span>
          <span className="text-sm text-gray-400">/{subscription.frequency}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">
          Due: {formatDate(subscription.nextDue)}
        </span>
        {daysUntilDue < 0 && (
          <span className="text-xs text-red-400 font-medium">
            ({Math.abs(daysUntilDue)} days overdue)
          </span>
        )}
        {daysUntilDue >= 0 && daysUntilDue <= 7 && (
          <span className="text-xs text-yellow-400 font-medium">
            ({daysUntilDue} days left)
          </span>
        )}
      </div>

      {/* Payment Method */}
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">{subscription.paymentMethod}</span>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Account:</span>
              <span className="text-sm text-gray-300">{subscription.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Category:</span>
              <span className="text-sm text-gray-300">{subscription.category}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!subscription.isPaid && (
          <button
            onClick={handleMarkAsPaid}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark as Paid
          </button>
        )}
        {subscription.cancelUrl && (
          <a
            href={subscription.cancelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Cancel
          </a>
        )}
      </div>
    </div>
  );
}