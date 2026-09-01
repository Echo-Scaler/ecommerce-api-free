import React from 'react';
import { ApiParam } from '../../types/api';

interface ParameterTableProps {
  parameters: ApiParam[];
  title?: string;
}

export const ParameterTable: React.FC<ParameterTableProps> = ({ parameters, title = 'Parameters' }) => {
  if (parameters.length === 0) {
    return null;
  }

  const pathParams = parameters.filter((p) => p.location === 'path');
  const queryParams = parameters.filter((p) => p.location === 'query');
  const headerParams = parameters.filter((p) => p.location === 'header');

  const renderSection = (items: ApiParam[], sectionName: string) => {
    if (items.length === 0) return null;

    return (
      <div className="param-section" key={sectionName}>
        <div className="param-section-title">{sectionName}</div>
        <div className="param-table-wrapper">
          <table className="param-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {items.map((param) => (
                <tr key={param.name}>
                  <td>
                    <code className="param-name-code">{param.name}</code>
                  </td>
                  <td>
                    <span className="param-type-badge">{param.type}</span>
                  </td>
                  <td>
                    {param.required ? (
                      <span className="param-required-badge">required</span>
                    ) : (
                      <span className="param-optional-badge">optional</span>
                    )}
                  </td>
                  <td className="param-desc-cell">{param.description}</td>
                  <td>
                    {param.example !== undefined ? (
                      <code className="param-example-code">{String(param.example)}</code>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="doc-section">
      <h3 className="doc-section-heading">{title}</h3>
      {renderSection(pathParams, 'Path Parameters')}
      {renderSection(queryParams, 'Query Parameters')}
      {renderSection(headerParams, 'Header Parameters')}
    </div>
  );
};
