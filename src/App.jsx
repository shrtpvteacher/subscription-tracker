import { AuthProvider, useAuth } from './hooks/useAuth';
import { HeroSection } from './components/HeroSection';
import { UserDashboard } from './components/UserDashboard';
import { Toaster } from './components/ui/toaster';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {user ? <UserDashboard /> : <HeroSection />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;