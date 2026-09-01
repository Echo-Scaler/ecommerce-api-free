import React, { useState, useEffect } from 'react';
import { ApiEndpoint } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import { MethodBadge } from '../common/MethodBadge';
import { getApiBaseUrl, buildInterpolatedPath, buildQueryString } from '../../lib/api-client';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';

interface ApiTesterFormProps {
  endpoint: ApiEndpoint;
  onSendRequest: (requestData: {
    method: ApiEndpoint['method'];
    path: string;
    pathParams: Record<string, string>;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
    body?: string;
  }) => void;
  isLoading?: boolean;
}

export const ApiTesterForm: React.FC<ApiTesterFormProps> = ({
  endpoint,
  onSendRequest,
  isLoading = false
}) => {
  const { token, isAuthenticated, openAuthModal } = useAuth();

  // Path params state
  const pathParamDefs = endpoint.parameters.filter((p) => p.location === 'path');
  const queryParamDefs = endpoint.parameters.filter((p) => p.location === 'query');

  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [customHeaders, setCustomHeaders] = useState<Array<{ key: string; value: string; enabled: boolean }>>([
    { key: 'Accept', value: 'application/json', enabled: true }
  ]);
  const [requestBody, setRequestBody] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Initialize parameters and body when endpoint changes
  useEffect(() => {
    // Initial path params
    const initialPathParams: Record<string, string> = {};
    pathParamDefs.forEach((p) => {
      initialPathParams[p.name] = p.example !== undefined ? String(p.example) : (p.defaultValue !== undefined ? String(p.defaultValue) : '');
    });
    setPathParams(initialPathParams);

    // Initial query params
    const initialQueryParams: Record<string, string> = {};
    queryParamDefs.forEach((p) => {
      initialQueryParams[p.name] = p.defaultValue !== undefined ? String(p.defaultValue) : (p.example !== undefined ? String(p.example) : '');
    });
    setQueryParams(initialQueryParams);

    // Initial request body
    if (endpoint.defaultRequestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      setRequestBody(JSON.stringify(endpoint.defaultRequestBody, null, 2));
    } else {
      setRequestBody('');
    }
    setJsonError(null);
  }, [endpoint]);

  // Validate JSON on change
  const handleBodyChange = (value: string) => {
    setRequestBody(value);
    if (!value.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON format');
    }
  };

  const handleFormatJson = () => {
    if (!requestBody.trim()) return;
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch {
      // Keep existing error
    }
  };

  const handleReset = () => {
    // Reset path params
    const initialPathParams: Record<string, string> = {};
    pathParamDefs.forEach((p) => {
      initialPathParams[p.name] = p.example !== undefined ? String(p.example) : '';
    });
    setPathParams(initialPathParams);

    // Reset query params
    const initialQueryParams: Record<string, string> = {};
    queryParamDefs.forEach((p) => {
      initialQueryParams[p.name] = p.defaultValue !== undefined ? String(p.defaultValue) : '';
    });
    setQueryParams(initialQueryParams);

    // Reset body
    if (endpoint.defaultRequestBody) {
      setRequestBody(JSON.stringify(endpoint.defaultRequestBody, null, 2));
    } else {
      setRequestBody('');
    }
    setJsonError(null);
  };

  // Add custom header
  const handleAddHeader = () => {
    setCustomHeaders((prev) => [...prev, { key: '', value: '', enabled: true }]);
  };

  const handleRemoveHeader = (index: number) => {
    setCustomHeaders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value' | 'enabled', val: any) => {
    setCustomHeaders((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: val } : h))
    );
  };

  const resolvedPath = buildInterpolatedPath(endpoint.path, pathParams);
  const resolvedQuery = buildQueryString(queryParams);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonError) return;

    // Assemble headers
    const headerObj: Record<string, string> = {};
    customHeaders.forEach((h) => {
      if (h.enabled && h.key.trim()) {
        headerObj[h.key.trim()] = h.value;
      }
    });

    onSendRequest({
      method: endpoint.method,
      path: endpoint.path,
      pathParams,
      queryParams,
      headers: headerObj,
      body: ['POST', 'PUT', 'PATCH'].includes(endpoint.method) ? requestBody : undefined
    });
  };

  return (
    <form className="api-tester-form" onSubmit={handleSubmit}>
      {/* Interactive URL Bar */}
      <div className="tester-url-bar">
        <div className="tester-method-wrapper">
          <MethodBadge method={endpoint.method} size="md" />
        </div>
        <div className="tester-url-input-box">
          <span className="tester-base-url">{getApiBaseUrl()}</span>
          <span className="tester-resolved-path">{resolvedPath}</span>
          {resolvedQuery && <span className="tester-resolved-query">{resolvedQuery}</span>}
        </div>
        <button
          type="submit"
          className="tester-send-btn"
          disabled={isLoading || !!jsonError}
        >
          {isLoading ? (
            <>
              <span className="spinner-mini"></span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Send Request</span>
            </>
          )}
        </button>
      </div>

      {/* Auth Notification Bar */}
      <div className="tester-auth-bar">
        <div className="tester-auth-info">
          {endpoint.authRequired ? (
            isAuthenticated ? (
              <>
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>
                  Using active Bearer Token (<code className="auth-token-subtle">Bearer {token?.substring(0, 10)}...</code>)
                </span>
              </>
            ) : (
              <>
                <ShieldAlert size={16} className="text-amber-400" />
                <span className="text-amber-300 font-medium">
                  Authentication is required for this endpoint.
                </span>
              </>
            )
          ) : (
            <>
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-secondary">This endpoint does not require authentication.</span>
            </>
          )}
        </div>
        {endpoint.authRequired && !isAuthenticated && (
          <button
            type="button"
            className="tester-auth-action-btn"
            onClick={openAuthModal}
          >
            Add Bearer Token
          </button>
        )}
      </div>

      {/* Path Parameters Section */}
      {pathParamDefs.length > 0 && (
        <div className="tester-param-card">
          <div className="tester-card-header">
            <h4 className="tester-card-title">Path Parameters</h4>
            <span className="tester-card-subtitle">{pathParamDefs.length} variable(s) in URL path</span>
          </div>
          <div className="tester-inputs-grid">
            {pathParamDefs.map((p) => (
              <div key={p.name} className="tester-field-group">
                <label className="tester-field-label">
                  <span className="tester-field-name">:{p.name}</span>
                  <span className="tester-field-type">{p.type}</span>
                  {p.required && <span className="tester-required-star">*</span>}
                </label>
                <input
                  type="text"
                  className="tester-text-input"
                  placeholder={p.example ? `e.g. ${p.example}` : `Enter ${p.name}`}
                  value={pathParams[p.name] ?? ''}
                  onChange={(e) =>
                    setPathParams((prev) => ({ ...prev, [p.name]: e.target.value }))
                  }
                  required={p.required}
                />
                <span className="tester-field-desc">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Parameters Section */}
      {queryParamDefs.length > 0 && (
        <div className="tester-param-card">
          <div className="tester-card-header">
            <h4 className="tester-card-title">Query Parameters</h4>
            <span className="tester-card-subtitle">URL search parameters</span>
          </div>
          <div className="tester-inputs-grid">
            {queryParamDefs.map((p) => (
              <div key={p.name} className="tester-field-group">
                <label className="tester-field-label">
                  <span className="tester-field-name">{p.name}</span>
                  <span className="tester-field-type">{p.type}</span>
                  {p.required && <span className="tester-required-star">*</span>}
                </label>
                <input
                  type="text"
                  className="tester-text-input"
                  placeholder={p.defaultValue !== undefined ? `Default: ${p.defaultValue}` : `e.g. ${p.example || ''}`}
                  value={queryParams[p.name] ?? ''}
                  onChange={(e) =>
                    setQueryParams((prev) => ({ ...prev, [p.name]: e.target.value }))
                  }
                />
                <span className="tester-field-desc">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Body Editor (for POST, PUT, PATCH) */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div className="tester-param-card">
          <div className="tester-card-header">
            <div className="tester-title-with-actions">
              <h4 className="tester-card-title">Request Body (JSON)</h4>
              <span className="content-type-badge">application/json</span>
            </div>
            <div className="tester-body-tools">
              <button
                type="button"
                className="tester-tool-btn"
                onClick={handleFormatJson}
                title="Format / Beautify JSON"
              >
                <Sparkles size={13} />
                <span>Format JSON</span>
              </button>
              <button
                type="button"
                className="tester-tool-btn"
                onClick={handleReset}
                title="Reset to default payload template"
              >
                <RotateCcw size={13} />
                <span>Reset Body</span>
              </button>
            </div>
          </div>

          <div className="tester-json-editor-wrapper">
            <textarea
              className={`tester-json-textarea ${jsonError ? 'has-error' : ''}`}
              rows={8}
              value={requestBody}
              onChange={(e) => handleBodyChange(e.target.value)}
              placeholder="{\n  // Enter JSON payload here\n}"
              spellCheck={false}
            />
            {jsonError && (
              <div className="tester-json-error-bar">
                <AlertCircle size={14} />
                <span>{jsonError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Headers Section */}
      <div className="tester-param-card">
        <div className="tester-card-header">
          <h4 className="tester-card-title">HTTP Headers</h4>
          <button
            type="button"
            className="tester-tool-btn"
            onClick={handleAddHeader}
          >
            <Plus size={13} />
            <span>Add Header</span>
          </button>
        </div>

        <div className="tester-headers-list">
          {customHeaders.map((header, idx) => (
            <div key={idx} className="tester-header-row">
              <input
                type="checkbox"
                className="tester-header-check"
                checked={header.enabled}
                onChange={(e) => handleHeaderChange(idx, 'enabled', e.target.checked)}
                title="Enable/Disable Header"
              />
              <input
                type="text"
                className="tester-text-input header-key"
                placeholder="Header-Name"
                value={header.key}
                onChange={(e) => handleHeaderChange(idx, 'key', e.target.value)}
              />
              <input
                type="text"
                className="tester-text-input header-val"
                placeholder="Value"
                value={header.value}
                onChange={(e) => handleHeaderChange(idx, 'value', e.target.value)}
              />
              <button
                type="button"
                className="tester-remove-btn"
                onClick={() => handleRemoveHeader(idx)}
                aria-label="Remove header"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Bottom Action */}
      <div className="tester-bottom-actions">
        <button
          type="button"
          className="tester-reset-all-btn"
          onClick={handleReset}
        >
          <RotateCcw size={14} />
          <span>Reset All Fields</span>
        </button>

        <button
          type="submit"
          className="tester-send-btn large"
          disabled={isLoading || !!jsonError}
        >
          {isLoading ? (
            <>
              <span className="spinner-mini"></span>
              <span>Executing API Request...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>Execute {endpoint.method} Request</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
