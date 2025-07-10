import { useState } from 'react';
import { Plus, CreditCard, Building, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const initialAccounts = [
  {
    id: 1,
    type: 'credit_card',
    name: 'Chase Sapphire Preferred',
    last4: '5678',
    brand: 'visa',
    expMonth: 12,
    expYear: 2025,
    nickname: 'Main Card',
    isDefault: true,
    billingAddress: {
      name: 'John & Jane Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    }
  },
  {
    id: 2,
    type: 'credit_card',
    name: 'Capital One Venture',
    last4: '1234',
    brand: 'mastercard',
    expMonth: 8,
    expYear: 2026,
    nickname: 'Travel Card',
    isDefault: false,
    billingAddress: {
      name: 'John & Jane Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    }
  },
  {
    id: 3,
    type: 'bank_account',
    name: 'Chase Checking',
    last4: '9876',
    accountType: 'checking',
    routingNumber: '****1234',
    nickname: 'Main Checking',
    isDefault: false,
    billingAddress: {
      name: 'John & Jane Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    }
  },
  {
    id: 4,
    type: 'bank_account',
    name: 'Wells Fargo Savings',
    last4: '5432',
    accountType: 'savings',
    routingNumber: '****5678',
    nickname: 'Emergency Fund',
    isDefault: false,
    billingAddress: {
      name: 'John & Jane Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    }
  }
];

export function PaymentAccounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSensitive, setShowSensitive] = useState({});
  const [formData, setFormData] = useState({
    type: 'credit_card',
    name: '',
    last4: '',
    brand: 'visa',
    expMonth: '',
    expYear: '',
    accountType: 'checking',
    routingNumber: '',
    nickname: '',
    isDefault: false,
    billingAddress: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const handleAddAccount = (e) => {
    e.preventDefault();
    
    const newAccount = {
      ...formData,
      id: Date.now(),
    };
    
    setAccounts([...accounts, newAccount]);
    setFormData({
      type: 'credit_card',
      name: '',
      last4: '',
      brand: 'visa',
      expMonth: '',
      expYear: '',
      accountType: 'checking',
      routingNumber: '',
      nickname: '',
      isDefault: false,
      billingAddress: {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      }
    });
    setShowAddForm(false);
    
    toast({
      title: "Account Added",
      description: `${newAccount.nickname || newAccount.name} has been added to your payment accounts.`,
    });
  };

  const handleDeleteAccount = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setAccounts(accounts.filter(account => account.id !== id));
      toast({
        title: "Account Deleted",
        description: `${name} has been removed from your payment accounts.`,
      });
    }
  };

  const toggleSensitiveInfo = (id) => {
    setShowSensitive(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getBrandIcon = (brand) => {
    const brandColors = {
      visa: 'text-blue-400',
      mastercard: 'text-red-400',
      amex: 'text-green-400',
      discover: 'text-orange-400'
    };
    return brandColors[brand] || 'text-gray-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Payment Accounts</h1>
          <p className="text-gray-400">Manage your credit cards, debit cards, and bank accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accounts.map((account) => (
          <div key={account.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 card-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {account.type === 'credit_card' ? (
                  <CreditCard className={`w-6 h-6 ${getBrandIcon(account.brand)}`} />
                ) : (
                  <Building className="w-6 h-6 text-green-400" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-100">{account.nickname || account.name}</h3>
                  <p className="text-sm text-gray-400">{account.name}</p>
                </div>
              </div>
              {account.isDefault && (
                <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 text-xs rounded-full border border-indigo-600/30">
                  Default
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {account.type === 'credit_card' ? 'Card Number' : 'Account Number'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">
                    {showSensitive[account.id] ? `****${account.last4}` : `••••${account.last4}`}
                  </span>
                  <button
                    onClick={() => toggleSensitiveInfo(account.id)}
                    className="p-1 hover:bg-gray-800 rounded"
                  >
                    {showSensitive[account.id] ? (
                      <EyeOff className="w-3 h-3 text-gray-400" />
                    ) : (
                      <Eye className="w-3 h-3 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {account.type === 'credit_card' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Brand</span>
                    <span className="text-sm text-gray-300 capitalize">{account.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Expires</span>
                    <span className="text-sm text-gray-300">
                      {String(account.expMonth).padStart(2, '0')}/{account.expYear}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Type</span>
                    <span className="text-sm text-gray-300 capitalize">{account.accountType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Routing</span>
                    <span className="text-sm text-gray-300">{account.routingNumber}</span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Billing Address</p>
                <p className="text-sm text-gray-300">{account.billingAddress.name}</p>
                <p className="text-sm text-gray-400">
                  {account.billingAddress.address}<br />
                  {account.billingAddress.city}, {account.billingAddress.state} {account.billingAddress.zip}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors text-sm">
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteAccount(account.id, account.nickname || account.name)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-gray-100">Add Payment Account</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-400 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_account">Bank Account</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    placeholder="Chase, Wells Fargo, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nickname</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    placeholder="Main Card, Travel Card, etc."
                  />
                </div>
              </div>

              {formData.type === 'credit_card' ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Last 4 Digits</label>
                    <input
                      type="text"
                      value={formData.last4}
                      onChange={(e) => setFormData({...formData, last4: e.target.value})}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      placeholder="1234"
                      maxLength="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">American Express</option>
                      <option value="discover">Discover</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expires</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.expMonth}
                        onChange={(e) => setFormData({...formData, expMonth: e.target.value})}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                        placeholder="MM"
                        min="1"
                        max="12"
                        required
                      />
                      <input
                        type="number"
                        value={formData.expYear}
                        onChange={(e) => setFormData({...formData, expYear: e.target.value})}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                        placeholder="YYYY"
                        min="2024"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Last 4 Digits</label>
                    <input
                      type="text"
                      value={formData.last4}
                      onChange={(e) => setFormData({...formData, last4: e.target.value})}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      placeholder="1234"
                      maxLength="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Routing Number</label>
                    <input
                      type="text"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      placeholder="****1234"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Billing Address</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.billingAddress.name}
                    onChange={(e) => setFormData({
                      ...formData, 
                      billingAddress: {...formData.billingAddress, name: e.target.value}
                    })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    placeholder="John & Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.billingAddress.address}
                    onChange={(e) => setFormData({
                      ...formData, 
                      billingAddress: {...formData.billingAddress, address: e.target.value}
                    })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.billingAddress.city}
                      onChange={(e) => setFormData({
                        ...formData, 
                        billingAddress: {...formData.billingAddress, city: e.target.value}
                      })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      placeholder="Anytown"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.billingAddress.state}
                      onChange={(e) => setFormData({
                        ...formData, 
                        billingAddress: {...formData.billingAddress, state: e.target.value}
                      })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      placeholder="CA"
                      maxLength="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.billingAddress.zip}
                      onChange={(e) => setFormData({
                        ...formData, 
                        billingAddress: {...formData.billingAddress, zip: e.target.value}
                      })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-300">
                  Set as default payment method
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}