export interface ParsedEndpoint {
  method: string;
  path: string;
  title: string;
  summary: string;
  description: string;
  parameters: OpenAPIParameter[];
  requestBody: OpenAPIRequestBody | undefined;
  responses: Record<string, OpenAPIResponse>;
}

export interface OpenAPIParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: OpenAPISchema;
}

export interface OpenAPIRequestBody {
  description?: string;
  content: Record<string, { schema: OpenAPISchema }>;
}

export interface OpenAPIResponse {
  description: string;
  content?: Record<string, { schema: OpenAPISchema }>;
}

export interface OpenAPISchema {
  type: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  [key: string]: any;
}

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    [key: string]: any;
  };
  paths: Record<string, PathItem>;
  [key: string]: any;
}

export interface PathItem {
  [method: string]: Operation | any;
}

export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
  [key: string]: any;
}