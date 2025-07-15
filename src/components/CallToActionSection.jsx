import { useState } from 'react';
import { Play, Shield, Zap, Users, CreditCard, Check, ArrowRight } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function CallToActionSection() {
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

  return (
    <>
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main CTA */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 leading-tight">
              Ready to Take Control of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {' '}Your Subscriptions?
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Create your own account and start tracking your subscriptions with our powerful, 
              secure platform. Import your data and never miss a payment again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleGetStarted}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 font-semibold text-lg min-w-[250px]"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Create Account & Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-2xl transition-all duration-200 border border-gray-700 shadow-xl hover:shadow-2xl font-semibold text-lg min-w-[200px]"
              >
                Already Have an Account? Sign In
              </button>
            </div>

            <p className="text-sm text-gray-400">
              7-day free trial • Then just $5/month • Cancel anytime • Your data stays private
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center shadow-xl card-hover">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Your Data, Your Privacy</h3>
              <p className="text-gray-400">Bank-level encryption keeps your subscription data completely secure and private to your account only.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center shadow-xl card-hover">
              <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Import & Track Everything</h3>
              <p className="text-gray-400">Easily import your existing subscriptions and let our smart scanner find ones you might have forgotten.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center shadow-xl card-hover">
              <div className="w-12 h-12 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Share with Family</h3>
              <p className="text-gray-400">Invite family members to view and manage shared subscriptions while keeping personal ones private.</p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <CreditCard className="w-6 h-6 text-indigo-400" />
              <h3 className="text-2xl font-bold text-gray-100">Pro Subscription Tracker</h3>
            </div>
            
            <div className="mb-6 text-center">
              <span className="text-4xl font-bold text-gray-100">$5</span>
              <span className="text-gray-400">/month</span>
              <p className="text-sm text-green-400 mt-1">7-day free trial included</p>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Unlimited subscription tracking</span>
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
                <span className="text-gray-300">Family sharing capabilities</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Data export & import tools</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Priority customer support</span>
              </li>
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 font-semibold"
            >
              Start Your Free Trial Now
            </button>
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              No credit card required for trial • Cancel anytime • Secure & private
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