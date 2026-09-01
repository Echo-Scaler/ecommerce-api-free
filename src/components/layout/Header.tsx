import React from 'react';
import { ShoppingBag, Terminal, ShieldCheck, Menu, ExternalLink, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="mobile-sidebar-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="brand-badge">
          <div className="brand-icon-wrapper">
            <ShoppingBag size={20} className="brand-icon" />
          </div>
          <div>
            <div className="brand-title">
              E-Commerce <span className="brand-highlight">API Docs</span>
            </div>
            <div className="brand-subtitle">Interactive Developer Platform</div>
          </div>
        </div>

        <div className="version-pill">v1.0.0 REST</div>
      </div>

      <div className="header-right">
        <div className="env-selector">
          <span className="status-dot"></span>
          <span className="env-label">Live Sandbox</span>
          <span className="env-url">https://api.ecommerce.example.com/v1</span>
        </div>

        <div className="header-divider" />

        {/* Interactive Auth Button */}
        <button 
          type="button" 
          className={`auth-header-btn ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}
          onClick={openAuthModal}
          title="Configure Bearer Token for API Authentication"
        >
          {isAuthenticated ? (
            <>
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Token Active</span>
            </>
          ) : (
            <>
              <Key size={15} />
              <span>Authorize</span>
            </>
          )}
        </button>

        <a 
          href="https://github.com/Echo-Scaler/ecommerce-api-free" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="header-link-btn"
        >
          <Terminal size={16} />
          <span>GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </header>
  );
};
