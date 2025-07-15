import { useState } from 'react';
import { X, Mail, Lock, User, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../hooks/use-toast';

export function AuthModal({ open, onOpenChange, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const result = await register(formData.email, formData.password, formData.name);
      if (result.success) {
        toast({
          title: "Account Created!",
          description: "Welcome to Subscription Tracker! Your 7-day free trial has started.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } else {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast({
          title: "Welcome Back!",
          description: "Successfully logged into your account.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === 'login' 
                ? 'Sign in to access your subscription tracker' 
                : 'Start your 7-day free trial today'
              }
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-800 rounded-2xl transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 shadow-lg"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 shadow-lg"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 shadow-lg"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 shadow-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-medium text-indigo-400">7-Day Free Trial</p>
                  <p className="text-xs text-gray-300">
                    Then $5/month. Cancel anytime. No setup fees.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 font-medium"
          >
            {loading ? 'Please wait...' : (
              mode === 'login' ? 'Sign In' : 'Start Free Trial'
            )}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}