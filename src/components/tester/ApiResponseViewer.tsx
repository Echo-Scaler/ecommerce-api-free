import React, { useState } from 'react';
import { ApiResponseExecution } from '../../types/api';
import { 
  Check, 
  Copy, 
  Clock, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Download,
  Terminal
} from 'lucide-react';

interface ApiResponseViewerProps {
  response: ApiResponseExecution | null;
  isLoading?: boolean;
}

export const ApiResponseViewer: React.FC<ApiResponseViewerProps> = ({
  response,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [copied, setCopied] = useState(false);

  // Loading State
  if (isLoading) {
    return (
      <div className="response-viewer-card loading-state">
        <div className="response-loading-spinner-wrapper">
          <div className="response-loading-spinner" />
          <div className="response-loading-title">Executing API Request...</div>
          <div className="response-loading-sub">Connecting to server and awaiting response payload</div>
        </div>
      </div>
    );
  }

  // Empty State (No request sent yet)
  if (!response) {
    return (
      <div className="response-viewer-card empty-state">
        <Terminal size={36} className="response-empty-icon" />
        <div className="response-empty-title">Response Viewer Ready</div>
        <div className="response-empty-sub">
          Click <strong>&ldquo;Send Request&rdquo;</strong> above to execute this endpoint and inspect live HTTP responses, status codes, latency, and payload headers.
        </div>
      </div>
    );
  }

  const jsonString = typeof response.data === 'string' 
    ? response.data 
    : JSON.stringify(response.data, null, 2);

  const payloadSizeKb = (new Blob([jsonString]).size / 1024).toFixed(2);
  const headerEntries = Object.entries(response.headers || {});

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy response JSON', e);
    }
  };

  const handleDownloadJson = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${response.status}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download JSON', e);
    }
  };

  const getStatusColorClass = (code: number) => {
    if (code >= 200 && code < 300) return 'status-2xx';
    if (code >= 400 && code < 500) return 'status-4xx';
    if (code >= 500) return 'status-5xx';
    return 'status-other';
  };

  return (
    <div className="response-viewer-card">
      {/* Response Top Status Header */}
      <div className="response-header-bar">
        <div className="response-status-left">
          <div className="response-badge-group">
            <span className={`response-status-badge ${getStatusColorClass(response.status)}`}>
              {response.isError ? (
                <AlertTriangle size={14} />
              ) : (
                <CheckCircle2 size={14} />
              )}
              <span>Status: {response.status} {response.statusText}</span>
            </span>

            <span className="response-latency-badge">
              <Clock size={13} />
              <span>Time: {response.durationMs} ms</span>
            </span>

            <span className="response-size-badge">
              <Layers size={13} />
              <span>Size: {payloadSizeKb} KB</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="response-actions-right">
          <button
            type="button"
            className="response-action-btn"
            onClick={handleCopyJson}
            title="Copy JSON Response to Clipboard"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="response-action-btn"
            onClick={handleDownloadJson}
            title="Download Response as .json File"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tab Selectors (Body vs Headers) */}
      <div className="response-tabs-header">
        <div className="response-tab-buttons">
          <button
            type="button"
            className={`response-view-tab ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            <span>Response Body</span>
            <span className="tab-pill-count font-mono">{response.status}</span>
          </button>
          <button
            type="button"
            className={`response-view-tab ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            <span>Headers</span>
            <span className="tab-pill-count font-mono">{headerEntries.length}</span>
          </button>
        </div>

        <div className="response-meta-timestamp font-mono">
          {new Date(response.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Tab: Response Body */}
      {activeTab === 'body' && (
        <div className="response-body-wrapper">
          {response.isError && (
            <div className="response-error-banner">
              <Info size={16} />
              <span>
                Server responded with HTTP {response.status} ({response.statusText}). Inspect payload details below.
              </span>
            </div>
          )}
          <pre className="response-json-pre">
            <code>{jsonString}</code>
          </pre>
        </div>
      )}

      {/* Tab: Response Headers */}
      {activeTab === 'headers' && (
        <div className="response-headers-wrapper">
          {headerEntries.length > 0 ? (
            <table className="response-headers-table">
              <thead>
                <tr>
                  <th>Header Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {headerEntries.map(([key, val]) => (
                  <tr key={key}>
                    <td>
                      <code className="header-key-code">{key}</code>
                    </td>
                    <td>
                      <code className="header-val-code">{val}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="response-empty-headers">No custom response headers returned.</div>
          )}
        </div>
      )}
    </div>
  );
};
