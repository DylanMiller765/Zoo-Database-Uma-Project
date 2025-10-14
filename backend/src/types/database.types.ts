import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type QueryResult<T> = T & RowDataPacket;
export type QueryResults<T> = Array<T & RowDataPacket>;
export type MutationResult = ResultSetHeader;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
