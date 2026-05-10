export interface ActionResponse {
  id?: string;
  message: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
