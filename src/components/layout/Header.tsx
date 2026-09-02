import React from 'react';
import { 
  ShoppingBag, 
  Terminal, 
  ShieldCheck, 
  Menu, 
  ExternalLink, 
  Key, 
  Globe, 
  BookOpen, 
  GraduationCap, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export type AppView = 'console' | 'docs' | 'learn';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  currentView: AppView;
  onSelectView: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  currentView, 
  onSelectView 
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          {currentView === 'console' && (
            <button 
              className="mobile-sidebar-toggle" 
              onClick={onToggleSidebar}
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="brand-badge" onClick={() => onSelectView('console')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon-wrapper">
              <ShoppingBag size={20} className="brand-icon" />
            </div>
            <div>
              <div className="brand-title">
                {t('brandTitle')} <span className="brand-highlight">{t('brandHighlight')}</span>
              </div>
              <div className="brand-subtitle">{t('brandSubtitle')}</div>
            </div>
          </div>

          <div className="version-pill">v2.0.0 REST</div>
        </div>

        {/* Center: Primary View Navigation Tabs */}
        <nav className="header-nav-tabs desktop-nav-tabs" aria-label="Main Navigation">
          <button
            type="button"
            className={`header-nav-tab ${currentView === 'console' ? 'active' : ''}`}
            onClick={() => onSelectView('console')}
          >
            <SlidersHorizontal size={15} />
            <span>Console</span>
          </button>

          <button
            type="button"
            className={`header-nav-tab ${currentView === 'docs' ? 'active' : ''}`}
            onClick={() => onSelectView('docs')}
          >
            <BookOpen size={15} />
            <span>Documentation (/docs)</span>
          </button>

          <button
            type="button"
            className={`header-nav-tab ${currentView === 'learn' ? 'active' : ''}`}
            onClick={() => onSelectView('learn')}
          >
            <GraduationCap size={16} />
            <span>Learn (/learn)</span>
            <span className="nav-tab-badge">Interactive</span>
          </button>
        </nav>

        <div className="header-right">
          <div className="env-selector">
            <span className="status-dot"></span>
            <span className="env-label">{t('liveSandbox')}</span>
            <span className="env-url">api.ecommerce.example.com</span>
          </div>

          <div className="header-divider" />

          {/* Quick Launch Console Action when in Docs or Learn */}
          {currentView !== 'console' && (
            <button
              type="button"
              className="header-quick-tester-btn"
              onClick={() => onSelectView('console')}
            >
              <Sparkles size={14} />
              <span>Console</span>
            </button>
          )}

          {/* Language Switcher (EN / မြန်မာ) */}
          <div className="lang-switcher-wrapper">
            <Globe size={14} className="globe-icon" />
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              title="Switch language to English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('my')}
              className={`lang-btn ${language === 'my' ? 'active' : ''}`}
              title="ဘာသာစကားကို မြန်မာဘာသာသို့ ပြောင်းမည်"
            >
              မြန်မာ
            </button>
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
                <span>{t('tokenActive')}</span>
              </>
            ) : (
              <>
                <Key size={15} />
                <span>{t('authorize')}</span>
              </>
            )}
          </button>

          <a 
            href="https://github.com/Echo-Scaler/ecommerce-api-free" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="header-link-btn"
            title="View Source on GitHub"
          >
            <Terminal size={15} />
            <span>{t('github')}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* Mobile Sub-Navbar for Instant View Switching */}
      <div className="mobile-view-tabs-bar">
        <button
          type="button"
          className={`mobile-view-tab ${currentView === 'console' ? 'active' : ''}`}
          onClick={() => onSelectView('console')}
        >
          <SlidersHorizontal size={14} />
          <span>Console</span>
        </button>

        <button
          type="button"
          className={`mobile-view-tab ${currentView === 'docs' ? 'active' : ''}`}
          onClick={() => onSelectView('docs')}
        >
          <BookOpen size={14} />
          <span>Docs (/docs)</span>
        </button>

        <button
          type="button"
          className={`mobile-view-tab ${currentView === 'learn' ? 'active' : ''}`}
          onClick={() => onSelectView('learn')}
        >
          <GraduationCap size={15} />
          <span>Learn (/learn)</span>
        </button>
      </div>
    </>
  );
};
