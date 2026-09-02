import React, { useState } from 'react';
import { ResponseExample } from '../../types/api';
import { CodeBlock } from '../common/CodeBlock';
import { useLanguage } from '../../context/LanguageContext';

interface ResponseExampleDocProps {
  examples: ResponseExample[];
}

export const ResponseExampleDoc: React.FC<ResponseExampleDocProps> = ({ examples }) => {
  const { isMyanmar } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  if (!examples || examples.length === 0) {
    return null;
  }

  const selectedExample = examples[activeTab] || examples[0];
  const jsonString = JSON.stringify(selectedExample.body, null, 2);

  const getStatusColorClass = (code: number) => {
    if (code >= 200 && code < 300) return 'status-2xx';
    if (code >= 400 && code < 500) return 'status-4xx';
    if (code >= 500) return 'status-5xx';
    return 'status-other';
  };

  return (
    <div className="doc-section">
      <div className="doc-section-header-row">
        <h3 className="doc-section-heading">{isMyanmar ? 'တုံ့ပြန်မှု ရလဒ် နမူနာများ (Response Examples)' : 'Response Examples'}</h3>
        <span className="content-type-badge">application/json</span>
      </div>

      {/* Status Tabs */}
      <div className="response-tabs-bar">
        {examples.map((ex, idx) => (
          <button
            key={ex.statusCode}
            type="button"
            className={`response-tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className={`status-pill ${getStatusColorClass(ex.statusCode)}`}>
              {ex.statusCode}
            </span>
            <span className="status-text">{ex.statusText}</span>
          </button>
        ))}
      </div>

      {/* Response Description */}
      <div className="response-description-bar">
        <span className="response-desc-label">{isMyanmar ? 'အခြေအနေ သတ်မှတ်ချက်:' : 'Condition:'}</span>
        <span className="response-desc-text">{selectedExample.description}</span>
      </div>

      {/* Response JSON Code Block */}
      <CodeBlock 
        code={jsonString} 
        language="json" 
        title={isMyanmar ? `HTTP ${selectedExample.statusCode} တုံ့ပြန်မှု ရလဒ်` : `HTTP ${selectedExample.statusCode} Response Body`} 
      />
    </div>
  );
};

