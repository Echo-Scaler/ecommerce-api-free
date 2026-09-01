import React, { useState, ReactNode } from 'react';
import { Header } from './Header';
import { SidebarContainer } from './SidebarContainer';

interface AppLayoutProps {
  sidebarContent: ReactNode;
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  sidebarContent,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="app-body">
        <SidebarContainer 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        >
          {sidebarContent}
        </SidebarContainer>

        <main className="app-main-content">
          <div className="main-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
