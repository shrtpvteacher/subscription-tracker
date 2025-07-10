import { useState, useEffect } from 'react';

const initialSubscriptions = [
  {
    id: 1,
    name: 'Amazon Prime',
    amount: 14.99,
    frequency: 'monthly',
    nextDue: '2025-01-15',
    isPaid: false,
    category: 'Entertainment',
    accountNumber: '****1234',
    paymentMethod: 'Credit Card ending in 5678',
    cancelUrl: 'https://amazon.com/prime/cancel',
    description: 'Prime membership with free shipping and streaming',
    contactPhone: '1-888-280-4331',
    paymentUrl: 'https://amazon.com/cpe/yourpayments'
  },
  {
    id: 2,
    name: 'YouTube Premium',
    amount: 13.99,
    frequency: 'monthly',
    nextDue: '2025-01-12',
    isPaid: true,
    category: 'Entertainment',
    accountNumber: '****9876',
    paymentMethod: 'Credit Card ending in 5678',
    cancelUrl: 'https://youtube.com/premium/cancel',
    description: 'Ad-free YouTube with offline downloads',
    contactPhone: '1-650-253-0000',
    paymentUrl: 'https://payments.google.com'
  },
  {
    id: 3,
    name: 'Phone Line 1',
    amount: 85.00,
    frequency: 'monthly',
    nextDue: '2025-01-20',
    isPaid: false,
    category: 'Utilities',
    accountNumber: '555-0123',
    paymentMethod: 'Auto-pay from Bank Account',
    cancelUrl: 'https://carrier.com/cancel',
    description: 'Primary mobile phone line',
    contactPhone: '1-800-922-0204',
    paymentUrl: 'https://verizon.com/myverizon'
  },
  {
    id: 4,
    name: 'Phone Line 2',
    amount: 75.00,
    frequency: 'monthly',
    nextDue: '2025-01-20',
    isPaid: false,
    category: 'Utilities',
    accountNumber: '555-0124',
    paymentMethod: 'Auto-pay from Bank Account',
    cancelUrl: 'https://carrier.com/cancel',
    description: 'Secondary mobile phone line',
    contactPhone: '1-800-922-0204',
    paymentUrl: 'https://verizon.com/myverizon'
  },
  {
    id: 5,
    name: 'Starlink',
    amount: 110.00,
    frequency: 'monthly',
    nextDue: '2025-01-18',
    isPaid: true,
    category: 'Utilities',
    accountNumber: '****SL001',
    paymentMethod: 'Credit Card ending in 5678',
    cancelUrl: 'https://starlink.com/cancel',
    description: 'Satellite internet service',
    contactPhone: '1-888-518-3752',
    paymentUrl: 'https://starlink.com/account'
  },
  {
    id: 6,
    name: 'Property Taxes',
    amount: 1250.00,
    frequency: 'quarterly',
    nextDue: '2025-03-15',
    isPaid: false,
    category: 'Taxes',
    accountNumber: 'Parcel #123456',
    paymentMethod: 'Manual Payment',
    cancelUrl: null,
    description: 'Quarterly property tax payment',
    contactPhone: '1-555-TAX-OFFICE',
    paymentUrl: 'https://county.gov/property-tax-payment'
  },
  {
    id: 7,
    name: 'Car Insurance',
    amount: 180.00,
    frequency: 'monthly',
    nextDue: '2025-01-25',
    isPaid: false,
    category: 'Insurance',
    accountNumber: '****AUTO1',
    paymentMethod: 'Auto-pay from Bank Account',
    cancelUrl: 'https://insurance.com/cancel',
    description: 'Vehicle insurance premium',
    contactPhone: '1-800-GEICO-1',
    paymentUrl: 'https://geico.com/payment-center'
  },
  {
    id: 8,
    name: 'Car Registration',
    amount: 85.00,
    frequency: 'yearly',
    nextDue: '2025-06-01',
    isPaid: false,
    category: 'Government',
    accountNumber: 'License #ABC123',
    paymentMethod: 'Manual Payment',
    cancelUrl: null,
    description: 'Annual vehicle registration',
    contactPhone: '1-555-DMV-HELP',
    paymentUrl: 'https://dmv.state.gov/vehicle-registration'
  },
  {
    id: 9,
    name: 'ChatGPT Plus',
    amount: 20.00,
    frequency: 'monthly',
    nextDue: '2025-01-14',
    isPaid: true,
    category: 'Software',
    accountNumber: '****GPT1',
    paymentMethod: 'Credit Card ending in 5678',
    cancelUrl: 'https://openai.com/cancel',
    description: 'AI assistant subscription',
    contactPhone: null,
    paymentUrl: 'https://platform.openai.com/account/billing'
  },
  {
    id: 10,
    name: 'Storage Unit',
    amount: 125.00,
    frequency: 'monthly',
    nextDue: '2025-01-28',
    isPaid: false,
    category: 'Storage',
    accountNumber: 'Unit #B-247',
    paymentMethod: 'Credit Card ending in 5678',
    cancelUrl: null,
    description: '10x10 climate controlled storage unit',
    contactPhone: '1-555-STORAGE',
    paymentUrl: 'https://storagecompany.com/payment'
  },
  {
    id: 11,
    name: 'Leased Storage Truck',
    amount: 450.00,
    frequency: 'monthly',
    nextDue: '2025-01-30',
    isPaid: false,
    category: 'Transportation',
    accountNumber: 'Lease #TR-8901',
    paymentMethod: 'Auto-pay from Bank Account',
    cancelUrl: null,
    description: '16ft box truck lease for business',
    contactPhone: '1-800-TRUCK-LEASE',
    paymentUrl: 'https://truckleasing.com/customer-portal'
  }
];

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (subscription) => {
    const newSubscription = {
      ...subscription,
      id: Date.now(),
    };
    setSubscriptions([...subscriptions, newSubscription]);
  };

  const updateSubscription = (id, updates) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const deleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const markAsPaid = (id) => {
    updateSubscription(id, { isPaid: true });
  };

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    markAsPaid,
  };
}