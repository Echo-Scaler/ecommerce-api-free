import { HttpMethod, ApiResponseExecution, ApiEndpoint } from '../types/api';
import { API_MODULES } from '../data/api-modules';

export interface RequestOptions {
  path: string;
  method: HttpMethod;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: string | Record<string, any>;
  bearerToken?: string | null;
  endpointId?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

// Configurable API base URL resolution
export const getApiBaseUrl = (customBaseUrl?: string): string => {
  if (customBaseUrl && customBaseUrl.trim()) {
    return customBaseUrl.trim().replace(/\/+$/, '');
  }

  // Vite environment variable with safe fallback
  const envUrl = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_API_BASE_URL : undefined;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Default fallback
  return 'https://api.ecommerce.example.com';
};

/**
 * Replace path parameters like :id, :itemId, :productId with actual values
 */
export const buildInterpolatedPath = (pathTemplate: string, pathParams?: Record<string, string>): string => {
  if (!pathParams) return pathTemplate;

  let interpolated = pathTemplate;
  Object.entries(pathParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      interpolated = interpolated.replace(new RegExp(`:${key}\\b`, 'g'), encodeURIComponent(String(value)));
    }
  });
  return interpolated;
};

/**
 * Build URL query string from params object
 */
export const buildQueryString = (queryParams?: Record<string, string | number | boolean>): string => {
  if (!queryParams) return '';

  const validEntries = Object.entries(queryParams).filter(
    ([, val]) => val !== undefined && val !== null && val !== ''
  );

  if (validEntries.length === 0) return '';

  const params = new URLSearchParams();
  validEntries.forEach(([key, val]) => {
    params.append(key, String(val));
  });

  return `?${params.toString()}`;
};

/**
 * Centralized API Client executor supporting GET, POST, PUT, PATCH, DELETE with full error handling & timeout
 */
export const executeApiRequest = async (options: RequestOptions): Promise<ApiResponseExecution> => {
  const {
    path,
    method,
    pathParams = {},
    queryParams = {},
    headers = {},
    body,
    bearerToken,
    baseUrl: customBaseUrl,
    timeoutMs = 15000
  } = options;

  const baseUrl = getApiBaseUrl(customBaseUrl);
  const resolvedPath = buildInterpolatedPath(path, pathParams);
  const queryString = buildQueryString(queryParams);
  const fullUrl = `${baseUrl}${resolvedPath}${queryString}`;

  // Assemble Request Headers
  const requestHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...headers
  };

  if (bearerToken && bearerToken.trim()) {
    requestHeaders['Authorization'] = `Bearer ${bearerToken.trim()}`;
  }

  let formattedBody: string | undefined = undefined;
  if (body !== undefined && body !== null && method !== 'GET') {
    if (typeof body === 'string') {
      formattedBody = body;
    } else {
      formattedBody = JSON.stringify(body);
    }
    requestHeaders['Content-Type'] = 'application/json';
  }

  const startTime = performance.now();

  // Setup abort controller for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: formattedBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    // Extract response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    let data: any;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return {
      status: response.status,
      statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
      durationMs,
      headers: responseHeaders,
      data,
      timestamp: new Date().toISOString(),
      isError: !response.ok
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    const endTime = performance.now();

    if (error.name === 'AbortError') {
      return {
        status: 504,
        statusText: 'Gateway Timeout',
        durationMs: timeoutMs,
        headers: { 'content-type': 'application/json' },
        data: {
          success: false,
          statusCode: 504,
          error: 'Gateway Timeout',
          message: `Request exceeded timeout limit of ${timeoutMs}ms without response.`
        },
        timestamp: new Date().toISOString(),
        isError: true
      };
    }

    // When remote network is unreachable or sandbox simulation is active,
    // generate an authentic simulation response based on endpoint definition
    const simulatedDuration = Math.round((endTime - startTime) + (Math.random() * 80 + 120));
    return generateSimulatedResponse(options, simulatedDuration);
  }
};

/**
 * Intelligent simulation generator for interactive testing
 */
function generateSimulatedResponse(options: RequestOptions, durationMs: number): ApiResponseExecution {
  const { endpointId, method, path, bearerToken, body, pathParams } = options;

  // Find endpoint definition
  let matchedEndpoint: ApiEndpoint | undefined;
  for (const module of API_MODULES) {
    const found = module.endpoints.find((e) => e.id === endpointId || (e.method === method && e.path === path));
    if (found) {
      matchedEndpoint = found;
      break;
    }
  }

  // 1. Check 401 Unauthorized requirement
  if (matchedEndpoint?.authRequired && !bearerToken) {
    return {
      status: 401,
      statusText: 'Unauthorized',
      durationMs,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-powered-by': 'Antigravity-Ecommerce-API',
        'x-auth-guard': 'BearerRequired'
      },
      data: {
        success: false,
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or invalid Bearer authentication token in Authorization header.'
      },
      timestamp: new Date().toISOString(),
      isError: true
    };
  }

  // 2. Check 403 Forbidden simulation (if admin required but customer token used)
  if (matchedEndpoint?.roles?.includes('admin') && bearerToken && bearerToken.includes('cust_')) {
    return {
      status: 403,
      statusText: 'Forbidden',
      durationMs,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-powered-by': 'Antigravity-Ecommerce-API'
      },
      data: {
        success: false,
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden: Admin role privileges are required to access this endpoint.'
      },
      timestamp: new Date().toISOString(),
      isError: true
    };
  }

  // 3. Check 404 Not Found simulation (e.g. if path parameter is invalid / 'not-found' / 'invalid')
  if (pathParams && Object.values(pathParams).some((v) => v === 'not_found' || v === '404' || v === 'unknown')) {
    return {
      status: 404,
      statusText: 'Not Found',
      durationMs,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      data: {
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Resource with identifier was not found in catalog.`
      },
      timestamp: new Date().toISOString(),
      isError: true
    };
  }

  // 4. Check 400 Bad Request / 422 Validation Error
  let parsedBody: any = null;
  if (body) {
    try {
      parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      return {
        status: 400,
        statusText: 'Bad Request',
        durationMs,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        data: {
          success: false,
          statusCode: 400,
          error: 'Bad Request',
          message: 'Malformed JSON payload in request body.'
        },
        timestamp: new Date().toISOString(),
        isError: true
      };
    }
  }

  // Use the primary 200/201 response example from definition
  const successExample = matchedEndpoint?.responseExamples.find((ex) => ex.statusCode >= 200 && ex.statusCode < 300);
  const responseData = successExample ? JSON.parse(JSON.stringify(successExample.body)) : { success: true, message: 'Request executed successfully' };

  if (parsedBody && typeof responseData === 'object' && responseData.data) {
    if (typeof responseData.data === 'object') {
      responseData.data = {
        ...responseData.data,
        ...parsedBody,
        id: responseData.data.id || `gen_${Math.random().toString(36).substring(2, 9)}`,
        updated_at: new Date().toISOString()
      };
    }
  }

  const statusCode = successExample ? successExample.statusCode : (method === 'POST' ? 201 : 200);
  const statusText = successExample ? successExample.statusText : (statusCode === 201 ? 'Created' : 'OK');

  return {
    status: statusCode,
    statusText,
    durationMs,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-powered-by': 'Antigravity-Ecommerce-API',
      'x-response-time': `${durationMs}ms`,
      'x-ratelimit-remaining': '994'
    },
    data: responseData,
    timestamp: new Date().toISOString(),
    isError: false
  };
}
