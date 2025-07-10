import { useState } from 'react';
import { X, Edit, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { toast } from '../hooks/use-toast';

export function ChangeSubscriptionDialog({ open, onOpenChange, subscription }) {
  const { updateSubscription } = useSubscriptions();
  const [formData, setFormData] = useState({
    name: subscription?.name || '',
    amount: subscription?.amount || '',
    frequency: subscription?.frequency || 'monthly',
    nextDue: subscription?.nextDue || '',
    category: subscription?.category || '',
    accountNumber: subscription?.accountNumber || '',
    paymentMethod: subscription?.paymentMethod || '',
    cancelUrl: subscription?.cancelUrl || '',
    description: subscription?.description || '',
    contactPhone: subscription?.contactPhone || '',
    paymentUrl: subscription?.paymentUrl || ''
  });

  // Update form data when subscription changes
  useState(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || '',
        amount: subscription.amount || '',
        frequency: subscription.frequency || 'monthly',
        nextDue: subscription.nextDue || '',
        category: subscription.category || '',
        accountNumber: subscription.accountNumber || '',
        paymentMethod: subscription.paymentMethod || '',
        cancelUrl: subscription.cancelUrl || '',
        description: subscription.description || '',
        contactPhone: subscription.contactPhone || '',
        paymentUrl: subscription.paymentUrl || ''
      });
    }
  }, [subscription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.nextDue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateSubscription(subscription.id, {
      ...formData,
      amount: parseFloat(formData.amount),
    });

    toast({
      title: "Subscription Updated",
      description: `${formData.name} has been successfully updated.`,
    });

    onOpenChange(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanChange = (planType) => {
    // Predefined plan changes for common scenarios
    const planChanges = {
      downgrade: {
        amount: Math.max(formData.amount * 0.5, 5), // 50% reduction, minimum $5
        description: `${formData.description} (Downgraded Plan)`
      },
      upgrade: {
        amount: formData.amount * 1.5, // 50% increase
        description: `${formData.description} (Upgraded Plan)`
      },
      annual: {
        amount: formData.amount * 10, // Usually 2 months free
        frequency: 'yearly',
        description: `${formData.description} (Annual Plan)`
      }
    };

    if (planChanges[planType]) {
      setFormData(prev => ({
        ...prev,
        ...planChanges[planType]
      }));
    }
  };

  if (!open || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Change Subscription</h2>
            <p className="text-sm text-gray-400 mt-1">
              Modify subscription details for {subscription.name}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Plan Changes */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Plan Changes</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handlePlanChange('downgrade')}
                className="px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors text-sm"
              >
                Downgrade Plan
              </button>
              <button
                type="button"
                onClick={() => handlePlanChange('upgrade')}
                className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-sm"
              >
                Upgrade Plan
              </button>
              <button
                type="button"
                onClick={() => handlePlanChange('annual')}
                className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
              >
                Switch to Annual
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                placeholder="Netflix, Spotify, etc."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    placeholder="9.99"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Frequency *
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Next Due Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="nextDue"
                  value={formData.nextDue}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
              >
                <option value="">Select category</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Software">Software</option>
                <option value="Utilities">Utilities</option>
                <option value="Insurance">Insurance</option>
                <option value="Taxes">Taxes</option>
                <option value="Government">Government</option>
                <option value="Storage">Storage</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Payment Method
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                >
                  <option value="">Select payment method</option>
                  <option value="Credit Card ending in 5678">Credit Card ending in 5678</option>
                  <option value="Credit Card ending in 1234">Credit Card ending in 1234</option>
                  <option value="Auto-pay from Bank Account">Auto-pay from Bank Account</option>
                  <option value="Manual Payment">Manual Payment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                placeholder="****1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                placeholder="1-800-555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Payment URL
              </label>
              <input
                type="url"
                name="paymentUrl"
                value={formData.paymentUrl}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                placeholder="https://company.com/payment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cancel URL
              </label>
              <input
                type="url"
                name="cancelUrl"
                value={formData.cancelUrl}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                placeholder="https://service.com/cancel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 resize-none"
                placeholder="Brief description of the service"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Update Subscription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}