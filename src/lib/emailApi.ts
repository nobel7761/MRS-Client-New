import client from "./api";
import {
  CreateBulkEmailRequest,
  CreateBulkEmailResponse,
  CampaignStatusResponse,
  PaginatedCampaignsResponse,
  SimplePaginatedCampaignsResponse,
  SimpleCampaign,
  EmailStats,
  TestEmailRequest,
  TestEmailResponse,
  EmailTemplatesResponse,
  HealthCheckResponse,
  Campaign,
  TodaySchedule,
  CampaignFilters,
  CampaignCreationRequest,
  CampaignCreationResponse,
  DailyTrendsResponse,
} from "@/types/email";

export const emailApi = {
  // Create Campaign (New comprehensive method)
  createCampaign: async (
    data: CampaignCreationRequest
  ): Promise<CampaignCreationResponse> => {
    console.log("Creating campaign:", data);
    const response = await client.post<CampaignCreationResponse>(
      "/email/campaigns",
      data
    );
    return response.data;
  },

  // Schedule Bulk Email Campaign
  scheduleBulkEmail: async (
    data: CreateBulkEmailRequest
  ): Promise<CreateBulkEmailResponse> => {
    console.log("data", data);
    const response = await client.post<CreateBulkEmailResponse>(
      "/email/schedule-bulk",
      data
    );
    return response.data;
  },

  // Get Campaign Status
  getCampaignStatus: async (
    campaignId: string
  ): Promise<CampaignStatusResponse> => {
    const response = await client.get<CampaignStatusResponse>(
      `/email/campaign/${campaignId}`
    );
    return response.data;
  },

  // Get All Campaigns (Paginated) - Updated for new API
  getCampaigns: async (
    page: number = 1,
    limit: number = 10,
    filters?: CampaignFilters
  ): Promise<SimplePaginatedCampaignsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) params.append("status", filters.status);
    if (filters?.template) params.append("template", filters.template);
    if (filters?.dateFrom)
      params.append("dateFrom", filters.dateFrom.toISOString());
    if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());
    if (filters?.search) params.append("search", filters.search);

    const response = await client.get<SimplePaginatedCampaignsResponse>(
      `/email/campaigns?${params.toString()}`
    );
    return response.data;
  },

  // Get Detailed Campaign Info with Daily Schedule
  getCampaignDetailed: async (campaignId: string): Promise<Campaign> => {
    const response = await client.get<Campaign>(
      `/email/campaign/${campaignId}/detailed`
    );
    return response.data;
  },

  // Get Today's Schedule
  getTodaySchedule: async (): Promise<TodaySchedule> => {
    const response = await client.get<TodaySchedule>("/email/schedule/today");
    return response.data;
  },

  // Cancel Campaign
  cancelCampaign: async (
    campaignId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await client.post<{ success: boolean; message: string }>(
      `/email/campaign/${campaignId}/cancel`
    );
    return response.data;
  },

  // Retry Failed Batch
  retryBatch: async (
    batchId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await client.post<{ success: boolean; message: string }>(
      `/email/batch/${batchId}/retry`
    );
    return response.data;
  },

  // Get Email Statistics
  getEmailStats: async (): Promise<EmailStats> => {
    const response = await client.get<EmailStats>("/email/statistics");
    return response.data;
  },

  // Get Daily Email Trends
  getDailyTrends: async (days: number = 30): Promise<DailyTrendsResponse> => {
    const response = await client.get<DailyTrendsResponse>(
      `/email/statistics/daily-trends?days=${days}`
    );
    return response.data;
  },

  // Test Email Configuration
  testConfiguration: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await client.post<{ success: boolean; message: string }>(
      "/email/test-configuration"
    );
    return response.data;
  },

  // Get Available Templates
  getTemplates: async (): Promise<EmailTemplatesResponse> => {
    const response = await client.get<EmailTemplatesResponse>(
      "/email/templates"
    );
    return response.data;
  },

  // Health Check
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await client.get<HealthCheckResponse>("/email/health");
    return response.data;
  },

  // Send Immediate Email (Testing)
  sendImmediateEmail: async (
    data: TestEmailRequest
  ): Promise<TestEmailResponse> => {
    const response = await client.post<TestEmailResponse>(
      "/email/send-immediate",
      data
    );
    return response.data;
  },

  // Test Bulk Email Immediate
  testBulkImmediate: async (
    data: CreateBulkEmailRequest
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    const response = await client.post<{
      success: boolean;
      message: string;
      error?: string;
    }>("/email/test-bulk-immediate", data);
    return response.data;
  },

  // Campaign Management Actions
  forceScheduleCampaign: async (
    campaignId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await client.put<{ success: boolean; message: string }>(
      `/email/campaigns/${campaignId}/force-schedule`
    );
    return response.data;
  },

  activateCampaign: async (
    campaignId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await client.put<{ success: boolean; message: string }>(
      `/email/campaigns/${campaignId}/activate`
    );
    return response.data;
  },

  pauseCampaign: async (
    campaignId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await client.put<{ success: boolean; message: string }>(
      `/email/campaigns/${campaignId}/pause`
    );
    return response.data;
  },

  // Check and schedule all pending campaigns
  checkPendingCampaigns: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await client.post<{ success: boolean; message: string }>(
      "/email/campaigns/check-pending"
    );
    return response.data;
  },
};
