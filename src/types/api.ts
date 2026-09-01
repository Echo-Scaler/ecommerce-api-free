export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ParamLocation = 'path' | 'query' | 'header' | 'body';

export interface ApiParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  location: ParamLocation;
  required: boolean;
  defaultValue?: string | number | boolean;
  description: string;
  example?: string | number | boolean;
}

export interface ApiHeader {
  key: string;
  value: string;
  description?: string;
  required?: boolean;
}

export interface ResponseExample {
  statusCode: number;
  statusText: string;
  description: string;
  body: Record<string, any> | Array<any>;
}

export interface ApiEndpoint {
  id: string;
  moduleId: string;
  name: string;
  summary: string;
  description: string;
  method: HttpMethod;
  path: string;
  authRequired: boolean;
  roles?: ('admin' | 'customer' | 'guest')[];
  parameters: ApiParam[];
  headers?: ApiHeader[];
  requestBodySchema?: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
      example?: any;
    }>;
  };
  defaultRequestBody?: Record<string, any>;
  responseExamples: ResponseExample[];
  tags: string[];
}

export interface ApiModule {
  id: string;
  name: string;
  iconName: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export interface ApiRequestExecution {
  endpointId: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  pathParams: Record<string, string>;
  body?: string;
  bearerToken?: string;
}

export interface ApiResponseExecution {
  status: number;
  statusText: string;
  durationMs: number;
  headers: Record<string, string>;
  data: any;
  timestamp: string;
  isError: boolean;
}

export interface AuthState {
  token: string | null;
  tokenType: 'Bearer';
  userEmail?: string;
  role?: 'admin' | 'customer' | 'guest';
}
