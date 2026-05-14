export interface ActionResponse {
  id?: string;
  message: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
}
