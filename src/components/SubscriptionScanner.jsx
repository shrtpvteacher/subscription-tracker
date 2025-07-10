import { useState } from 'react';
import { X, Search, AlertCircle, Plus } from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { toast } from '../hooks/use-toast';

const mockDiscoveredSubscriptions = [
  {
    name: 'Netflix',
    amount: 15.99,
    frequency: 'monthly',
    source: 'Credit Card ending in 5678',
    category: 'Entertainment',
    confidence: 'High'
  },
  {
    name: 'Spotify',
    amount: 9.99,
    frequency: 'monthly',
    source: 'email@example.com',
    category: 'Entertainment',
    confidence: 'High'
  },
  {
    name: 'Adobe Creative Cloud',
    amount: 52.99,
    frequency: 'monthly',
    source: 'Credit Card ending in 1234',
    category: 'Software',
    confidence: 'Medium'
  },
  {
    name: 'Dropbox Plus',
    amount: 9.99,
    frequency: 'monthly',
    source: 'husband@example.com',
    category: 'Software',
    confidence: 'Medium'
  },
  {
    name: 'New York Times',
    amount: 4.25,
    frequency: 'monthly',
    source: 'Auto-pay from Bank Account',
    category: 'News',
    confidence: 'Low'
  }
];

export function SubscriptionScanner({ open, onOpenChange }) {
  const { addSubscription } = useSubscriptions();
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredSubs, setDiscoveredSubs] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState(new Set());

  const handleScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDiscoveredSubs(mockDiscoveredSubscriptions);
    setIsScanning(false);
    
    toast({
      title: "Scan Complete",
      description: `Found ${mockDiscoveredSubscriptions.length} potential subscriptions.`,
    });
  };

  const handleToggleSubscription = (index) => {
    const newSelected = new Set(selectedSubs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSubs(newSelected);
  };

  const handleAddSelected = () => {
    const subsToAdd = Array.from(selectedSubs).map(index => {
      const sub = discoveredSubs[index];
      return {
        ...sub,
        nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        isPaid: false,
        accountNumber: '****SCAN',
        paymentMethod: sub.source,
        cancelUrl: '',
        description: `Discovered via subscription scanner`
      };
    });

    subsToAdd.forEach(sub => addSubscription(sub));
    
    toast({
      title: "Subscriptions Added",
      description: `Added ${subsToAdd.length} subscriptions to your tracker.`,
    });

    setSelectedSubs(new Set());
    setDiscoveredSubs([]);
    onOpenChange(false);
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'Low': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Subscription Scanner</h2>
            <p className="text-sm text-gray-400 mt-1">
              Scan your accounts to find subscriptions you might have forgotten about.
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
          {discoveredSubs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Scan for Hidden Subscriptions
              </h3>
              <p className="text-gray-400 mb-6">
                We'll analyze your connected accounts to find subscriptions you might have forgotten about.
              </p>

              <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-400 mb-1">Demo Mode</p>
                    <p className="text-sm text-gray-300">
                      This is a demonstration of the subscription scanner feature. In a real implementation, 
                      this would connect to your financial accounts and email to discover actual subscriptions.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-lg transition-colors"
              >
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-200">
                  Discovered Subscriptions ({discoveredSubs.length})
                </h3>
                {selectedSubs.size > 0 && (
                  <button
                    onClick={handleAddSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Selected ({selectedSubs.size})
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {discoveredSubs.map((sub, index) => (
                  <div
                    key={index}
                    className={`bg-gray-800/50 border rounded-lg p-4 transition-all cursor-pointer ${
                      selectedSubs.has(index) 
                        ? 'border-indigo-500 bg-indigo-600/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handleToggleSubscription(index)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSubs.has(index)}
                        onChange={() => handleToggleSubscription(index)}
                        className="mt-1 w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-200">{sub.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(sub.confidence)}`}>
                            {sub.confidence}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Amount: </span>
                            <span className="text-gray-300">${sub.amount}/{sub.frequency}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Category: </span>
                            <span className="text-gray-300">{sub.category}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-400">Found on: </span>
                            <span className="text-gray-300">{sub.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setDiscoveredSubs([])}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                >
                  Clear Results
                </button>
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600/50 text-gray-200 rounded-lg transition-colors"
                >
                  {isScanning ? 'Scanning...' : 'Scan Again'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}