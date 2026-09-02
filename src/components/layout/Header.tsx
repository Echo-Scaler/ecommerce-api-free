import React from 'react';
import { ShoppingBag, Terminal, ShieldCheck, Menu, ExternalLink, Key, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();

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
              {t('brandTitle')} <span className="brand-highlight">{t('brandHighlight')}</span>
            </div>
            <div className="brand-subtitle">{t('brandSubtitle')}</div>
          </div>
        </div>

        <div className="version-pill">v1.0.0 REST</div>
      </div>

      <div className="header-right">
        <div className="env-selector">
          <span className="status-dot"></span>
          <span className="env-label">{t('liveSandbox')}</span>
          <span className="env-url">https://api.ecommerce.example.com/v1</span>
        </div>

        <div className="header-divider" />

        {/* Language Switcher (EN / မြန်မာ) */}
        <div className="lang-switcher-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-card)', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Globe size={15} style={{ color: 'var(--brand-primary)', marginLeft: '0.25rem' }} />
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: language === 'en' ? 'var(--brand-primary)' : 'transparent',
              color: language === 'en' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Switch language to English"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('my')}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: language === 'my' ? 'var(--brand-primary)' : 'transparent',
              color: language === 'my' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
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
        >
          <Terminal size={16} />
          <span>{t('github')}</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </header>
  );
};
