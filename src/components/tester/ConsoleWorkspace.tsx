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
  ExternalLink,
  Send
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

  const executePath = async (method: HttpMethod, path: string, body?: string, epId?: string) => {
    setIsLoading(true);
    try {
      const [pathOnly, queryString] = path.split('?');
      const queryParams: Record<string, string> = {};
      if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((val, key) => {
          queryParams[key] = val;
        });
      }

      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      if (apiKey && apiKey.trim()) {
        headers['x-api-key'] = apiKey.trim();
        headers['Authorization'] = `Bearer ${apiKey.trim()}`;
      }

      const res = await executeApiRequest({
        path: pathOnly || path,
        method,
        queryParams,
        headers,
        body: body && body.trim() ? body : undefined,
        bearerToken: apiKey.trim() || undefined,
        endpointId: epId || activeEndpointId
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

  // Sync token when auth context changes
  useEffect(() => {
    if (token) {
      setApiKey(token);
    }
  }, [token]);

  // Handle initial endpoint selection & initial load
  useEffect(() => {
    if (initialEndpointId) {
      const ep = allEndpoints.find((e) => e.id === initialEndpointId);
      if (ep) {
        selectEndpoint(ep);
        return;
      }
    }
    // Default initial execution
    executePath('GET', '/api/v1/products?limit=5', undefined, 'get-products');
  }, [initialEndpointId]);

  const selectEndpoint = (ep: ApiEndpoint, overridePath?: string) => {
    setActiveEndpointId(ep.id);
    setSelectedMethod(ep.method);
    const targetPath = overridePath || ep.path.replace(':id', '30').replace(':productId', '30').replace(':itemId', 'item_1');
    setRequestPath(targetPath);

    let bodyStr = '';
    if (ep.defaultRequestBody && ['POST', 'PUT', 'PATCH'].includes(ep.method)) {
      bodyStr = JSON.stringify(ep.defaultRequestBody, null, 2);
      setRequestBody(bodyStr);
    } else {
      setRequestBody('');
    }

    // Immediately execute and display related data
    executePath(ep.method, targetPath, bodyStr, ep.id);
  };

  const selectPreset = (method: HttpMethod, path: string, body?: any, epId?: string) => {
    setSelectedMethod(method);
    setRequestPath(path);
    if (epId) setActiveEndpointId(epId);
    let bodyStr = '';
    if (body) {
      bodyStr = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
      setRequestBody(bodyStr);
    } else {
      setRequestBody('');
    }

    // Immediately execute and display related data
    executePath(method, path, bodyStr, epId);
  };

  const handleSendRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await executePath(selectedMethod, requestPath, requestBody, activeEndpointId);
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
              <span className="btag btag-green">✓ {isMyanmar ? 'JSON တုံ့ပြန်မှုများ' : 'JSON Responses'}</span>
              <span className="btag btag-blue">✓ {isMyanmar ? 'Bearer & API Key အတည်ပြုချက်' : 'Bearer & API Key Auth'}</span>
              <span className="btag btag-purple">✓ {isMyanmar ? 'Rate Limited (၁၀၀၀ req/hr)' : 'Rate Limited (1000 req/hr)'}</span>
              <span className="btag btag-orange">✓ {isMyanmar ? 'RESTful ဒီဇိုင်း' : 'RESTful Design'}</span>
              <span className="btag btag-slate">✓ {isMyanmar ? 'Pagination & စစ်ထုတ်မှုများ' : 'Pagination & Filtering'}</span>
              <span className="btag btag-slate">✓ {isMyanmar ? 'ဒေတာ ၅၀ စီ ပါဝင်မှု' : '50 Records / Resource'}</span>
            </div>

            {/* Base URL bar */}
            <div className="banner-url-strip">
              <span className="url-strip-label">BASE URL</span>
              <code className="url-strip-code">https://api.ecommerce.example.com/api/v1</code>
              <button className="url-strip-copy" onClick={handleCopyBaseUrl} type="button">
                {copiedBaseUrl ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>{isMyanmar ? 'ကူးယူပြီး!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>{isMyanmar ? 'ကူးယူမည်' : 'Copy'}</span>
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
                <span className="bstat-value bstat-green">{isMyanmar ? 'အွန်လိုင်း' : 'Online'}</span>
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

      {/* 2. MAIN CONSOLE WORKSPACE HEADER */}
      <div className="console-workspace-header-bar">
        <div className="workspace-title-group">
          <h2 className="workspace-main-heading">
            {isMyanmar ? 'API စမ်းသပ်မှုနှင့် အချက်အလက်များ' : 'API Testing & Documentation'}
          </h2>
          <span className="workspace-subtitle">
            {isMyanmar ? 'Endpoints များကို စမ်းသပ်ပြီး တုံ့ပြန်မှုရလဒ်များကို တိုက်ရိုက်ကြည့်ရှုပါ' : 'Select an endpoint to test or enter custom API requests'}
          </span>
        </div>
      </div>

      <main className="workspace-console-grid">
        {/* 1. API MODULES (8 MODULES IN RESPONSIVE GRID) */}
        <section className="api-modules-section col-span-full">
          <div className="panel-header-row">
            <div>
              <h2 className="panel-header-title">{isMyanmar ? 'API ကဏ္ဍများ' : 'API Modules'}</h2>
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
          <div className="endpoint-group query-presets-group">
            <h3 className="group-title">🎯 {isMyanmar ? 'အမြန် စမ်းသပ်မှု နမူနာများ' : 'Query Options & Presets'}</h3>
            <div className="preset-chips-grid">
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/products?limit=5', undefined, 'get-products')}
              >
                {isMyanmar ? '📊 ထိပ်တန်း ကုန်ပစ္စည်း ၅ ခု' : '📊 Top 5 Products'}
              </button>
              <button
                type="button"
                className="chip-btn highlight"
                onClick={() => selectPreset('GET', '/api/v1/products/30', undefined, 'get-product-by-id')}
              >
                {isMyanmar ? '📦 ကုန်ပစ္စည်း ID 30' : '📦 Product ID 30'}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/search?q=sony', undefined, 'search-products')}
              >
                {isMyanmar ? '🔎 "sony" ရှာဖွေမည်' : '🔎 Search "sony"'}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/products?category_id=cat_1', undefined, 'get-products')}
              >
                {isMyanmar ? '🏷️ အသံပိုင်းဆိုင်ရာ ကဏ္ဍ' : '🏷️ Audio Category'}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/categories/30', undefined, 'get-category-by-id')}
              >
                {isMyanmar ? '📁 ကဏ္ဍ ID 30' : '📁 Category ID 30'}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/orders/30', undefined, 'get-order-by-id')}
              >
                {isMyanmar ? '📑 အမှာစာ ID 30' : '📑 Order ID 30'}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/cart', undefined, 'get-cart')}
              >
                {isMyanmar ? '🛒 လက်ရှိ ခြင်းတောင်း' : '🛒 Active Cart'}
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => selectPreset('GET', '/api/v1/inventory/low-stock?threshold=20', undefined, 'get-low-stock-items')}
              >
                {isMyanmar ? '📉 စတော့နည်း ပစ္စည်းများ (< 20)' : '📉 Low Stock (< 20)'}
              </button>
            </div>
          </div>

          {/* 8 API MODULES GRID */}
          <div className="api-modules-grid">
            {API_MODULES.map((mod) => (
              <div key={mod.id} className="endpoint-group module-grid-card">
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
          </div>
        </section>

        {/* 1. RESPONSE PAYLOAD (FULL ROW WIDTH, APPEARS FIRST) */}
        <section className="console-response-card col-span-full" id="response-payload-section">
          <div className="response-header-bar">
            <div className="response-metrics-group">
              <span className="response-heading-title">
                {isMyanmar ? 'တုံ့ပြန်မှု ရလဒ် (Payload)' : 'Response Payload'}
              </span>

              <div className="badges-list">
                <span className={`status-pill ${response ? (response.status < 400 ? 'status-ok' : 'status-err') : 'status-idle'}`}>
                  {response ? `${response.status} ${response.statusText}` : (isMyanmar ? 'အခြေအနေ: --' : 'Status: --')}
                </span>

                <span className="time-pill">
                  <Clock size={12} />
                  <span>{response ? `${response.durationMs} ms` : (isMyanmar ? 'ကြာချိန်: -- ms' : 'Time: -- ms')}</span>
                </span>

                {response && (
                  <span className="speed-pill">
                    ⚡ {response.durationMs < 100 ? (isMyanmar ? 'မြန်ဆန်' : 'Fast') : (isMyanmar ? 'ပုံမှန်' : 'Normal')}
                  </span>
                )}

                <span className="ratelimit-pill">
                  🛡️ {isMyanmar ? 'ကန့်သတ်ချက်: 994/1000' : 'Rate Limit: 994/1000'}
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
                title={isMyanmar ? 'JSON ကို ကူးယူမည်' : 'Copy JSON to Clipboard'}
              >
                {copiedJson ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">{isMyanmar ? 'ကူးယူပြီး!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>{isMyanmar ? 'JSON ကူးယူမည်' : 'Copy JSON'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-action-sm"
                onClick={handleDownloadJson}
                title={isMyanmar ? '.json ဖိုင်အဖြစ် ဒေါင်းလုဒ်ဆွဲမည်' : 'Download .json file'}
              >
                <Download size={13} />
                <span>{isMyanmar ? 'ဒေါင်းလုဒ်' : 'Download'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Request Bar Embedded in Response Payload Section */}
          <form className="console-request-box response-embedded-request" onSubmit={handleSendRequest} style={{ border: 'none', borderRadius: 0, borderBottom: '1px solid var(--border-subtle)', background: '#fafbfa', padding: '1rem 1.15rem' }}>
            <div className="request-url-row">
              <div className="request-url-bar">
                <select
                  className={`method-dropdown method-select-${selectedMethod.toLowerCase()}`}
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value as HttpMethod)}
                  aria-label="HTTP Method"
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
                  aria-label="API Request URL Path"
                />
              </div>

              <button
                type="submit"
                className="send-request-btn"
                disabled={isLoading}
                title={isMyanmar ? 'Request ပေးပို့ရန် နှိပ်ပါ (သို့မဟုတ် Enter ခေါက်ပါ)' : 'Click to send request (or press Enter)'}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner" />
                    <span>{isMyanmar ? 'ပေးပို့နေသည်...' : 'Executing...'}</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isMyanmar ? 'Request ပေးပို့မည်' : 'Send Request'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="request-auth-bar">
              <label className="auth-bar-label">
                <Key size={13} />
                <span>{isMyanmar ? 'API Key Header (x-api-key / Bearer):' : 'API Key Header (x-api-key / Bearer):'}</span>
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
                  title={isMyanmar ? 'တိုကင် သို့မဟုတ် Presets စီမံမည်' : 'Manage Token or Presets'}
                >
                  ⚡ {isMyanmar ? 'တိုကင်များ' : 'Presets'}
                </button>
              </div>
            </div>

            {['POST', 'PUT', 'PATCH'].includes(selectedMethod) && (
              <div className="request-body-section">
                <div className="body-section-header">
                  <label className="body-label">{isMyanmar ? 'JSON ပေးပို့မည့် အချက်အလက် (Body):' : 'JSON Request Body:'}</label>
                  <button
                    type="button"
                    className="btn-format-json"
                    onClick={() => {
                      try {
                        if (requestBody.trim()) {
                          setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
                        }
                      } catch { }
                    }}
                  >
                    {isMyanmar ? 'JSON ပုံစံညှိမည်' : 'Format JSON'}
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

          {/* JSON Content Pre Block */}
          <div className="response-json-container">
            <pre className="response-pre-code">
              <code>{jsonResponseString}</code>
            </pre>
          </div>
        </section>

        {/* 3. API INTEGRATION CODE GUIDE (FULL ROW WIDTH, DIRECTLY BELOW RESPONSE PAYLOAD) */}
        <section className="endpoint-group code-guide-box col-span-full" id="api-integration-code-guide">
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
                <p><strong>{isMyanmar ? 'နည်းလမ်း ၁: Header နည်းလမ်း (အကြံပြုထားသည်)' : 'Method 1: Header Method (Recommended)'}</strong></p>
                <ul>
                  <li>Header: <code>x-api-key</code> &rarr; Value: <code>{apiKey || 'demo-key-12345'}</code></li>
                  <li>Header: <code>Authorization</code> &rarr; Value: <code>Bearer {apiKey || 'demo-key-12345'}</code></li>
                </ul>
                <p><strong>{isMyanmar ? 'နည်းလမ်း ၂: Authorization Tab နည်းလမ်း' : 'Method 2: Authorization Tab'}</strong></p>
                <ul>
                  <li>Type: {isMyanmar ? 'Bearer Token သို့မဟုတ် API Key ကို ရွေးချယ်ပါ' : 'Select Bearer Token or API Key'}</li>
                  <li>Key: <code>x-api-key</code>, Value: <code>{apiKey || 'demo-key-12345'}</code>, Add to: <code>Header</code></li>
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
