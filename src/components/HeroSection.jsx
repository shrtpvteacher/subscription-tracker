import { useState } from 'react';
import { Play, Shield, Zap, Users, CreditCard, Check } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../hooks/useAuth';

export function HeroSection() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('register');

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  if (user) return null; // Don't show hero if user is logged in

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          {/* Main Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-100 mb-6 leading-tight">
              Never Miss a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {' '}Payment
              </span>
              <br />
              Again
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Take complete control of your recurring payments. Track subscriptions, 
              manage due dates, and save money with our intelligent subscription tracker.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleGetStarted}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 font-semibold text-lg min-w-[200px]"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Free Trial
              </button>
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-2xl transition-all duration-200 border border-gray-700 shadow-xl hover:shadow-2xl font-semibold text-lg min-w-[200px]"
              >
                Sign In
              </button>
            </div>

            <p className="text-sm text-gray-400">
              7-day free trial • No credit card required • Cancel anytime
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Secure & Private</h3>
              <p className="text-gray-400">Your financial data is encrypted and protected with bank-level security.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Smart Tracking</h3>
              <p className="text-gray-400">Automatically discover hidden subscriptions and track all your payments.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Family Sharing</h3>
              <p className="text-gray-400">Share subscription tracking with family members for complete transparency.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-950 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-400 mb-12">
            Start with a free trial, then just $5/month to keep your subscriptions organized.
          </p>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <CreditCard className="w-6 h-6 text-indigo-400" />
              <h3 className="text-2xl font-bold text-gray-100">Pro Plan</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-100">$5</span>
              <span className="text-gray-400">/month</span>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Unlimited subscriptions</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Smart subscription scanner</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Payment reminders & notifications</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Analytics & spending insights</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Family sharing</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Priority support</span>
              </li>
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 font-semibold"
            >
              Start 7-Day Free Trial
            </button>
            
            <p className="text-xs text-gray-400 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        initialMode={authMode}
      />
    </>
  );
}