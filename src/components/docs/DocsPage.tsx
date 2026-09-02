import React, { useState, useEffect } from 'react';
import { API_MODULES } from '../../data/api-modules';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, isMyanmar } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [docsSearchQuery, setDocsSearchQuery] = useState<string>('');

  const docSections = [
    { id: 'overview', title: t('docsSecOverview') },
    { id: 'authentication', title: t('docsSecAuth') },
    { id: 'endpoints', title: t('docsSecEndpoints') },
    { id: 'query-params', title: t('docsSecQueryParams') },
    { id: 'postman-guide', title: t('docsSecSdks') },
    { id: 'status-codes', title: t('docsSecStatusCodes') },
    { id: 'rate-limiting', title: t('docsSecRateLimit') },
    { id: 'best-practices', title: t('docsSecBestPractices') }
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
            <span>{t('docsHeroBadge')}</span>
          </div>
          <h1 className="docs-hero-title">{t('docsHeroTitle')}</h1>
          <p className="docs-hero-subtitle">{t('docsHeroSubtitle')}</p>
        </div>

        <div className="docs-hero-meta-card">
          <div className="docs-meta-item">
            <span className="meta-val">8</span>
            <span className="meta-lbl">{isMyanmar ? 'API ကဏ္ဍများ' : 'API Modules'}</span>
          </div>
          <div className="docs-meta-divider" />
          <div className="docs-meta-item">
            <span className="meta-val">30</span>
            <span className="meta-lbl">{isMyanmar ? 'Endpoints' : 'Endpoints'}</span>
          </div>
          <div className="docs-meta-divider" />
          <div className="docs-meta-item">
            <span className="meta-val">50+</span>
            <span className="meta-lbl">{isMyanmar ? 'ဒေတာ / စာရင်း' : 'Items / List'}</span>
          </div>
        </div>
      </div>

      {/* Docs Layout (Sidebar + Content) */}
      <div className="docs-layout-container">
        {/* Left Sticky Sidebar */}
        <nav className="docs-sticky-sidebar">
          <div className="sidebar-index-title">
            <Layers size={16} />
            <span>{t('docsIndexTitle')}</span>
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
            <h4>{t('docsLiveTesterTitle')}</h4>
            <p>{t('docsLiveTesterDesc')}</p>
            <button
              type="button"
              className="btn-sidebar-console"
              onClick={() => onNavigateToConsole && onNavigateToConsole()}
            >
              <span>{t('docsLaunchConsoleBtn')}</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </nav>

        {/* Right Main Content */}
        <main className="docs-main-content">
          {/* 1. API Overview */}
          <section id="overview" className="docs-section-card">
            <h2 className="section-title">{t('docsSecOverview')}</h2>
            <p className="section-intro">
              {isMyanmar 
                ? 'အီးကောမတ်စ် REST API သည် ခေတ်မီ အရောင်းဆိုင် အက်ပ်များ၊ အွန်လိုင်းစတိုးများနှင့် ဂိုဒေါင်လုပ်ငန်းစဉ်များကို ချိတ်ဆက်ရန် တည်ဆောက်ထားသော ပြည့်စုံသည့် API ဖြစ်သည်။ Endpoints အားလုံးသည် ပုံစံတကျ JSON ဒေတာများကိုသာ ပြန်လည်ပေးပို့ပြီး RESTful စံနှုန်းများကို လိုက်နာထားပါသည်။'
                : 'The E-Commerce REST API is a comprehensive developer API built to power modern retail applications, storefronts, and warehouse workflows. All endpoints return formatted JSON data and follow RESTful resource semantics.'}
            </p>

            <div className="base-url-box">
              <span className="base-url-label">{isMyanmar ? 'ပင်မ Base URL:' : 'Production & Sandbox Base URL:'}</span>
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
                <h4>{isMyanmar ? 'နမူနာ ဒေတာ ၅၀ စီ ပါဝင်မှု' : '50-Item Test Datasets'}</h4>
                <p>
                  {isMyanmar 
                    ? 'Collection endpoint တိုင်းတွင် လက်တွေ့ကျသော ကုန်ပစ္စည်း၊ ကဏ္ဍ၊ အမှာစာ၊ ဝယ်ယူသူနှင့် ခြင်းတောင်းပစ္စည်း ၅၀ စီ ပြန်လည်ပေးပို့ပါသည်။'
                    : 'Every collection endpoint returns 50 realistic products, categories, orders, customers, and cart items.'}
                </p>
              </div>
              <div className="feature-mini-card">
                <div className="feature-mini-icon bg-blue-100 text-blue-700">🔐</div>
                <h4>{isMyanmar ? 'Bearer အတည်ပြုချက် စနစ်' : 'Bearer Authentication'}</h4>
                <p>
                  {isMyanmar 
                    ? 'JWT တိုကင် စစ်ဆေးမှုဖြင့် အခန်းကဏ္ဍအလိုက် ခွင့်ပြုချက်များ (Admin, Customer, Guest) ကို ထိန်းချုပ်ထားပါသည်။'
                    : 'Role-based access guards (Admin, Customer, Guest) with JWT token verification.'}
                </p>
              </div>
              <div className="feature-mini-card">
                <div className="feature-mini-icon bg-amber-100 text-amber-700">⚡</div>
                <h4>{isMyanmar ? 'Query စစ်ထုတ်မှု စနစ်' : 'Dynamic Query Filters'}</h4>
                <p>
                  {isMyanmar 
                    ? 'စာမျက်နှာ (page)၊ အရေအတွက် (limit)၊ ဈေးနှုန်း အကွာအဝေး၊ စာသားရှာဖွေခြင်းနှင့် စီစဉ်ခြင်းများကို အပြည့်အဝ ထောက်ပံ့ပေးပါသည်။'
                    : 'Full support for page, limit, price range filtering, full-text search, and multi-field sorting.'}
                </p>
              </div>
            </div>
          </section>

          {/* 2. Authentication */}
          <section id="authentication" className="docs-section-card">
            <h2 className="section-title">{t('docsSecAuth')}</h2>
            <p className="section-intro">
              {isMyanmar 
                ? 'လုံခြုံရေးတပ်ထားသော Endpoints များကို အသုံးပြုရန် HTTP Authorization: Bearer <token> header ဖြင့် စစ်မှန်ကြောင်း အတည်ပြုရန် လိုအပ်ပါသည်။'
                : 'Protected endpoints require authentication via an HTTP Authorization: Bearer <token> header.'}
            </p>

            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>{isMyanmar ? 'အခန်းကဏ္ဍ (Role)' : 'Role'}</th>
                    <th>{isMyanmar ? 'လုပ်ပိုင်ခွင့်များ (Permissions)' : 'Permissions'}</th>
                    <th>{isMyanmar ? 'နမူနာ Bearer တိုကင်' : 'Sample Bearer Token'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Admin</strong></td>
                    <td>{isMyanmar ? 'ကုန်ပစ္စည်းစာရင်း၊ ကဏ္ဍများ၊ စတော့ချိန်ညှိမှုနှင့် အမှာစာအခြေအနေများကို အပြည့်အဝ စီမံခန့်ခွဲနိုင်ခြင်း (Full CRUD)။' : 'Full CRUD access to Catalog, Categories, Inventory adjustments, and Order statuses.'}</td>
                    <td><code>Bearer eyJhbGciOi...admin-token</code></td>
                  </tr>
                  <tr>
                    <td><strong>Customer</strong></td>
                    <td>{isMyanmar ? 'ခြင်းတောင်းစီမံခြင်း၊ အမှာစာတင်ခြင်း၊ လိပ်စာများနှင့် ကိုယ်ရေးအချက်အလက်များကို ကြည့်ရှုပြင်ဆင်နိုင်ခြင်း။' : 'Manage Shopping Cart, Place Orders, view Addresses, and update Profile.'}</td>
                    <td><code>Bearer eyJhbGciOi...customer-token</code></td>
                  </tr>
                  <tr>
                    <td><strong>Public / Guest</strong></td>
                    <td>{isMyanmar ? 'ကုန်ပစ္စည်းများ၊ ကဏ္ဍများနှင့် ရှာဖွေမှု အကြံပြုချက်များကို ဖတ်ရှုရုံသာ (Read-only) အသုံးပြုနိုင်ခြင်း။' : 'Read-only access to Products, Categories, and Search suggestions.'}</td>
                    <td><em>{isMyanmar ? 'Header မလိုအပ်ပါ' : 'No Header Required'}</em></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="theory-callout callout-tip" style={{ marginTop: '1.25rem' }}>
              <div className="callout-icon"><Sparkles size={16} /></div>
              <div className="callout-text">
                {isMyanmar 
                  ? 'အပေါ်ဘက် မီနူးရှိ "ခွင့်ပြုချက် / Presets" ခလုတ်ကို နှိပ်၍ အက်ဒမင်နှင့် ဝယ်ယူသူ တိုကင်များကို ချက်ချင်း ပြောင်းလဲအသုံးပြုနိုင်ပါသည်။'
                  : 'Use the Authorize button in the top navigation to switch preset tokens instantly between Admin and Customer roles.'}
              </div>
            </div>
          </section>

          {/* 3. Complete API Endpoint Reference */}
          <section id="endpoints" className="docs-section-card">
            <div className="section-title-row">
              <h2 className="section-title">
                {isMyanmar 
                  ? `၃။ ပြည့်စုံသော API Endpoint လမ်းညွှန် (မော်ဂျူး ${API_MODULES.length} ခု / Endpoints ၃၀ ခု)` 
                  : `3. Complete API Endpoint Reference (${API_MODULES.length} Modules / 30 Endpoints)`}
              </h2>
            </div>
            
            {/* Live Filter in Docs */}
            <div className="docs-search-bar">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={isMyanmar ? 'အမည်၊ လမ်းကြောင်း သို့မဟုတ် HTTP verb ဖြင့် ရှာဖွေရန်...' : 'Filter endpoints by name, path, or verb...'}
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
                  {isMyanmar ? 'ရှင်းမည်' : 'Clear'}
                </button>
              )}
            </div>

            {API_MODULES.map((module) => {
              const moduleEndpoints = filteredEndpoints.filter((e) => e.moduleId === module.id);
              if (moduleEndpoints.length === 0) return null;

              return (
                <div key={module.id} className="module-doc-block">
                  <div className="module-doc-header">
                    <h3 className="module-doc-title">{module.name} {isMyanmar ? 'မော်ဂျူး' : 'Module'}</h3>
                    <span className="module-doc-count">{isMyanmar ? `Endpoints ${moduleEndpoints.length} ခု` : `${moduleEndpoints.length} Endpoints`}</span>
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
                                <Key size={12} /> {isMyanmar ? 'တိုကင် လိုအပ်သည်' : 'Auth Required'}
                              </span>
                            )}
                            {onNavigateToConsole && (
                              <button
                                type="button"
                                className="btn-test-in-console"
                                onClick={() => onNavigateToConsole(ep.id)}
                                title={isMyanmar ? 'ဤ endpoint ကို ကွန်ဆိုးလ်တွင် စမ်းသပ်မည်' : 'Open this endpoint in interactive tester'}
                              >
                                <span>{isMyanmar ? '🚀 ကွန်ဆိုးလ်တွင် စမ်းသပ်မည်' : '🚀 Test in Console'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="endpoint-doc-body">
                          <h4 className="endpoint-name-text">{ep.name}</h4>
                          <p className="endpoint-summary-text">{ep.summary}</p>

                          {ep.parameters && ep.parameters.length > 0 && (
                            <div className="endpoint-params-box">
                              <span className="params-mini-title">{isMyanmar ? 'ပါရာမီတာများ:' : 'Parameters:'}</span>
                              <div className="params-mini-list">
                                {ep.parameters.map((p) => (
                                  <span key={p.name} className="param-mini-pill">
                                    <strong>{p.name}</strong> ({p.location}): <em>{p.type}</em> {p.required ? (isMyanmar ? '• မဖြစ်မနေ' : '• Required') : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {ep.responseExamples && ep.responseExamples[0] && (
                            <div className="endpoint-example-preview">
                              <div className="example-preview-header">
                                <span>{isMyanmar ? 'တုံ့ပြန်မှု:' : 'Response:'} {ep.responseExamples[0].statusCode} {ep.responseExamples[0].statusText}</span>
                                <button
                                  type="button"
                                  className="btn-copy-mini"
                                  onClick={() => copyToClipboard(JSON.stringify(ep.responseExamples[0].body, null, 2), ep.id)}
                                >
                                  {copiedCodeId === ep.id ? <Check size={12} /> : <Copy size={12} />}
                                  <span>{copiedCodeId === ep.id ? (isMyanmar ? 'ကူးယူပြီး' : 'Copied') : (isMyanmar ? 'ကူးယူမည်' : 'Copy')}</span>
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
            <h2 className="section-title">{t('docsSecQueryParams')}</h2>
            <p className="section-intro">
              {isMyanmar 
                ? 'အောက်ပါ စံသတ်မှတ်ထားသော query ပါရာမီတာများကို အသုံးပြု၍ API မှ ပြန်လည်ပေးပို့မည့် အချက်အလက်များကို လိုသလို ချိန်ညှိနိုင်ပါသည်:'
                : 'Tailor API collection responses using standard query parameters:'}
            </p>

            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>{isMyanmar ? 'ပါရာမီတာ' : 'Parameter'}</th>
                    <th>{isMyanmar ? 'အမျိုးအစား' : 'Type'}</th>
                    <th>{isMyanmar ? 'သက်ဆိုင်သော Endpoints' : 'Applicable Endpoints'}</th>
                    <th>{isMyanmar ? 'ဖော်ပြချက်' : 'Description'}</th>
                    <th>{isMyanmar ? 'နမူနာ' : 'Example'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>page</code></td>
                    <td>Number</td>
                    <td><code>/products</code>, <code>/orders</code></td>
                    <td>{isMyanmar ? 'စာမျက်နှာခွဲခြားမှုအတွက် စာမျက်နှာနံပါတ် (၁ မှ စတင်သည်၊ မူလ: ၁)' : 'Page number for pagination (1-indexed, Default: 1)'}</td>
                    <td><code>?page=2</code></td>
                  </tr>
                  <tr>
                    <td><code>limit</code></td>
                    <td>Number</td>
                    <td><code>/products</code>, <code>/orders</code></td>
                    <td>{isMyanmar ? 'တစ်မျက်နှာလျှင် ပြသလိုသော ဒေတာအရေအတွက် (မူလ: ၅၀၊ အများဆုံး: ၅၀)' : 'Number of records per page (Default: 50, Max: 50)'}</td>
                    <td><code>?limit=50</code></td>
                  </tr>
                  <tr>
                    <td><code>sort</code></td>
                    <td>String</td>
                    <td><code>/products</code></td>
                    <td>{isMyanmar ? 'သတ်မှတ်အကွက်နှင့် ဦးတည်ချက်အလိုက် စီစဉ်ခြင်း (price:asc, price:desc)' : 'Sort by field and direction (price:asc, price:desc)'}</td>
                    <td><code>?sort=price:asc</code></td>
                  </tr>
                  <tr>
                    <td><code>category_id</code></td>
                    <td>String</td>
                    <td><code>/products</code></td>
                    <td>{isMyanmar ? 'ကဏ္ဍ ID ဖြင့် ကုန်ပစ္စည်းများကို စစ်ထုတ်ခြင်း' : 'Filter products by category UUID'}</td>
                    <td><code>?category_id=cat_1</code></td>
                  </tr>
                  <tr>
                    <td><code>q</code></td>
                    <td>String</td>
                    <td><code>/search</code>, <code>/search/suggestions</code></td>
                    <td>{isMyanmar ? 'ကုန်ပစ္စည်းအမည်နှင့် SKU တို့တွင် စာသားအပြည့်အစုံ ရှာဖွေခြင်း' : 'Full-text search query across title and SKU'}</td>
                    <td><code>?q=wireless+headphones</code></td>
                  </tr>
                  <tr>
                    <td><code>min_price</code></td>
                    <td>Number</td>
                    <td><code>/search</code></td>
                    <td>{isMyanmar ? 'အနည်းဆုံး ဈေးနှုန်း သတ်မှတ်ချက်' : 'Minimum price boundary filter'}</td>
                    <td><code>?min_price=50</code></td>
                  </tr>
                  <tr>
                    <td><code>max_price</code></td>
                    <td>Number</td>
                    <td><code>/search</code></td>
                    <td>{isMyanmar ? 'အများဆုံး ဈေးနှုန်း သတ်မှတ်ချက်' : 'Maximum price boundary filter'}</td>
                    <td><code>?max_price=300</code></td>
                  </tr>
                  <tr>
                    <td><code>status</code></td>
                    <td>String</td>
                    <td><code>/orders</code></td>
                    <td>{isMyanmar ? 'အမှာစာ အခြေအနေဖြင့် စစ်ထုတ်ခြင်း (pending, shipped စသည်)' : 'Filter orders by status (pending, shipped, etc.)'}</td>
                    <td><code>?status=delivered</code></td>
                  </tr>
                  <tr>
                    <td><code>threshold</code></td>
                    <td>Number</td>
                    <td><code>/inventory/low-stock</code></td>
                    <td>{isMyanmar ? 'စတော့လက်ကျန် နည်းပါးမှု အရေအတွက် သတ်မှတ်ချက်' : 'Inventory stock quantity threshold'}</td>
                    <td><code>?threshold=20</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Postman & Integration Guide */}
          <section id="postman-guide" className="docs-section-card">
            <h2 className="section-title">{t('docsSecSdks')}</h2>
            <p className="section-intro">
              {isMyanmar 
                ? 'မည်သည့် frontend သို့မဟုတ် backend ပတ်ဝန်းကျင်တွင်မဆို API ခေါ်ဆိုမှုများကို အောက်ပါအတိုင်း အလွယ်တကူ ပြုလုပ်နိုင်ပါသည်:'
                : 'Execute API calls in any frontend or backend environment:'}
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
                    <span>{copiedCodeId === 'fetch-sdk' ? (isMyanmar ? 'ကူးယူပြီး' : 'Copied') : (isMyanmar ? 'ကူးယူမည်' : 'Copy')}</span>
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
                    <span>{copiedCodeId === 'axios-sdk' ? (isMyanmar ? 'ကူးယူပြီး' : 'Copied') : (isMyanmar ? 'ကူးယူမည်' : 'Copy')}</span>
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
            <h2 className="section-title">{t('docsSecStatusCodes')}</h2>
            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>{isMyanmar ? 'Status ကုဒ်' : 'Status Code'}</th>
                    <th>{isMyanmar ? 'အကြောင်းပြချက်' : 'Reason'}</th>
                    <th>{isMyanmar ? 'ဖော်ပြချက်' : 'Description'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="status-badge-mini bg-emerald-100 text-emerald-800">200 OK</span></td>
                    <td>{isMyanmar ? 'အောင်မြင်သည်' : 'Success'}</td>
                    <td>{isMyanmar ? 'တောင်းဆိုမှု အောင်မြင်စွာ ဆောင်ရွက်ပြီးစီးပါသည်။' : 'Request executed successfully.'}</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-emerald-100 text-emerald-800">201 Created</span></td>
                    <td>{isMyanmar ? 'ဖန်တီးပြီးပြီ' : 'Created'}</td>
                    <td>{isMyanmar ? 'အသစ်ဖန်တီးမှု အောင်မြင်ပါသည် (ဥပမာ - အမှာစာ တင်ခြင်း)။' : 'Resource successfully created (e.g. Order checkout).'}</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-amber-100 text-amber-800">400 Bad Request</span></td>
                    <td>{isMyanmar ? 'မှားယွင်းသော Request' : 'Malformed Request'}</td>
                    <td>{isMyanmar ? 'JSON ပုံစံ မှားယွင်းနေခြင်း သို့မဟုတ် လိုအပ်သော ပါရာမီတာများ မပြည့်စုံခြင်း။' : 'Invalid JSON payload or missing parameters.'}</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-red-100 text-red-800">401 Unauthorized</span></td>
                    <td>{isMyanmar ? 'တိုကင် မရှိပါ' : 'Missing Token'}</td>
                    <td>{isMyanmar ? 'Bearer authentication တိုကင် မရှိပါ သို့မဟုတ် သက်တမ်းကုန်ဆုံးနေပါသည်။' : 'Bearer authentication token is missing or invalid.'}</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-purple-100 text-purple-800">403 Forbidden</span></td>
                    <td>{isMyanmar ? 'ခွင့်ပြုချက် မရှိပါ' : 'Forbidden Role'}</td>
                    <td>{isMyanmar ? 'ဤ Endpoint ကို အသုံးပြုရန် အက်ဒမင် (Admin) လုပ်ပိုင်ခွင့် လိုအပ်ပါသည်။' : 'Admin privileges required for this endpoint.'}</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-gray-100 text-gray-800">404 Not Found</span></td>
                    <td>{isMyanmar ? 'ရှာမတွေ့ပါ' : 'Resource Missing'}</td>
                    <td>{isMyanmar ? 'ကုန်ပစ္စည်း၊ အမှာစာ သို့မဟုတ် ကဏ္ဍ ID ကို ဒေတာဘေ့စ်တွင် ရှာမတွေ့ပါ။' : 'Product, Order, or Category ID not found in database.'}</td>
                  </tr>
                  <tr>
                    <td><span className="status-badge-mini bg-orange-100 text-orange-800">429 Rate Limit</span></td>
                    <td>{isMyanmar ? 'ကန့်သတ်ချက် ကျော်လွန်သည်' : 'Quota Exceeded'}</td>
                    <td>{isMyanmar ? '၁၅ မိနစ်အတွင်း အကြိမ် ၁၀၀ ထက်ကျော်လွန်၍ အသုံးပြုမိပါသည်။' : 'Exceeded 100 requests per 15-minute sliding window.'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. Rate Limiting Guide */}
          <section id="rate-limiting" className="docs-section-card">
            <h2 className="section-title">{t('docsSecRateLimit')}</h2>
            <p className="section-intro">
              {isMyanmar 
                ? 'စနစ် တည်ငြိမ်မှုနှင့် မြန်ဆန်မှုကို ထိန်းသိမ်းရန်အတွက် API ခေါ်ဆိုမှုများကို ကန့်သတ်ချက်များ သတ်မှတ်ထားပါသည်:'
                : 'The API enforces rate limits to guarantee system stability and high availability across all clients:'}
            </p>

            <div className="table-responsive">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>{isMyanmar ? 'Response Header' : 'Response Header'}</th>
                    <th>{isMyanmar ? 'ဖော်ပြချက်' : 'Description'}</th>
                    <th>{isMyanmar ? 'နမူနာ' : 'Example'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>X-RateLimit-Limit</code></td>
                    <td>{isMyanmar ? 'သတ်မှတ်ချိန်အတွင်း အများဆုံး ခေါ်ဆိုနိုင်သည့် အကြိမ်ရေ' : 'Maximum allowed requests per window'}</td>
                    <td><code>100</code></td>
                  </tr>
                  <tr>
                    <td><code>X-RateLimit-Remaining</code></td>
                    <td>{isMyanmar ? 'လက်ရှိ ကျန်ရှိနေသေးသော ခေါ်ဆိုနိုင်သည့် အကြိမ်ရေ' : 'Remaining requests available in current window'}</td>
                    <td><code>94</code></td>
                  </tr>
                  <tr>
                    <td><code>Retry-After</code></td>
                    <td>{isMyanmar ? 'ကန့်သတ်ချက် ကျော်လွန်ပါက (429) ပြန်လည်မခေါ်ဆိုမီ စောင့်ဆိုင်းရမည့် စက္ကန့်' : 'Seconds to wait before retrying when throttled (429)'}</td>
                    <td><code>60</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. Best Practices */}
          <section id="best-practices" className="docs-section-card">
            <h2 className="section-title">{t('docsSecBestPractices')}</h2>
            <div className="best-practices-grid">
              <div className="bp-card">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <h4>{isMyanmar ? 'မပြောင်းလဲသော ဒေတာများကို Cache သိမ်းဆည်းထားပါ' : 'Cache Static Catalog Data'}</h4>
                  <p>{isMyanmar ? 'ထပ်ခါထပ်ခါ ခေါ်ဆိုမှုများကို လျှော့ချရန် ကုန်ပစ္စည်း ကဏ္ဍများကို browser storage တွင် သိမ်းဆည်း အသုံးပြုပါ။' : 'Store product category trees in browser storage to avoid repeated redundant calls.'}</p>
                </div>
              </div>
              <div className="bp-card">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <h4>{isMyanmar ? 'Bearer တိုကင်များကို လုံခြုံစွာ ကိုင်တွယ်ပါ' : 'Use Bearer Tokens Safely'}</h4>
                  <p>{isMyanmar ? 'လျှို့ဝှက်တိုကင်များကို Git သို့ မတင်ပါနှင့်။ HTTPS လုံခြုံရေးမှတစ်ဆင့်သာ Header တွင် ထည့်သွင်းပေးပို့ပါ။' : 'Never commit secret tokens to version control; pass tokens strictly via headers over TLS.'}</p>
                </div>
              </div>
              <div className="bp-card">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <h4>{isMyanmar ? 'တုံ့ပြန်မှု နှောင့်နှေးမှုများကို စနစ်တကျ စီမံပါ (Exponential Backoff)' : 'Handle Exponential Backoff'}</h4>
                  <p>{isMyanmar ? 'HTTP 429 သို့မဟုတ် 503 ရရှိပါက ချက်ချင်း ထပ်မခေါ်ဘဲ စက္ကန့်အနည်းငယ် ခြားပြီးမှ ပြန်လည်ကြိုးစားသည့် စနစ် ထည့်သွင်းပါ။' : 'Implement retry handlers with progressive delays when receiving HTTP 429 or 503 responses.'}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
