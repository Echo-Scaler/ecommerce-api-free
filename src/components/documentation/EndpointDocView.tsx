import React, { useState, useEffect } from 'react';
import { ApiEndpoint, ApiModule, ApiResponseExecution } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import { executeApiRequest } from '../../lib/api-client';
import { MethodBadge } from '../common/MethodBadge';
import { ParameterTable } from './ParameterTable';
import { RequestBodyDoc } from './RequestBodyDoc';
import { ResponseExampleDoc } from './ResponseExampleDoc';
import { ApiTesterForm } from '../tester/ApiTesterForm';
import { 
  Lock, 
  Unlock, 
  Tag, 
  Copy, 
  Check, 
  Layers, 
  ChevronRight,
  ShieldAlert,
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EndpointDocViewProps {
  endpoint: ApiEndpoint;
  module: ApiModule;
}

export const EndpointDocView: React.FC<EndpointDocViewProps> = ({
  endpoint,
  module
}) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'docs' | 'tester'>('docs');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<ApiResponseExecution | null>(null);

  // Clear previous response when endpoint changes
  useEffect(() => {
    setLastResponse(null);
  }, [endpoint.id]);

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(endpoint.path);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteRequest = async (requestData: {
    method: ApiEndpoint['method'];
    path: string;
    pathParams: Record<string, string>;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
    body?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await executeApiRequest({
        path: requestData.path,
        method: requestData.method,
        pathParams: requestData.pathParams,
        queryParams: requestData.queryParams,
        headers: requestData.headers,
        body: requestData.body,
        bearerToken: token,
        endpointId: endpoint.id,
      });
      setLastResponse(response);
    } catch (error: any) {
      setLastResponse({
        status: 500,
        statusText: 'Internal Error',
        durationMs: 0,
        headers: {},
        data: { error: error?.message || 'Failed to execute request' },
        timestamp: new Date().toISOString(),
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="endpoint-doc-container">
      {/* Breadcrumb Header */}
      <div className="endpoint-breadcrumb">
        <div className="breadcrumb-item">
          <Layers size={14} />
          <span>{module.name}</span>
        </div>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <div className="breadcrumb-item active">
          <span>{endpoint.name}</span>
        </div>
      </div>

      {/* Endpoint Hero Card */}
      <div className="endpoint-hero-card">
        <div className="endpoint-header-top">
          <div className="endpoint-signature-row">
            <MethodBadge method={endpoint.method} size="md" />
            <span className="endpoint-path-text">{endpoint.path}</span>
            <button
              type="button"
              className="copy-path-btn"
              onClick={handleCopyPath}
              title="Copy endpoint path"
            >
              {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="endpoint-meta-badges">
            {endpoint.authRequired ? (
              <span className="auth-pill required">
                <Lock size={12} />
                <span>Bearer Auth Required</span>
              </span>
            ) : (
              <span className="auth-pill public">
                <Unlock size={12} />
                <span>Public Route</span>
              </span>
            )}

            {endpoint.roles && endpoint.roles.length > 0 && (
              <span className="role-pill">
                <ShieldAlert size={12} />
                <span>Roles: {endpoint.roles.join(', ')}</span>
              </span>
            )}

            {endpoint.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                <Tag size={11} />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        <h1 className="endpoint-title">{endpoint.name}</h1>
        <p className="endpoint-summary-text">{endpoint.summary}</p>
        <div className="endpoint-detailed-desc">{endpoint.description}</div>

        {/* View Mode Switcher Tabs */}
        <div className="endpoint-view-tabs">
          <button
            type="button"
            className={`view-tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <BookOpen size={16} />
            <span>Endpoint Documentation</span>
          </button>
          <button
            type="button"
            className={`view-tab-btn ${activeTab === 'tester' ? 'active' : ''}`}
            onClick={() => setActiveTab('tester')}
          >
            <Zap size={16} />
            <span>Interactive API Tester</span>
            {lastResponse && (
              <span className={`mini-status-dot ${lastResponse.isError ? 'error' : 'success'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content: Documentation */}
      {activeTab === 'docs' && (
        <div className="doc-tab-content">
          <ParameterTable parameters={endpoint.parameters} />
          <RequestBodyDoc 
            schema={endpoint.requestBodySchema} 
            defaultBody={endpoint.defaultRequestBody} 
          />
          <ResponseExampleDoc examples={endpoint.responseExamples} />
        </div>
      )}

      {/* Tab Content: Interactive API Tester Form & Live Connection */}
      {activeTab === 'tester' && (
        <div className="tester-tab-content">
          <ApiTesterForm
            endpoint={endpoint}
            onSendRequest={handleExecuteRequest}
            isLoading={isLoading}
          />

          {/* Quick Execution Status Callout */}
          {lastResponse && (
            <div className={`live-exec-status-box ${lastResponse.isError ? 'has-error' : 'has-success'}`}>
              <div className="live-exec-header">
                <div className="live-exec-title">
                  {lastResponse.isError ? (
                    <AlertCircle size={18} className="text-red-400" />
                  ) : (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  )}
                  <span className="live-exec-status-code font-mono">
                    HTTP {lastResponse.status} {lastResponse.statusText}
                  </span>
                </div>
                <div className="live-exec-meta">
                  <span className="live-exec-time">
                    <Clock size={13} />
                    <span>{lastResponse.durationMs} ms</span>
                  </span>
                  <span className="live-exec-timestamp font-mono">
                    {new Date(lastResponse.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
