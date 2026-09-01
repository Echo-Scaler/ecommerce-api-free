import React, { useState } from 'react';
import { ApiEndpoint } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../../lib/code-generator';
import { CodeBlock } from '../common/CodeBlock';
import { Code, Terminal, FileCode, ShieldCheck } from 'lucide-react';

interface CodeExamplesDocProps {
  endpoint: ApiEndpoint;
}

export const CodeExamplesDoc: React.FC<CodeExamplesDocProps> = ({ endpoint }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'fetch' | 'axios' | 'curl'>('curl');
  const [includeToken, setIncludeToken] = useState(true);

  const activeBearer = includeToken && token ? token : (endpoint.authRequired ? 'YOUR_BEARER_TOKEN' : null);

  const curlCode = generateCurlSnippet(endpoint, { bearerToken: activeBearer });
  const fetchCode = generateFetchSnippet(endpoint, { bearerToken: activeBearer });
  const axiosCode = generateAxiosSnippet(endpoint, { bearerToken: activeBearer });

  return (
    <div className="doc-section">
      <div className="doc-section-header-row">
        <div className="code-examples-heading-group">
          <Code size={18} className="text-blue-400" />
          <h2 className="doc-section-heading">Code Examples</h2>
        </div>

        {endpoint.authRequired && token && (
          <label className="code-include-token-toggle">
            <input
              type="checkbox"
              checked={includeToken}
              onChange={(e) => setIncludeToken(e.target.checked)}
            />
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Include Active Token</span>
          </label>
        )}
      </div>

      <div className="code-tabs-bar">
        <button
          type="button"
          className={`code-tab-btn ${activeTab === 'curl' ? 'active' : ''}`}
          onClick={() => setActiveTab('curl')}
        >
          <Terminal size={14} />
          <span>cURL</span>
        </button>

        <button
          type="button"
          className={`code-tab-btn ${activeTab === 'fetch' ? 'active' : ''}`}
          onClick={() => setActiveTab('fetch')}
        >
          <FileCode size={14} />
          <span>Fetch (JS / TS)</span>
        </button>

        <button
          type="button"
          className={`code-tab-btn ${activeTab === 'axios' ? 'active' : ''}`}
          onClick={() => setActiveTab('axios')}
        >
          <Code size={14} />
          <span>Axios</span>
        </button>
      </div>

      <div className="code-snippet-body">
        {activeTab === 'curl' && (
          <CodeBlock code={curlCode} language="bash" />
        )}
        {activeTab === 'fetch' && (
          <CodeBlock code={fetchCode} language="typescript" />
        )}
        {activeTab === 'axios' && (
          <CodeBlock code={axiosCode} language="typescript" />
        )}
      </div>
    </div>
  );
};
