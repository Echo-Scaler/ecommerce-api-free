import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ApiSidebar } from './components/navigation/ApiSidebar';
import { MethodBadge } from './components/common/MethodBadge';
import { API_MODULES } from './data/api-modules';
import { Key, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);

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
        /* Selected Endpoint View Placeholder for Step 5 (full doc view in Step 6) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)'
          }}>
            <span>{currentModule.name}</span>
            <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedEndpoint.name}</span>
          </div>

          <div style={{
            padding: '1.75rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <MethodBadge method={selectedEndpoint.method} size="md" />
              <code style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedEndpoint.path}
              </code>
              {selectedEndpoint.authRequired && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.725rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontWeight: 600
                }}>
                  <Key size={12} />
                  Bearer Token Required
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedEndpoint.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              {selectedEndpoint.description}
            </p>
          </div>
        </div>
      ) : (
        /* Platform Overview View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Welcome Banner */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(124, 58, 237, 0.06))',
            border: '1px solid rgba(59, 130, 246, 0.25)',
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
                color: 'var(--accent-primary)',
                marginBottom: '0.5rem'
              }}>
                RESTful Developer Platform
              </span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '1rem' }}>
                E-Commerce API Documentation & Interactive Testing
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Explore modules on the left navigation to inspect real endpoints, parameter schemas, request bodies, and send requests directly in browser.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedEndpointId('get-products')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#ffffff',
                    padding: '0.6rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>Explore Products API</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Module Cards Grid */}
          <section>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              API Modules ({API_MODULES.length})
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    <span>{m.endpoints.length} Endpoints</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AppLayout>
  );
};

export default App;
