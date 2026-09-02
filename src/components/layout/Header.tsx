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
              <Menu size={18} />
            </button>
          )}

          <div 
            className="brand-badge" 
            onClick={() => onSelectView('console')} 
            style={{ cursor: 'pointer' }}
            title="E-Commerce API Platform"
          >
            <div className="brand-icon-wrapper">
              <ShoppingBag size={18} className="brand-icon" />
            </div>
            <div className="brand-text-col">
              <div className="brand-title">
                {t('brandTitle')} <span className="brand-highlight">{t('brandHighlight')}</span>
              </div>
              <div className="brand-subtitle">{t('brandSubtitle')}</div>
            </div>
          </div>

          <div className="version-pill">v2.0</div>
        </div>

        {/* Center: Primary View Navigation Tabs */}
        <nav className="header-nav-tabs desktop-nav-tabs" aria-label="Main Navigation">
          <button
            type="button"
            className={`header-nav-tab ${currentView === 'console' ? 'active' : ''}`}
            onClick={() => onSelectView('console')}
          >
            <SlidersHorizontal size={14} />
            <span>{t('navConsole')}</span>
          </button>

          <button
            type="button"
            className={`header-nav-tab ${currentView === 'docs' ? 'active' : ''}`}
            onClick={() => onSelectView('docs')}
          >
            <BookOpen size={14} />
            <span>{t('navDocs')}</span>
          </button>

          <button
            type="button"
            className={`header-nav-tab ${currentView === 'learn' ? 'active' : ''}`}
            onClick={() => onSelectView('learn')}
          >
            <GraduationCap size={15} />
            <span>{t('navLearn')}</span>
            <span className="nav-tab-badge">Interactive</span>
          </button>
        </nav>

        <div className="header-right">
          <div className="env-selector" title="API Base URL: https://api.ecommerce.example.com">
            <span className="status-dot"></span>
            <span className="env-label">{t('liveSandbox')}</span>
          </div>

          <div className="header-divider hide-on-mobile" />

          {/* Quick Launch Console Action when in Docs or Learn */}
          {currentView !== 'console' && (
            <button
              type="button"
              className="header-quick-tester-btn"
              onClick={() => onSelectView('console')}
              title="Open Interactive API Console"
            >
              <Sparkles size={13} />
              <span>{t('navConsole')}</span>
            </button>
          )}

          {/* Language Switcher (EN / မြန်မာ) */}
          <div className="lang-switcher-wrapper" role="group" aria-label="Language Selector">
            <Globe size={13} className="globe-icon" />
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

          <div className="header-divider hide-on-mobile" />

          {/* Interactive Auth Button */}
          <button 
            type="button" 
            className={`auth-header-btn ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}
            onClick={openAuthModal}
            title="Configure Bearer Token for API Authentication"
          >
            {isAuthenticated ? (
              <>
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="auth-btn-label">{t('tokenActive')}</span>
              </>
            ) : (
              <>
                <Key size={14} />
                <span className="auth-btn-label">{t('authorize')}</span>
              </>
            )}
          </button>

          <a 
            href="https://github.com/Echo-Scaler/ecommerce-api-free" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="header-link-btn hide-on-tablet"
            title="View Source on GitHub"
          >
            <Terminal size={14} />
            <span className="github-btn-label">{t('github')}</span>
            <ExternalLink size={11} />
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
          <SlidersHorizontal size={13} />
          <span>{t('navConsole')}</span>
        </button>

        <button
          type="button"
          className={`mobile-view-tab ${currentView === 'docs' ? 'active' : ''}`}
          onClick={() => onSelectView('docs')}
        >
          <BookOpen size={13} />
          <span>{t('navDocs')}</span>
        </button>

        <button
          type="button"
          className={`mobile-view-tab ${currentView === 'learn' ? 'active' : ''}`}
          onClick={() => onSelectView('learn')}
        >
          <GraduationCap size={14} />
          <span>{t('navLearn')}</span>
          <span className="nav-tab-badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>Live</span>
        </button>
      </div>
    </>
  );
};
