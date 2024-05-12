export interface PagedResponse<T> {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  data: T[];
}
