export interface ParsedApiError {
  type: '400' | '401' | '403' | '404' | '422' | '500' | 'network' | 'timeout' | 'other';
  title: string;
  message: string;
  details?: string;
  validationErrors?: Array<{ field: string; message: string }>;
  suggestedFix: string;
  actionType?: 'open_auth' | 'check_params' | 'check_network' | 'format_json';
}

export function parseApiError(
  status: number,
  statusText: string,
  data: any,
  isNetworkError: boolean = false,
  isTimeout: boolean = false
): ParsedApiError {
  if (isTimeout) {
    return {
      type: 'timeout',
      title: 'Request Timeout (Gateway Timeout)',
      message: 'The request took too long to complete and timed out before receiving a server response.',
      details: 'The client aborted the connection after the timeout deadline was exceeded.',
      suggestedFix: 'Check if the backend server is under heavy load or increase the request timeout limit.',
      actionType: 'check_network'
    };
  }

  if (isNetworkError || status === 0) {
    return {
      type: 'network',
      title: 'Network / Connection Error',
      message: 'Failed to reach the API server. This is commonly caused by CORS restrictions, offline server, or DNS resolution issues.',
      details: 'The browser fetch request failed at the network transport layer.',
      suggestedFix: 'Ensure your backend server is running and that CORS headers (Access-Control-Allow-Origin: *) are properly configured.',
      actionType: 'check_network'
    };
  }

  // Extract message from response data if available
  let serverMessage = '';
  if (typeof data === 'string') {
    serverMessage = data;
  } else if (data && typeof data === 'object') {
    serverMessage = data.message || data.error || data.detail || JSON.stringify(data);
  }

  switch (status) {
    case 400:
      return {
        type: '400',
        title: '400 Bad Request',
        message: serverMessage || 'The server could not understand the request due to invalid syntax or malformed parameters.',
        details: 'The request body or URL parameters failed structural validation.',
        suggestedFix: 'Review the JSON request payload for syntax errors or check parameter types.',
        actionType: 'format_json'
      };

    case 401:
      return {
        type: '401',
        title: '401 Unauthorized',
        message: serverMessage || 'Authentication credentials are required or have expired.',
        details: 'No valid Bearer token found in the Authorization header.',
        suggestedFix: 'Click "Authorize" in the header to enter a valid Bearer JWT token.',
        actionType: 'open_auth'
      };

    case 403:
      return {
        type: '403',
        title: '403 Forbidden',
        message: serverMessage || 'You do not have the required permissions or roles to access this resource.',
        details: 'Your token is valid but lacks sufficient privileges (e.g. Admin role required).',
        suggestedFix: 'Ensure your account has the appropriate role (e.g. switch to Admin role token).',
        actionType: 'open_auth'
      };

    case 404:
      return {
        type: '404',
        title: '404 Not Found',
        message: serverMessage || 'The requested resource or endpoint path could not be found on the server.',
        details: 'Check if the resource ID exists or if the URL path contains a typo.',
        suggestedFix: 'Verify the path parameters (e.g. valid product ID or order ID) and target URL.',
        actionType: 'check_params'
      };

    case 422: {
      const valErrors: Array<{ field: string; message: string }> = [];
      if (data && typeof data === 'object' && Array.isArray(data.errors)) {
        data.errors.forEach((err: any) => {
          if (typeof err === 'object') {
            valErrors.push({
              field: err.field || err.param || 'field',
              message: err.message || err.msg || 'Invalid field value'
            });
          }
        });
      }

      return {
        type: '422',
        title: '422 Unprocessable Entity (Validation Error)',
        message: serverMessage || 'The request was well-formed but contains semantic validation errors.',
        details: 'One or more fields in the payload failed business validation rules.',
        validationErrors: valErrors.length > 0 ? valErrors : undefined,
        suggestedFix: 'Correct the invalid input fields listed below according to the parameter schema.',
        actionType: 'check_params'
      };
    }

    case 500:
    default:
      if (status >= 500) {
        return {
          type: '500',
          title: `500 Internal Server Error`,
          message: serverMessage || 'The server encountered an unexpected error and was unable to complete your request.',
          details: 'An unhandled exception or internal service failure occurred on the server.',
          suggestedFix: 'Check backend server error logs for stack traces and exception details.',
          actionType: 'check_network'
        };
      }

      return {
        type: 'other',
        title: `HTTP ${status} ${statusText}`,
        message: serverMessage || `Request completed with status ${status}`,
        details: 'Response returned non-2xx status code.',
        suggestedFix: 'Inspect the response body and headers for further diagnostic information.'
      };
  }
}
