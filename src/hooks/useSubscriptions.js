import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's subscriptions
  useEffect(() => {
    if (user) {
      loadSubscriptions();
    } else {
      setSubscriptions([]);
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/.netlify/functions/user-subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async (subscription) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/.netlify/functions/user-subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      
      if (response.ok) {
        const newSubscription = await response.json();
        setSubscriptions(prev => [...prev, newSubscription]);
        return newSubscription;
      }
    } catch (error) {
      console.error('Failed to add subscription:', error);
      throw error;
    }
  };

  const updateSubscription = async (id, updates) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/.netlify/functions/user-subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const updatedSubscription = await response.json();
        setSubscriptions(prev => prev.map(sub => 
          sub.id === id ? updatedSubscription : sub
        ));
        return updatedSubscription;
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw error;
    }
  };

  const deleteSubscription = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/.netlify/functions/user-subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      throw error;
    }
  };

  const markAsPaid = async (id) => {
    await updateSubscription(id, { isPaid: true });
  };

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    markAsPaid,
    loadSubscriptions,
  };
}