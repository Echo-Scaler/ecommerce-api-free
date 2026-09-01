import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { API_MODULES } from './data/api-modules';
import { Layers, Database, Shield, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const totalEndpoints = API_MODULES.reduce((acc, m) => acc + m.endpoints.length, 0);

  const sidebarPlaceholder = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ 
        padding: '0.75rem', 
        borderRadius: 'var(--radius-md)', 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-subtle)' 
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>
          Available Modules
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
          {API_MODULES.length} Categories ({totalEndpoints} Endpoints)
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {API_MODULES.map((m) => (
          <div
            key={m.id}
            style={{
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.825rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span>{m.name}</span>
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '0.1rem 0.4rem', 
              borderRadius: '999px', 
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'var(--text-muted)'
            }}>
              {m.endpoints.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AppLayout sidebarContent={sidebarPlaceholder}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Welcome Banner */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.05))',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '720px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent-primary)',
              marginBottom: '0.5rem'
            }}>
              RESTful Developer Platform
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1rem' }}>
              E-Commerce API Documentation & Interactive Suite
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              A high-performance interactive documentation workspace for modern e-commerce engineering. 
              Explore routes, inspect parameters and JSON payloads, authenticate via Bearer token, and test real endpoints.
            </p>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
              background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              8 Core Modules
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Products, Categories, Orders, Customers, Auth, Cart, Search, and Inventory.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
              background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Interactive Tester
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Live in-browser request execution with status codes, headers, and latency.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
              background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Bearer Authentication
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              JWT token persistence and role-based endpoint authorization.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
              background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Database size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Code Generators
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ready-to-copy code snippets in cURL, Fetch, and Axios.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default App;
