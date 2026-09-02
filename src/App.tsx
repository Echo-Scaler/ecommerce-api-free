import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthTokenModal } from './components/auth/AuthTokenModal';
import { AppLayout } from './components/layout/AppLayout';
import { ApiSidebar } from './components/navigation/ApiSidebar';
import { EndpointDocView } from './components/documentation/EndpointDocView';
import { API_MODULES } from './data/api-modules';
import { ArrowRight, Layers, Zap, Shield, Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);
  const { t } = useLanguage();

  const allEndpoints = API_MODULES.flatMap((m) => m.endpoints);
  const selectedEndpoint = allEndpoints.find((e) => e.id === selectedEndpointId);
  const currentModule = API_MODULES.find((m) => m.id === selectedEndpoint?.moduleId);

  const sidebarContent = (
    <ApiSidebar
      modules={API_MODULES}
      selectedEndpointId={selectedEndpointId}
      onSelectEndpoint={(id) => setSelectedEndpointId(id)}
      onSelectOverview={() => setSelectedEndpointId(null)}
    />
  );

  return (
    <AppLayout sidebarContent={sidebarContent}>
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
            <div style={{ maxWidth: '780px' }}>
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
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '1rem' }}>
                {t('platformTitle')}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {t('platformDesc')}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedEndpointId('get-products')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#ffffff',
                    padding: '0.6rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>{t('exploreProductsBtn')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Module Cards Grid */}
          <section>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              {t('apiModulesHeading')} ({API_MODULES.length})
            </h2>
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
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t('highlight1Title')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('highlight1Desc')}</p>
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
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t('highlight4Title')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('highlight4Desc')}</p>
            </div>
          </section>
        </div>
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
