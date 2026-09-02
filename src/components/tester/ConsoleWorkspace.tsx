import React, { useState, useEffect } from 'react';
import { API_MODULES } from '../../data/api-modules';
import { ApiEndpoint, HttpMethod, ApiResponseExecution } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { executeApiRequest } from '../../lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../../lib/code-generator';
import { 
  Copy, 
  Check, 
  Download, 
  Clock, 
  Key, 
  ExternalLink
} from 'lucide-react';

interface ConsoleWorkspaceProps {
  initialEndpointId?: string | null;
  onNavigateToDocs?: () => void;
  onNavigateToLearn?: () => void;
}

export const ConsoleWorkspace: React.FC<ConsoleWorkspaceProps> = ({
  initialEndpointId,
  onNavigateToDocs,
}) => {
  const { token, openAuthModal } = useAuth();
  const { isMyanmar } = useLanguage();

  const allEndpoints = API_MODULES.flatMap((m) => m.endpoints);

  // Active state
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod>('GET');
  const [requestPath, setRequestPath] = useState<string>('/api/v1/products?limit=5');
  const [apiKey, setApiKey] = useState<string>(token || 'demo-key-12345');
  const [requestBody, setRequestBody] = useState<string>('');
  const [activeCodeTab, setActiveCodeTab] = useState<'fetch' | 'axios' | 'curl' | 'postman'>('fetch');
  
  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setLastResponse] = useState<ApiResponseExecution | null>(null);
  const [copiedBaseUrl, setCopiedBaseUrl] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeEndpointId, setActiveEndpointId] = useState<string>('get-products');

  // Sync token when auth context changes
  useEffect(() => {
    if (token) {
      setApiKey(token);
    }
  }, [token]);

  // Handle initial endpoint selection
  useEffect(() => {
    if (initialEndpointId) {
      const ep = allEndpoints.find((e) => e.id === initialEndpointId);
      if (ep) {
        selectEndpoint(ep);
      }
    }
  }, [initialEndpointId]);

  const selectEndpoint = (ep: ApiEndpoint, overridePath?: string) => {
    setActiveEndpointId(ep.id);
    setSelectedMethod(ep.method);
    const targetPath = overridePath || ep.path.replace(':id', '30').replace(':productId', '30').replace(':itemId', 'item_1');
    setRequestPath(targetPath);

    if (ep.defaultRequestBody && ['POST', 'PUT', 'PATCH'].includes(ep.method)) {
      setRequestBody(JSON.stringify(ep.defaultRequestBody, null, 2));
    } else {
      setRequestBody('');
    }
  };

  const selectPreset = (method: HttpMethod, path: string, body?: any, epId?: string) => {
    setSelectedMethod(method);
    setRequestPath(path);
    if (epId) setActiveEndpointId(epId);
    if (body) {
      setRequestBody(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
    } else {
      setRequestBody('');
    }
  };

  const handleSendRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      // Split path and query parameters
      const [pathOnly, queryString] = requestPath.split('?');
      const queryParams: Record<string, string> = {};
      if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((val, key) => {
          queryParams[key] = val;
        });
      }

      // Headers assembly
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      if (apiKey && apiKey.trim()) {
        headers['x-api-key'] = apiKey.trim();
        headers['Authorization'] = `Bearer ${apiKey.trim()}`;
      }

      const res = await executeApiRequest({
        path: pathOnly || requestPath,
        method: selectedMethod,
        queryParams,
        headers,
        body: requestBody.trim() ? requestBody : undefined,
        bearerToken: apiKey.trim() || undefined,
        endpointId: activeEndpointId
      });

      setLastResponse(res);
    } catch (err: any) {
      setLastResponse({
        status: 500,
        statusText: 'Internal Error',
        durationMs: 0,
        headers: { 'content-type': 'application/json' },
        data: { success: false, error: err?.message || 'Failed to execute request' },
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBaseUrl = async () => {
    try {
      await navigator.clipboard.writeText('https://api.ecommerce.example.com/api/v1');
      setCopiedBaseUrl(true);
      setTimeout(() => setCopiedBaseUrl(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyJson = async () => {
    if (!response) return;
    try {
      const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
      await navigator.clipboard.writeText(text);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadJson = () => {
    if (!response) return;
    try {
      const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${response.status}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Generate dynamic live integration snippets
  const currentEndpointObj = allEndpoints.find((e) => e.id === activeEndpointId) || allEndpoints[0];
  const activeFetchSnippet = generateFetchSnippet(currentEndpointObj, { bearerToken: apiKey, body: requestBody });
  const activeAxiosSnippet = generateAxiosSnippet(currentEndpointObj, { bearerToken: apiKey, body: requestBody });
  const activeCurlSnippet = generateCurlSnippet(currentEndpointObj, { bearerToken: apiKey, body: requestBody });

  const jsonResponseString = response 
    ? (typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2))
    : JSON.stringify({
        message: isMyanmar 
          ? 'အပေါ်ရှိ "Request ပေးပို့မည် 🚀" ခလုတ်ကို နှိပ်၍ API တုံ့ပြန်မှုရလဒ်ကို စစ်ဆေးပါ...' 
          : 'Click "Send Request 🚀" to execute this API endpoint and inspect live JSON payload...'
      }, null, 2);

  const payloadSizeKb = (new Blob([jsonResponseString]).size / 1024).toFixed(2);

  return (
    <div className="console-workspace-wrapper">
      {/* 1. TOP HERO / API INFO BANNER */}
      <section className="api-banner">
        <div className="banner-accent-bar" />

        <div className="banner-body">
          {/* Left: Hero info */}
          <div className="banner-hero">
            <div className="banner-eyebrow">
              <span className="banner-badge">🛍️ REST API</span>
              <span className="banner-status-dot">
                <span className="dot green" />
                <span>{isMyanmar ? 'တိုက်ရိုက် အသုံးပြုနိုင်သည်' : 'Live & Ready'}</span>
              </span>
            </div>

            <h1 className="banner-title">
              {isMyanmar ? 'အီးကောမတ်စ် API' : 'E-Commerce API'}{' '}
              <span className="banner-version">v2.0.0</span>
            </h1>

            <p className="banner-desc">
              {isMyanmar 
                ? 'ထုတ်လုပ်မှုအဆင့်မီ Bearer & API Key အတည်ပြုချက်ပါဝင်သော RESTful API ဖြစ်ပြီး ကုန်ပစ္စည်း ၅၀၊ ကဏ္ဍ ၅၀၊ အမှာစာ ၅၀၊ သုံးစွဲသူ ၅၀၊ စတော့၊ ခြင်းတောင်းနှင့် ရှာဖွေမှုစနစ်များကို အပြည့်အစုံ ထောက်ပံ့ပေးထားပါသည်။'
                : 'A production-ready, Bearer & API-Key-authenticated REST API delivering comprehensive data on 50+ products, categories, orders, customers, inventory, cart, and search. Built for developers who need reliable, structured e-commerce data fast.'}
            </p>

            {/* Feature tags */}
            <div className="banner-tags">
              <span className="btag btag-green">✓ JSON Responses</span>
              <span className="btag btag-blue">✓ Bearer & API Key Auth</span>
              <span className="btag btag-purple">✓ Rate Limited (1000 req/hr)</span>
              <span className="btag btag-orange">✓ RESTful Design</span>
              <span className="btag btag-slate">✓ Pagination &amp; Filtering</span>
              <span className="btag btag-slate">✓ 50 Records / Resource</span>
            </div>

            {/* Base URL bar */}
            <div className="banner-url-strip">
              <span className="url-strip-label">BASE URL</span>
              <code className="url-strip-code">https://api.ecommerce.example.com/api/v1</code>
              <button className="url-strip-copy" onClick={handleCopyBaseUrl} type="button">
                {copiedBaseUrl ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Stats + Use cases */}
          <div className="banner-right">
            <div className="banner-stat-grid">
              <div className="bstat-card">
                <span className="bstat-icon">📦</span>
                <span className="bstat-value">50+</span>
                <span className="bstat-label">{isMyanmar ? 'ကုန်ပစ္စည်းများ' : 'Products'}</span>
              </div>
              <div className="bstat-card">
                <span className="bstat-icon">⚡</span>
                <span className="bstat-value">35+</span>
                <span className="bstat-label">{isMyanmar ? 'Endpoints' : 'Endpoints'}</span>
              </div>
              <div className="bstat-card">
                <span className="bstat-icon">⏱️</span>
                <span className="bstat-value">{response ? `${response.durationMs}ms` : '~45ms'}</span>
                <span className="bstat-label">{isMyanmar ? 'တုံ့ပြန်မှုကြာချိန်' : 'Response'}</span>
              </div>
              <div className="bstat-card">
                <span className="bstat-icon">💚</span>
                <span className="bstat-value bstat-green">Online</span>
                <span className="bstat-label">{isMyanmar ? 'အခြေအနေ' : 'Status'}</span>
              </div>
            </div>

            <div className="banner-usecases">
              <p className="usecases-title">💡 {isMyanmar ? 'မည်သည့် အက်ပ်များ တည်ဆောက်နိုင်သနည်း?' : 'What can you build?'}</p>
              <ul className="usecases-list">
                <li>🛍️ <strong>{isMyanmar ? 'အွန်လိုင်းဆိုင်များ' : 'Storefronts & Apps'}</strong> — {isMyanmar ? 'ကုန်ပစ္စည်းကတ်တလောက်၊ ဈေးနှုန်းနှင့် အမျိုးအစားများ' : 'product catalog, pricing & category hierarchies'}</li>
                <li>🛒 <strong>{isMyanmar ? 'ခြင်းတောင်းနှင့် ငွေချေစနစ်' : 'Shopping Cart & Checkout'}</strong> — {isMyanmar ? 'ပစ္စည်းထည့်သွင်းခြင်း၊ တွက်ချက်ခြင်းနှင့် အမှာစာ' : 'live sessions, tax calculation & order creation'}</li>
                <li>👤 <strong>{isMyanmar ? 'ဝယ်ယူသူ စာမျက်နှာ' : 'Customer Portals'}</strong> — {isMyanmar ? 'ပရိုဖိုင်၊ လိပ်စာစာရင်းနှင့် အဆင့်အတန်းများ' : 'profiles, saved address book & membership tiers'}</li>
                <li>🔍 <strong>{isMyanmar ? 'အမြန်ရှာဖွေမှု' : 'Live Search & Autocomplete'}</strong> — {isMyanmar ? 'စာလုံးရိုက်သည်နှင့် ချက်ချင်းပေါ်သော အကြံပြုချက်' : 'instant query filtering & autocomplete suggestions'}</li>
                <li>📊 <strong>{isMyanmar ? 'စတော့စာရင်း ထိန်းချုပ်မှု' : 'Inventory Tracking'}</strong> — {isMyanmar ? 'လက်ကျန်စတော့နှင့် ဂိုဒေါင်နေရာများ' : 'real-time warehouse stock & low stock alerts'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONSOLE WORKSPACE (SPLIT 2-COLUMN LAYOUT) */}
      <main className="workspace-console-grid">
        {/* LEFT COLUMN: Endpoints, Query Presets & Integration Code Guide */}
        <section className="docs-panel-console">
          <div className="panel-header-row">
            <div>
              <h2 className="panel-header-title">{isMyanmar ? 'API Endpoints များ' : 'API Endpoints'}</h2>
              <p className="panel-header-sub">{isMyanmar ? 'စမ်းသပ်လိုသော Endpoint ကို နှိပ်၍ အချက်အလက်များကို ရယူပါ' : 'Click any endpoint card to test it instantly'}</p>
            </div>
            <button 
              type="button" 
              className="view-full-docs-link"
              onClick={onNavigateToDocs}
            >
              <span>{isMyanmar ? 'အပြည့်အစုံ ဖတ်ရန်' : 'View Full Docs'}</span>
              <ExternalLink size={12} />
            </button>
          </div>

          {/* Quick Query Presets Chips */}
          <div className="endpoint-group">
            <h3 className="group-title">🎯 {isMyanmar ? 'အမြန် စမ်းသပ်မှု နမူနာများ' : 'Query Options & Presets'}</h3>
            <div className="preset-chips-grid">
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/products?limit=5', undefined, 'get-products')}
              >
                📊 Top 5 Products
              </button>
              <button 
                type="button" 
                className="chip-btn highlight"
                onClick={() => selectPreset('GET', '/api/v1/products/30', undefined, 'get-product-by-id')}
              >
                📦 Product ID 30
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/search?q=sony', undefined, 'search-products')}
              >
                🔎 Search "sony"
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/products?category_id=cat_1', undefined, 'get-products')}
              >
                🏷️ Audio Category
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/categories/30', undefined, 'get-category-by-id')}
              >
                📁 Category ID 30
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/orders/30', undefined, 'get-order-by-id')}
              >
                📑 Order ID 30
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/cart', undefined, 'get-cart')}
              >
                🛒 Active Cart
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/inventory/low-stock?threshold=20', undefined, 'get-low-stock-items')}
              >
                📉 Low Stock (&lt; 20)
              </button>
            </div>
          </div>

          {/* Endpoints Group List */}
          {API_MODULES.map((mod) => (
            <div key={mod.id} className="endpoint-group">
              <h3 className="group-title">
                {mod.id === 'auth' && '🔐 '}
                {mod.id === 'products' && '📦 '}
                {mod.id === 'categories' && '📁 '}
                {mod.id === 'orders' && '📑 '}
                {mod.id === 'customers' && '👤 '}
                {mod.id === 'cart' && '🛒 '}
                {mod.id === 'search' && '🔎 '}
                {mod.id === 'inventory' && '📊 '}
                {mod.name}
              </h3>

              <div className="endpoint-cards-list">
                {mod.endpoints.map((ep) => {
                  const isActive = activeEndpointId === ep.id;
                  const methodClass = ep.method.toLowerCase();
                  return (
                    <div
                      key={ep.id}
                      className={`console-endpoint-card ${isActive ? 'active' : ''}`}
                      onClick={() => selectEndpoint(ep)}
                    >
                      <span className={`method-tag method-${methodClass}`}>{ep.method}</span>
                      <span className="card-path">{ep.path}</span>
                      <span className="card-desc">{ep.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Integration Code Guide */}
          <div className="endpoint-group code-guide-box">
            <div className="code-guide-header">
              <h3 className="group-title" style={{ marginBottom: 0 }}>💻 {isMyanmar ? 'ကုဒ်ဖြင့် ချိတ်ဆက်အသုံးပြုနည်း' : 'API Integration Code Guide'}</h3>
              <div className="code-guide-tabs">
                <button
                  type="button"
                  className={`code-guide-tab ${activeCodeTab === 'fetch' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('fetch')}
                >
                  Fetch API
                </button>
                <button
                  type="button"
                  className={`code-guide-tab ${activeCodeTab === 'axios' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('axios')}
                >
                  Axios
                </button>
                <button
                  type="button"
                  className={`code-guide-tab ${activeCodeTab === 'curl' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('curl')}
                >
                  cURL
                </button>
                <button
                  type="button"
                  className={`code-guide-tab ${activeCodeTab === 'postman' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('postman')}
                >
                  Postman
                </button>
              </div>
            </div>

            <div className="code-guide-body">
              {activeCodeTab === 'fetch' && (
                <pre className="code-display"><code>{activeFetchSnippet}</code></pre>
              )}
              {activeCodeTab === 'axios' && (
                <pre className="code-display"><code>{activeAxiosSnippet}</code></pre>
              )}
              {activeCodeTab === 'curl' && (
                <pre className="code-display"><code>{activeCurlSnippet}</code></pre>
              )}
              {activeCodeTab === 'postman' && (
                <div className="postman-guide-card">
                  <p><strong>Method 1: Header Method (Recommended)</strong></p>
                  <ul>
                    <li>Header: <code>x-api-key</code> &rarr; Value: <code>{apiKey || 'demo-key-12345'}</code></li>
                    <li>Header: <code>Authorization</code> &rarr; Value: <code>Bearer {apiKey || 'demo-key-12345'}</code></li>
                  </ul>
                  <p><strong>Method 2: Authorization Tab</strong></p>
                  <ul>
                    <li>Type: Select <strong>Bearer Token</strong> or <strong>API Key</strong></li>
                    <li>Key: <code>x-api-key</code>, Value: <code>{apiKey || 'demo-key-12345'}</code>, Add to: <code>Header</code></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Request Console & Response Viewer */}
        <section className="tester-panel-console">
          {/* Header */}
          <div className="panel-header-row">
            <div>
              <h2 className="panel-header-title">{isMyanmar ? 'တိုက်ရိုက် စမ်းသပ်မှု ကွန်ဆိုးလ်' : 'Interactive Request Console'}</h2>
              <div className="status-indicator-live">
                <span className="dot green" />
                <span className="live-text">{isMyanmar ? 'API ချိတ်ဆက်ထားသည်' : 'API Online'}</span>
              </div>
            </div>
          </div>

          {/* Request Form Box */}
          <form className="console-request-box" onSubmit={handleSendRequest}>
            {/* Request Bar */}
            <div className="request-url-bar">
              <select
                className={`method-dropdown method-select-${selectedMethod.toLowerCase()}`}
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as HttpMethod)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                className="path-text-input"
                value={requestPath}
                onChange={(e) => setRequestPath(e.target.value)}
                placeholder="/api/v1/products?limit=5"
                required
              />

              <button
                type="submit"
                className="send-request-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Executing...</span>
                ) : (
                  <span>{isMyanmar ? 'Request ပေးပို့မည် 🚀' : 'Send Request 🚀'}</span>
                )}
              </button>
            </div>

            {/* Auth Key Header */}
            <div className="request-auth-bar">
              <label className="auth-bar-label">
                <Key size={13} />
                <span>API Key Header (<code>x-api-key</code> / <code>Bearer</code>):</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-key-input"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="demo-key-12345"
                />
                <button
                  type="button"
                  className="manage-key-btn"
                  onClick={openAuthModal}
                  title="Manage Token or Presets"
                >
                  ⚡ Presets
                </button>
              </div>
            </div>

            {/* Request JSON Body (for POST, PUT, PATCH) */}
            {['POST', 'PUT', 'PATCH'].includes(selectedMethod) && (
              <div className="request-body-section">
                <div className="body-section-header">
                  <label className="body-label">JSON Request Body:</label>
                  <button
                    type="button"
                    className="btn-format-json"
                    onClick={() => {
                      try {
                        if (requestBody.trim()) {
                          setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
                        }
                      } catch {}
                    }}
                  >
                    Format JSON
                  </button>
                </div>
                <textarea
                  className="body-textarea"
                  rows={4}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{ "name": "New Product", "price": 99.99 }'
                />
              </div>
            )}
          </form>

          {/* Response Payload Viewer */}
          <div className="console-response-card">
            <div className="response-header-bar">
              <div className="response-metrics-group">
                <span className="response-heading-title">
                  {isMyanmar ? 'တုံ့ပြန်မှု ရလဒ် (Payload)' : 'Response Payload'}
                </span>

                <div className="badges-list">
                  <span className={`status-pill ${response ? (response.status < 400 ? 'status-ok' : 'status-err') : 'status-idle'}`}>
                    {response ? `${response.status} ${response.statusText}` : 'Status: --'}
                  </span>

                  <span className="time-pill">
                    <Clock size={12} />
                    <span>{response ? `${response.durationMs} ms` : 'Time: -- ms'}</span>
                  </span>

                  {response && (
                    <span className="speed-pill">
                      ⚡ {response.durationMs < 100 ? 'Fast' : 'Normal'}
                    </span>
                  )}

                  <span className="ratelimit-pill">
                    🛡️ Rate Limit: 994/1000
                  </span>

                  <span className="size-pill">
                    📦 {payloadSizeKb} KB
                  </span>
                </div>
              </div>

              <div className="response-action-buttons">
                <button
                  type="button"
                  className="btn-action-sm"
                  onClick={handleCopyJson}
                  title="Copy JSON to Clipboard"
                >
                  {copiedJson ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-action-sm"
                  onClick={handleDownloadJson}
                  title="Download .json file"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* JSON Content Pre Block */}
            <div className="response-json-container">
              <pre className="response-pre-code">
                <code>{jsonResponseString}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
