import React from 'react';
import { API_MODULES } from './data/api-modules';

export const App: React.FC = () => {
  const totalEndpoints = API_MODULES.reduce((acc, m) => acc + m.endpoints.length, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          🛒 E-Commerce API Documentation Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Architecture initialized with {API_MODULES.length} API modules and {totalEndpoints} total REST endpoints.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {API_MODULES.map((module) => (
          <div
            key={module.id}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {module.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {module.description}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
              {module.endpoints.length} Endpoints configured
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
