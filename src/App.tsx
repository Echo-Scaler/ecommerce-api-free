import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthTokenModal } from './components/auth/AuthTokenModal';
import { AppLayout } from './components/layout/AppLayout';
import { AppView } from './components/layout/Header';
import { ApiSidebar } from './components/navigation/ApiSidebar';
import { DocsPage } from './components/docs/DocsPage';
import { LearnPage } from './components/learn/LearnPage';
import { API_MODULES } from './data/api-modules';
import { ConsoleWorkspace } from './components/tester/ConsoleWorkspace';

const AppContent: React.FC = () => {
  // Parse initial view from URL path / hash / query
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/learn') || hash.includes('learn')) return 'learn';
      if (path.includes('/docs') || hash.includes('docs')) return 'docs';
    }
    return 'console';
  });

  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>('get-products');

  // Sync URL changes
  const handleSelectView = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const url = view === 'console' ? '/' : `/${view}`;
      window.history.pushState({ view }, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/learn') || hash.includes('learn')) {
        setCurrentView('learn');
      } else if (path.includes('/docs') || hash.includes('docs')) {
        setCurrentView('docs');
      } else {
        setCurrentView('console');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToConsoleEndpoint = (endpointId?: string) => {
    setCurrentView('console');
    if (endpointId) {
      setSelectedEndpointId(endpointId);
    } else {
      setSelectedEndpointId('get-products');
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'console' }, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarContent = (
    <ApiSidebar
      modules={API_MODULES}
      selectedEndpointId={selectedEndpointId}
      onSelectEndpoint={(id) => setSelectedEndpointId(id)}
      onSelectOverview={() => setSelectedEndpointId(null)}
      currentView={currentView}
      onSelectView={handleSelectView}
    />
  );

  return (
    <AppLayout 
      sidebarContent={sidebarContent}
      currentView={currentView}
      onSelectView={handleSelectView}
    >
      {/* View 1: Documentation */}
      {currentView === 'docs' && (
        <DocsPage onNavigateToConsole={navigateToConsoleEndpoint} />
      )}

      {/* View 2: Learn Academy */}
      {currentView === 'learn' && (
        <LearnPage onNavigateToConsole={navigateToConsoleEndpoint} />
      )}

      {/* View 3: Interactive Request Console */}
      {currentView === 'console' && (
        <ConsoleWorkspace
          initialEndpointId={selectedEndpointId}
          onNavigateToDocs={() => handleSelectView('docs')}
          onNavigateToLearn={() => handleSelectView('learn')}
        />
      )}
      <AuthTokenModal />
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
