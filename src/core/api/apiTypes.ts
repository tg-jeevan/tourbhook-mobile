export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

export function apiResponseSuccess<T>(
  data: T,
  message?: string,
  statusCode: number = 200,
): ApiResponse<T> {
  return { success: true, data, message, statusCode };
}

export function apiResponseError<T>(message: string, statusCode?: number): ApiResponse<T> {
  return { success: false, message, statusCode };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export function parsePaginatedResponse<T>(
  json: Record<string, unknown>,
  fromJsonT: (item: Record<string, unknown>) => T,
): PaginatedResponse<T> {
  const itemsList = Array.isArray(json.items)
    ? (json.items as Record<string, unknown>[]).map(fromJsonT)
    : [];

  return {
    items: itemsList,
    total: typeof json.total === 'number' ? json.total : 0,
    page: typeof json.page === 'number' ? json.page : 1,
    perPage: typeof json.perPage === 'number' ? json.perPage : 10,
    hasMore: typeof json.hasMore === 'boolean' ? json.hasMore : false,
  };
}