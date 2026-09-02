import React, { useState, ReactNode } from 'react';
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
