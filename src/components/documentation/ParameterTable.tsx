import React from 'react';
import { ApiParam } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';

interface ParameterTableProps {
  parameters: ApiParam[];
  title?: string;
}

export const ParameterTable: React.FC<ParameterTableProps> = ({ parameters, title }) => {
  const { isMyanmar } = useLanguage();

  if (parameters.length === 0) {
    return null;
  }

  const effectiveTitle = title || (isMyanmar ? 'ပါရာမီတာများ' : 'Parameters');

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
                <th>{isMyanmar ? 'အကွက်' : 'Field'}</th>
                <th>{isMyanmar ? 'အမျိုးအစား' : 'Type'}</th>
                <th>{isMyanmar ? 'မဖြစ်မနေ' : 'Required'}</th>
                <th>{isMyanmar ? 'ဖော်ပြချက်' : 'Description'}</th>
                <th>{isMyanmar ? 'နမူနာ' : 'Example'}</th>
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
                      <span className="param-required-badge">{isMyanmar ? 'မဖြစ်မနေ' : 'required'}</span>
                    ) : (
                      <span className="param-optional-badge">{isMyanmar ? 'ရွေးချယ်နိုင်' : 'optional'}</span>
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
      <h3 className="doc-section-heading">{effectiveTitle}</h3>
      {renderSection(pathParams, isMyanmar ? 'Path ပါရာမီတာများ' : 'Path Parameters')}
      {renderSection(queryParams, isMyanmar ? 'Query ပါရာမီတာများ' : 'Query Parameters')}
      {renderSection(headerParams, isMyanmar ? 'Header ပါရာမီတာများ' : 'Header Parameters')}
    </div>
  );
};

