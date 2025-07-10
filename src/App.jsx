import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { PaymentAccounts } from './components/PaymentAccounts';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/toaster';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <LandingPage />;
      case 'accounts':
        return <PaymentAccounts />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
      <Toaster />
    </div>
  );
}

export default App;