import React, { useState, useEffect } from 'react';
import { API_MODULES } from '../../data/api-modules';
import { 
  BookOpen, 
  Key, 
  Copy, 
  Check, 
  Layers, 
  ArrowUpRight, 
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface DocsPageProps {
  onNavigateToConsole?: (endpointId?: string) => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigateToConsole }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [docsSearchQuery, setDocsSearchQuery] = useState<string>('');

  const docSections = [
    { id: 'overview', title: '1. API Overview' },
    { id: 'authentication', title: '2. Authentication & Roles' },
    { id: 'endpoints', title: '3. Complete Endpoint Reference' },
    { id: 'query-params', title: '4. Query Options & Filters' },
    { id: 'postman-guide', title: '5. Postman & Code SDKs' },
    { id: 'status-codes', title: '6. Status & Error Codes' },
    { id: 'rate-limiting', title: '7. Rate Limiting Guide' },
    { id: 'best-practices', title: '8. Best Practices' }
  ];

  // ScrollSpy listener attached to .app-main-content and window
  useEffect(() => {
    const scrollContainer = document.querySelector('.app-main-content');
    
    const handleScroll = () => {
      const containerTop = scrollContainer ? scrollContainer.getBoundingClientRect().top : 0;
      
      for (const section of docSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const relativeTop = rect.top - containerTop;
          const relativeBottom = rect.bottom - containerTop;
          // When section is near top of viewport/container
          if (relativeTop <= 160 && relativeBottom > 60) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    scrollContainer?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const allEndpoints = API_MODULES.flatMap((m) => m.endpoints);
  const filteredEndpoints = docsSearchQuery.trim()
    ? allEndpoints.filter((e) => 
        e.name.toLowerCase().includes(docsSearchQuery.toLowerCase()) ||
        e.path.toLowerCase().includes(docsSearchQuery.toLowerCase()) ||
        e.method.toLowerCase().includes(docsSearchQuery.toLowerCase()) ||
        e.summary.toLowerCase().includes(docsSearchQuery.toLowerCase())
      )
    : allEndpoints;

  return (
    <div className="docs-page-wrapper">
      {/* Docs Header Banner */}
      <div className="docs-hero-banner">
        <div className="docs-hero-left">
          <div className="docs-hero-pill">
            <BookOpen size={14} />
            <span>Developer Reference Guide</span>
          </div>
          <h1 className="docs-hero-title">E-Commerce REST API Documentation</h1>
          <p className="docs-hero-subtitle">
            Complete technical specification for 8 e-commerce REST modules, 30 endpoints, Bearer authorization, 50-item mock datasets, query pagination, and rate limit quotas.
          </p>
        </div>

        <div className="docs-hero-meta-card">
          <div className="docs-meta-item">
            <span className="meta-val">8</span>
            <span className="meta-lbl">API Modules</span>
          </div>
          <div className="docs-meta-divider" />
          <div className="docs-meta-item">
            <span className="meta-val">30</span>
            <span className="meta-lbl">Endpoints</span>
          </div>
          <div className="docs-meta-divider" />
          <div className="docs-meta-item">
            <span className="meta-val">50+</span>
            <span className="meta-lbl">Items / List</span>
          </div>
        </div>
      </div>

      {/* Docs Layout (Sidebar + Content) */}
      <div className="docs-layout-container">
        {/* Left Sticky Sidebar */}
        <nav className="docs-sticky-sidebar">
          <div className="sidebar-index-title">
            <Layers size={16} />
            <span>Documentation Index</span>
          </div>

          <div className="docs-nav-links-list">
            {docSections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                className={`docs-sidebar-link ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => scrollToSection(sec.id)}
              >
                {sec.title}
              </button>
            ))}
          </div>

          <div className="sidebar-cta-card">
            <Sparkles size={16} className="text-emerald-500" />
            <h4>Live Interactive Tester</h4>
            <p>Send real requests and inspect headers directly in the browser.</p>
            <button
              type="button"
              className="btn-sidebar-console"
              onClick={() => onNavigateToConsole && onNavigateToConsole()}
            >
              <span>Launch API Console</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </nav>

        {/* Right Main Content */}
        <main className="docs-main-content">
          {/* 1. API Overview */}
          <section id="overview" className="docs-section-card">
            <h2 className="section-title">1. API Overview & Architecture</h2>
            <p className="section-intro">
              The <strong>E-Commerce REST API</strong> is a comprehensive developer API built to power modern retail applications, storefronts, and warehouse workflows. All endpoints return formatted JSON data and follow RESTful resource semantics.
            </p>

            <div className="base-url-box">
              <span className="base-url-label">Production & Sandbox Base URL:</span>
              <div className="base-url-row">
                <code className="base-url-code">https://api.ecommerce.example.com/api/v1</code>
                <button
                  type="button"
                  className="btn-copy-code"
                  onClick={() => copyToClipboard('https://api.ecommerce.example.com/api/v1', 'base-url')}
                >
                  {copiedCodeId === 'base-url' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="feature-grid-3">
              <div className="feature-mini-card">
                <div className="feature-mini-icon bg-emerald-100 text-emerald-700">📦</div>
                <h4>50-Item Test Datasets</h4>
                <p>Every collection endpoint returns 50 realistic products, categories, orders, customers, and cart items.</p>
              </div>
              <div className="feature-mini-card">
                <div className="feature-mini-icon bg-blue-100 text-blue-700">🔐</div>
                <h4>Bearer Authentication</h4>
                <p>Role-based access guards (Admin, Customer, Guest) with JWT token verification.</p>
              </div>
              <div className="feature-mini-card">
                <div className="feature-mini-icon bg-amber-100 text-amber-700">⚡</div>
                <h4>Dynamic Query Filters</h4>
                <p>Full support for page, limit, price range filtering, full-text search, and multi-field sorting.</p>
              </div>
            </div>
          </section>

          {/* 2. Authentication */}
          <section id="authentication" className="docs-section-card">
            <h2 className="section-title">2. Authentication & Authorization</h2>
            <p className="section-intro">
              Protected endpoints require authentication via an HTTP <code>Authorization: Bearer &lt;token&gt;</code> header.
            </p>

            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Sample Bearer Token</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Admin</strong></td>
                    <td>Full CRUD access to Catalog, Categories, Inventory adjustments, and Order statuses.</td>
                    <td><code>Bearer eyJhbGciOi...admin-token</code></td>
                  </tr>
                  <tr>
                    <td><strong>Customer</strong></td>
                    <td>Manage Shopping Cart, Place Orders, view Addresses, and update Profile.</td>
                    <td><code>Bearer eyJhbGciOi...customer-token</code></td>
                  </tr>
                  <tr>
                    <td><strong>Public / Guest</strong></td>
                    <td>Read-only access to Products, Categories, and Search suggestions.</td>
                    <td><em>No Header Required</em></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="theory-callout callout-tip" style={{ marginTop: '1.25rem' }}>
              <div className="callout-icon"><Sparkles size={16} /></div>
              <div className="callout-text">
                Use the <strong>Authorize</strong> button in the top navigation to switch preset tokens instantly between Admin and Customer roles.
              </div>
            </div>
          </section>

          {/* 3. Complete API Endpoint Reference */}
          <section id="endpoints" className="docs-section-card">
            <div className="section-title-row">
              <h2 className="section-title">3. Complete API Endpoint Reference ({API_MODULES.length} Modules / 30 Endpoints)</h2>
            </div>
            
            {/* Live Filter in Docs */}
            <div className="docs-search-bar">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Filter endpoints by name, path, or verb..."
                value={docsSearchQuery}
                onChange={(e) => setDocsSearchQuery(e.target.value)}
                className="docs-search-input"
              />
              {docsSearchQuery && (
                <button
                  type="button"
                  className="docs-search-clear"
                  onClick={() => setDocsSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>

            {API_MODULES.map((module) => {
              const moduleEndpoints = filteredEndpoints.filter((e) => e.moduleId === module.id);
              if (moduleEndpoints.length === 0) return null;

              return (
                <div key={module.id} className="module-doc-block">
                  <div className="module-doc-header">
                    <h3 className="module-doc-title">{module.name} Module</h3>
                    <span className="module-doc-count">{moduleEndpoints.length} Endpoints</span>
                  </div>
                  <p className="module-doc-desc">{module.description}</p>

                  <div className="endpoints-cards-stack">
                    {moduleEndpoints.map((ep) => (
                      <div key={ep.id} className="endpoint-doc-card">
                        <div className="endpoint-doc-top">
                          <div className="endpoint-path-group">
                            <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                              {ep.method}
                            </span>
                            <code className="endpoint-path-code">{ep.path}</code>
                          </div>

                          <div className="endpoint-actions-group">
                            {ep.authRequired && (
                              <span className="auth-indicator-pill">
                                <Key size={12} /> Auth Required
                              </span>
                            )}
                            {onNavigateToConsole && (
                              <button
                                type="button"
                                className="btn-test-in-console"
                                onClick={() => onNavigateToConsole(ep.id)}
                                title="Open this endpoint in interactive tester"
                              >
                                <span>🚀 Test in Console</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="endpoint-doc-body">
                          <h4 className="endpoint-name-text">{ep.name}</h4>
                          <p className="endpoint-summary-text">{ep.summary}</p>

                          {ep.parameters && ep.parameters.length > 0 && (
                            <div className="endpoint-params-box">
                              <span className="params-mini-title">Parameters:</span>
                              <div className="params-mini-list">
                                {ep.parameters.map((p) => (
                                  <span key={p.name} className="param-mini-pill">
                                    <strong>{p.name}</strong> ({p.location}): <em>{p.type}</em> {p.required ? '• Required' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {ep.responseExamples && ep.responseExamples[0] && (
                            <div className="endpoint-example-preview">
                              <div className="example-preview-header">
                                <span>Response: {ep.responseExamples[0].statusCode} {ep.responseExamples[0].statusText}</span>
                                <button
                                  type="button"
                                  className="btn-copy-mini"
                                  onClick={() => copyToClipboard(JSON.stringify(ep.responseExamples[0].body, null, 2), ep.id)}
                                >
                                  {copiedCodeId === ep.id ? <Check size={12} /> : <Copy size={12} />}
                                  <span>{copiedCodeId === ep.id ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <pre className="example-pre">
                                <code>{JSON.stringify(ep.responseExamples[0].body, null, 2).slice(0, 300)}...</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          {/* 4. Query Options Guide */}
          <section id="query-params" className="docs-section-card">
            <h2 className="section-title">4. Query Parameters & Filtering Guide</h2>
            <p className="section-intro">
              Tailor API collection responses using standard query parameters:
            </p>

            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Applicable Endpoints</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>page</code></td>
                    <td>Number</td>
                    <td><code>/products</code>, <code>/orders</code></td>
                    <td>Page number for pagination (1-indexed, Default: 1)</td>
                    <td><code>?page=2</code></td>
                  </tr>
                  <tr>
                    <td><code>limit</code></td>
                    <td>Number</td>
                    <td><code>/products</code>, <code>/orders</code></td>
                    <td>Number of records per page (Default: 50, Max: 50)</td>
                    <td><code>?limit=50</code></td>
                  </tr>
                  <tr>
                    <td><code>sort</code></td>
                    <td>String</td>
                    <td><code>/products</code></td>
                    <td>Sort by field and direction (<code>price:asc</code>, <code>price:desc</code>)</td>
                    <td><code>?sort=price:asc</code></td>
                  </tr>
                  <tr>
                    <td><code>category_id</code></td>
                    <td>String</td>
                    <td><code>/products</code></td>
                    <td>Filter products by category UUID</td>
                    <td><code>?category_id=cat_1</code></td>
                  </tr>
                  <tr>
                    <td><code>q</code></td>
                    <td>String</td>
                    <td><code>/search</code>, <code>/search/suggestions</code></td>
                    <td>Full-text search query across title and SKU</td>
                    <td><code>?q=wireless+headphones</code></td>
                  </tr>
                  <tr>
                    <td><code>min_price</code></td>
                    <td>Number</td>
                    <td><code>/search</code></td>
                    <td>Minimum price boundary filter</td>
                    <td><code>?min_price=50</code></td>
                  </tr>
                  <tr>
                    <td><code>max_price</code></td>
                    <td>Number</td>
                    <td><code>/search</code></td>
                    <td>Maximum price boundary filter</td>
                    <td><code>?max_price=300</code></td>
                  </tr>
                  <tr>
                    <td><code>status</code></td>
                    <td>String</td>
                    <td><code>/orders</code></td>
                    <td>Filter orders by status (<code>pending</code>, <code>shipped</code>, etc.)</td>
                    <td><code>?status=delivered</code></td>
                  </tr>
                  <tr>
                    <td><code>threshold</code></td>
                    <td>Number</td>
                    <td><code>/inventory/low-stock</code></td>
                    <td>Inventory stock quantity threshold</td>
                    <td><code>?threshold=20</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Postman & Integration Guide */}
          <section id="postman-guide" className="docs-section-card">
            <h2 className="section-title">5. Integration & Code SDKs</h2>
            <p className="section-intro">
              Execute API calls in any frontend or backend environment:
            </p>

            <div className="code-tabs-container">
              <div className="code-snippet-card">
                <div className="code-snippet-header">
                  <span>JavaScript / TypeScript (Fetch API)</span>
                  <button
                    type="button"
                    className="btn-copy-code"
                    onClick={() => copyToClipboard(`fetch('https://api.ecommerce.example.com/api/v1/products?limit=50', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`, 'fetch-sdk')}
                  >
                    {copiedCodeId === 'fetch-sdk' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCodeId === 'fetch-sdk' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="code-pre">
                  <code>{`fetch('https://api.ecommerce.example.com/api/v1/products?limit=50', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
                </pre>
              </div>

              <div className="code-snippet-card" style={{ marginTop: '1rem' }}>
                <div className="code-snippet-header">
                  <span>Node.js / Axios</span>
                  <button
                    type="button"
                    className="btn-copy-code"
                    onClick={() => copyToClipboard(`import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ecommerce.example.com/api/v1',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

const response = await api.get('/products', { params: { limit: 50 } });
console.log(response.data);`, 'axios-sdk')}
                  >
                    {copiedCodeId === 'axios-sdk' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCodeId === 'axios-sdk' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="code-pre">
                  <code>{`import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ecommerce.example.com/api/v1',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

const response = await api.get('/products', { params: { limit: 50 } });
console.log(response.data);`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* 6. Status & Error Codes */}
          <section id="status-codes" className="docs-section-card">
            <h2 className="section-title">6. HTTP Status & Error Codes</h2>
            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Status Code</th>
                    <th>Reason</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="status-badge-mini bg-emerald-100 text-emerald-800">200 OK</span></td>
                    <td>Success</td>
                    <td>Request executed successfully.</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-emerald-100 text-emerald-800">201 Created</span></td>
                    <td>Created</td>
                    <td>Resource successfully created (e.g. Order checkout).</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-amber-100 text-amber-800">400 Bad Request</span></td>
                    <td>Malformed Request</td>
                    <td>Invalid JSON payload or missing parameters.</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-red-100 text-red-800">401 Unauthorized</span></td>
                    <td>Missing Token</td>
                    <td>Bearer authentication token is missing or invalid.</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-purple-100 text-purple-800">403 Forbidden</span></td>
                    <td>Forbidden Role</td>
                    <td>Admin privileges required for this endpoint.</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-gray-100 text-gray-800">404 Not Found</span></td>
                    <td>Resource Missing</td>
                    <td>Product, Order, or Category ID not found in database.</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-orange-100 text-orange-800">429 Rate Limit</span></td>
                    <td>Quota Exceeded</td>
                    <td>Exceeded 100 requests per 15-minute sliding window.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. Rate Limiting Guide */}
          <section id="rate-limiting" className="docs-section-card">
            <h2 className="section-title">7. Rate Limiting & Quotas Guide</h2>
            <p className="section-intro">
              The API enforces rate limits to guarantee system stability and high availability across all clients:
            </p>

            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Response Header</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>X-RateLimit-Limit</code></td>
                    <td>Maximum allowed requests per window</td>
                    <td><code>100</code></td>
                  </tr>
                  <tr>
                    <td><code>X-RateLimit-Remaining</code></td>
                    <td>Remaining requests available in current window</td>
                    <td><code>94</code></td>
                  </tr>
                  <tr>
                    <td><code>Retry-After</code></td>
                    <td>Seconds to wait before retrying when throttled (429)</td>
                    <td><code>60</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. Best Practices */}
          <section id="best-practices" className="docs-section-card">
            <h2 className="section-title">8. Best Practices & Security</h2>
            <div className="best-practices-grid">
              <div className="bp-card">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <h4>Cache Static Catalog Data</h4>
                  <p>Store product category trees in browser storage to avoid repeated redundant calls.</p>
                </div>
              </div>
              <div className="bp-card">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <h4>Use Bearer Tokens Safely</h4>
                  <p>Never commit secret tokens to version control; pass tokens strictly via headers over TLS.</p>
                </div>
              </div>
              <div className="bp-card">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <h4>Handle Exponential Backoff</h4>
                  <p>Implement retry handlers with progressive delays when receiving HTTP 429 or 503 responses.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
