import React, { useState } from 'react';
import { ApiEndpoint, ApiModule } from '../../types/api';
import { MethodBadge } from '../common/MethodBadge';
import { ParameterTable } from './ParameterTable';
import { RequestBodyDoc } from './RequestBodyDoc';
import { ResponseExampleDoc } from './ResponseExampleDoc';
import { 
  Lock, 
  Unlock, 
  Tag, 
  Copy, 
  Check, 
  Layers, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface EndpointDocViewProps {
  endpoint: ApiEndpoint;
  module: ApiModule;
}

export const EndpointDocView: React.FC<EndpointDocViewProps> = ({
  endpoint,
  module
}) => {
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

      {/* Endpoint Hero Box */}
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
      </div>

      {/* Parameter Table Section */}
      <ParameterTable parameters={endpoint.parameters} />

      {/* Request Body Section */}
      <RequestBodyDoc 
        schema={endpoint.requestBodySchema} 
        defaultBody={endpoint.defaultRequestBody} 
      />

      {/* Response Examples Section */}
      <ResponseExampleDoc examples={endpoint.responseExamples} />
    </div>
  );
};
