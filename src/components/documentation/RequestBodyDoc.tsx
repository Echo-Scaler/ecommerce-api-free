import React from 'react';
import { CodeBlock } from '../common/CodeBlock';

interface RequestBodyDocProps {
  schema?: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
      example?: any;
    }>;
  };
  defaultBody?: Record<string, any>;
}

export const RequestBodyDoc: React.FC<RequestBodyDocProps> = ({ schema, defaultBody }) => {
  if (!schema && !defaultBody) {
    return null;
  }

  const jsonString = defaultBody ? JSON.stringify(defaultBody, null, 2) : '{}';

  return (
    <div className="doc-section">
      <div className="doc-section-header-row">
        <h3 className="doc-section-heading">Request Body</h3>
        <span className="content-type-badge">application/json</span>
      </div>

      {schema && (
        <div className="param-table-wrapper" style={{ marginBottom: '1rem' }}>
          <table className="param-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(schema.properties).map(([field, details]) => (
                <tr key={field}>
                  <td>
                    <code className="param-name-code">{field}</code>
                  </td>
                  <td>
                    <span className="param-type-badge">{details.type}</span>
                  </td>
                  <td>
                    {details.required ? (
                      <span className="param-required-badge">required</span>
                    ) : (
                      <span className="param-optional-badge">optional</span>
                    )}
                  </td>
                  <td className="param-desc-cell">{details.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="payload-example-container">
        <div className="payload-example-label">JSON Payload Example</div>
        <CodeBlock code={jsonString} language="json" title="Payload Schema Example" />
      </div>
    </div>
  );
};
