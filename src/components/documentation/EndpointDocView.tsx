import React, { useState } from 'react';
import { ApiEndpoint, ApiModule } from '../../types/api';
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
  Zap
} from 'lucide-react';

interface EndpointDocViewProps {
  endpoint: ApiEndpoint;
  module: ApiModule;
}

export const EndpointDocView: React.FC<EndpointDocViewProps> = ({
  endpoint,
  module
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'tester'>('docs');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(endpoint.path);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendPlaceholder = (data: any) => {
    console.log('Sending request (UI form connected):', data);
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

      {/* Tab Content: Interactive API Tester Form */}
      {activeTab === 'tester' && (
        <div className="tester-tab-content">
          <ApiTesterForm
            endpoint={endpoint}
            onSendRequest={handleSendPlaceholder}
            isLoading={false}
          />
        </div>
      )}
    </div>
  );
};
