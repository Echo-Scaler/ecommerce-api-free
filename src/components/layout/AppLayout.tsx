import React, { useState, useEffect, ReactNode } from 'react';
import { Header, AppView } from './Header';
import { SidebarContainer } from './SidebarContainer';

interface AppLayoutProps {
  sidebarContent: ReactNode;
  children: ReactNode;
  currentView: AppView;
  onSelectView: (view: AppView) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  sidebarContent,
  children,
  currentView,
  onSelectView
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-close sidebar when the active view changes (e.g. user taps Docs/Learn
  // from the mobile sidebar nav — the sidebar should close so the new page is visible).
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [currentView]);

  return (
    <div className="app-shell">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        currentView={currentView}
        onSelectView={onSelectView}
      />

      <div className={`app-body ${currentView !== 'console' ? 'view-fullwidth' : ''}`}>
        {currentView === 'console' && (
          <SidebarContainer 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
          >
            {sidebarContent}
          </SidebarContainer>
        )}

        <main className={`app-main-content ${currentView !== 'console' ? 'full-width-content' : ''}`}>
          <div className="main-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
