/**
 * Common Types for Nexus Knowledge
 */

export interface ApiError {
  message: string;
  code?: string;
  details?: { field: string; message: string }[];
  statusCode?: number;
}

export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  queuePosition?: number;
}

export interface DateRange {
  start: string;
  end: string;
}
