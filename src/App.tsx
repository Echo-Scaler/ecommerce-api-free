import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthTokenModal } from './components/auth/AuthTokenModal';
import { AppLayout } from './components/layout/AppLayout';
import { AppView } from './components/layout/Header';
import { ApiSidebar } from './components/navigation/ApiSidebar';
import { EndpointDocView } from './components/documentation/EndpointDocView';
import { DocsPage } from './components/docs/DocsPage';
import { LearnPage } from './components/learn/LearnPage';
import { API_MODULES } from './data/api-modules';
import { 
  ArrowRight, 
  Layers, 
  Zap, 
  Shield, 
  Database, 
  GraduationCap, 
  BookOpen, 
  SlidersHorizontal
} from 'lucide-react';

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

  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);
  const { t } = useLanguage();

  const allEndpoints = API_MODULES.flatMap((m) => m.endpoints);
  const selectedEndpoint = allEndpoints.find((e) => e.id === selectedEndpointId);
  const currentModule = API_MODULES.find((m) => m.id === selectedEndpoint?.moduleId);

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

      {/* View 3: Console & Interactive Tester */}
      {currentView === 'console' && (
        <>
          {selectedEndpoint && currentModule ? (
            <EndpointDocView
              endpoint={selectedEndpoint}
              module={currentModule}
            />
          ) : (
            /* Platform Overview View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Welcome Banner */}
              <section style={{
                background: 'linear-gradient(135deg, rgba(65, 90, 36, 0.08), rgba(201, 225, 180, 0.25))',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ maxWidth: '840px' }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--brand-primary)',
                    marginBottom: '0.5rem'
                  }}>
                    {t('platformTag')}
                  </span>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '1rem' }}>
                    {t('platformTitle')}
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {t('platformDesc')}
                  </p>

                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedEndpointId('get-products')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#ffffff',
                        padding: '0.75rem 1.35rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(65,90,36,0.25)'
                      }}
                    >
                      <SlidersHorizontal size={17} />
                      <span>{t('exploreProductsBtn')}</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectView('docs')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#ffffff',
                        color: 'var(--text-primary)',
                        padding: '0.75rem 1.35rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        border: '1px solid var(--border-medium)',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <BookOpen size={17} className="text-emerald-600" />
                      <span>Documentation Guide (/docs)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectView('learn')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--brand-sage-light)',
                        color: 'var(--brand-primary)',
                        padding: '0.75rem 1.35rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      <GraduationCap size={18} />
                      <span>Learn REST API (/learn)</span>
                      <span className="nav-tab-badge" style={{ marginLeft: '0.25rem' }}>Interactive</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Major Portal Sections Showcase (Console, Docs, Learn) */}
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {/* Card 1: Console */}
                <div 
                  onClick={() => setSelectedEndpointId('get-products')}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--brand-sage-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <SlidersHorizontal size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      ⚡ Interactive API Console
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      Test 30 live endpoints directly with real-time response viewer, JSON payload editor, and latency metrics.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <span>Launch API Tester</span>
                    <ArrowRight size={15} />
                  </div>
                </div>

                {/* Card 2: Docs */}
                <div 
                  onClick={() => handleSelectView('docs')}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <BookOpen size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      📖 Documentation Reference (/docs)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      Comprehensive guide with ScrollSpy index, parameter tables, Fetch/Axios SDKs, status codes, and rate limits.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                    <span>Explore Documentation</span>
                    <ArrowRight size={15} />
                  </div>
                </div>

                {/* Card 3: Learn */}
                <div 
                  onClick={() => handleSelectView('learn')}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(237, 178, 0, 0.15)', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <GraduationCap size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      🎓 REST API Learning Center (/learn)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      6 step-by-step interactive lessons with hands-on live code exercises and knowledge assessment quizzes.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309', fontWeight: 700, fontSize: '0.85rem' }}>
                    <span>Start Learning Lessons</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </section>

              {/* Module Cards Grid */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('apiModulesHeading')} ({API_MODULES.length})
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    30 Total Production Endpoints
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {API_MODULES.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedEndpointId(m.endpoints[0]?.id || null)}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                          {m.name}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
                          {m.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                        <span>{m.endpoints.length} {t('endpointsCount')}</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Platform Highlights */}
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--brand-sage-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <Layers size={18} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>30 REST Endpoints</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full coverage across all e-commerce domains and catalog flows.</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <Shield size={18} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t('highlight2Title')}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('highlight2Desc')}</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <Zap size={18} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t('highlight3Title')}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('highlight3Desc')}</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(237, 178, 0, 0.15)', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <Database size={18} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>50+ Items per Collection</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Realistic datasets for thorough end-to-end API testing.</p>
                </div>
              </section>
            </div>
          )}
        </>
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
