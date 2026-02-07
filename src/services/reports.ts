/**
 * Reports Service for Nexus Knowledge
 * Aligned to swagger v3 API paths
 */

import { apiClient } from '../lib/api-client';
import type {
  CreateReportRequest,
  ReportJobResponseDto,
  ReportListResponse,
  ReportListParams,
  ReportDetailDto,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/reports`;

export const reportsApi = {
  /** POST /reports — create report generation job */
  create: async (workspaceId: string, data: CreateReportRequest): Promise<ReportJobResponseDto> => {
    return apiClient.postRaw<ReportJobResponseDto>(getBaseUrl(workspaceId), data);
  },

  /** GET /reports — list generated reports */
  list: async (workspaceId: string, params: ReportListParams = {}): Promise<ReportListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.type) queryParams.set('type', params.type);
    if (params.status) queryParams.set('status', params.status);

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<ReportListResponse>(url);
  },

  /** GET /reports/jobs/{jobId} — poll job status */
  getJobStatus: async (workspaceId: string, jobId: string): Promise<ReportJobResponseDto> => {
    return apiClient.getRaw<ReportJobResponseDto>(`${getBaseUrl(workspaceId)}/jobs/${jobId}`);
  },

  /** GET /reports/{reportId} — get report detail with content */
  get: async (workspaceId: string, reportId: string): Promise<ReportDetailDto> => {
    return apiClient.getRaw<ReportDetailDto>(`${getBaseUrl(workspaceId)}/${reportId}`);
  },

  /** DELETE /reports/{reportId} — delete report */
  delete: async (workspaceId: string, reportId: string): Promise<void> => {
    await apiClient.deleteRaw(`${getBaseUrl(workspaceId)}/${reportId}`);
  },
};

export default reportsApi;
