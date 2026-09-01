import { ApiEndpoint } from '../types/api';
import { getApiBaseUrl, buildInterpolatedPath, buildQueryString } from './api-client';

export interface CodeGeneratorOptions {
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  customHeaders?: Record<string, string>;
  body?: string | Record<string, any>;
  bearerToken?: string | null;
  baseUrl?: string;
}

/**
 * Extract initial path params from endpoint parameter definition
 */
export function getDefaultPathParams(endpoint: ApiEndpoint): Record<string, string> {
  const result: Record<string, string> = {};
  endpoint.parameters
    .filter((p) => p.location === 'path')
    .forEach((p) => {
      result[p.name] = p.example !== undefined ? String(p.example) : (p.defaultValue !== undefined ? String(p.defaultValue) : `sample_${p.name}`);
    });
  return result;
}

/**
 * Extract initial query params from endpoint parameter definition
 */
export function getDefaultQueryParams(endpoint: ApiEndpoint): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  endpoint.parameters
    .filter((p) => p.location === 'query' && p.required)
    .forEach((p) => {
      if (p.example !== undefined) {
        result[p.name] = p.example;
      } else if (p.defaultValue !== undefined) {
        result[p.name] = p.defaultValue;
      }
    });
  return result;
}

/**
 * Generate cURL command
 */
export function generateCurlSnippet(endpoint: ApiEndpoint, options: CodeGeneratorOptions = {}): string {
  const baseUrl = getApiBaseUrl(options.baseUrl);
  const pathParams = options.pathParams || getDefaultPathParams(endpoint);
  const queryParams = options.queryParams || getDefaultQueryParams(endpoint);
  
  const resolvedPath = buildInterpolatedPath(endpoint.path, pathParams);
  const queryString = buildQueryString(queryParams);
  const fullUrl = `${baseUrl}${resolvedPath}${queryString}`;

  const token = options.bearerToken || (endpoint.authRequired ? 'YOUR_BEARER_TOKEN' : null);
  const body = options.body !== undefined ? options.body : endpoint.defaultRequestBody;

  const lines: string[] = [];
  lines.push(`curl -X ${endpoint.method} "${fullUrl}" \\`);
  lines.push(`  -H "Accept: application/json" \\`);

  if (token) {
    lines.push(`  -H "Authorization: Bearer ${token}" \\`);
  }

  if (options.customHeaders) {
    Object.entries(options.customHeaders).forEach(([k, v]) => {
      lines.push(`  -H "${k}: ${v}" \\`);
    });
  }

  if (body && endpoint.method !== 'GET') {
    lines.push(`  -H "Content-Type: application/json" \\`);
    const jsonStr = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
    lines.push(`  -d '${jsonStr}'`);
  } else {
    const lastIdx = lines.length - 1;
    if (lines[lastIdx].endsWith(' \\')) {
      lines[lastIdx] = lines[lastIdx].substring(0, lines[lastIdx].length - 2);
    }
  }

  return lines.join('\n');
}

/**
 * Generate JavaScript / TypeScript native Fetch snippet
 */
export function generateFetchSnippet(endpoint: ApiEndpoint, options: CodeGeneratorOptions = {}): string {
  const baseUrl = getApiBaseUrl(options.baseUrl);
  const pathParams = options.pathParams || getDefaultPathParams(endpoint);
  const queryParams = options.queryParams || getDefaultQueryParams(endpoint);
  
  const resolvedPath = buildInterpolatedPath(endpoint.path, pathParams);
  const queryString = buildQueryString(queryParams);
  const fullUrl = `${baseUrl}${resolvedPath}${queryString}`;

  const token = options.bearerToken || (endpoint.authRequired ? 'YOUR_BEARER_TOKEN' : null);
  const body = options.body !== undefined ? options.body : endpoint.defaultRequestBody;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && endpoint.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  if (options.customHeaders) {
    Object.assign(headers, options.customHeaders);
  }

  const jsonBodyString = body && endpoint.method !== 'GET'
    ? (typeof body === 'string' ? body : JSON.stringify(body, null, 2))
    : null;

  return `// Execute ${endpoint.name} (${endpoint.method} ${endpoint.path})
async function executeApi() {
  const url = "${fullUrl}";
  const options = {
    method: "${endpoint.method}",
    headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n    ')}${jsonBodyString ? `,\n    body: JSON.stringify(${jsonBodyString.replace(/\n/g, '\n    ')})` : ''}
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
  }
}

executeApi();`;
}

/**
 * Generate Axios client snippet
 */
export function generateAxiosSnippet(endpoint: ApiEndpoint, options: CodeGeneratorOptions = {}): string {
  const baseUrl = getApiBaseUrl(options.baseUrl);
  const pathParams = options.pathParams || getDefaultPathParams(endpoint);
  const queryParams = options.queryParams || getDefaultQueryParams(endpoint);
  
  const resolvedPath = buildInterpolatedPath(endpoint.path, pathParams);
  const queryString = buildQueryString(queryParams);
  const fullUrl = `${baseUrl}${resolvedPath}${queryString}`;

  const token = options.bearerToken || (endpoint.authRequired ? 'YOUR_BEARER_TOKEN' : null);
  const body = options.body !== undefined ? options.body : endpoint.defaultRequestBody;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && endpoint.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  if (options.customHeaders) {
    Object.assign(headers, options.customHeaders);
  }

  const jsonBodyString = body && endpoint.method !== 'GET'
    ? (typeof body === 'string' ? body : JSON.stringify(body, null, 2))
    : null;

  return `import axios from 'axios';

// Execute ${endpoint.name} (${endpoint.method} ${endpoint.path})
async function executeApi() {
  try {
    const response = await axios({
      method: '${endpoint.method.toLowerCase()}',
      url: '${fullUrl}',
      headers: ${JSON.stringify(headers, null, 6).replace(/\n/g, '\n      ')}${jsonBodyString ? `,\n      data: ${jsonBodyString.replace(/\n/g, '\n      ')}` : ''}
    });

    console.log("Status:", response.status);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data);
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}

executeApi();`;
}
