import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { emailApi } from "@/lib/emailApi";
import {
  CreateBulkEmailRequest,
  CreateBulkEmailResponse,
  EmailCampaign,
  PaginatedCampaignsResponse,
  SimplePaginatedCampaignsResponse,
  EmailStats,
  TestEmailRequest,
  TestEmailResponse,
  EmailTemplatesResponse,
  HealthCheckResponse,
  EmailTemplateInfo,
  Campaign,
  TodaySchedule,
  CampaignFilters,
  CampaignCreationRequest,
  CampaignCreationResponse,
} from "@/types/email";

export const useEmailManagement = () => {
  const [loading, setLoading] = useState(false);

  // Create new campaign
  const createCampaign = useCallback(
    async (
      data: CampaignCreationRequest
    ): Promise<CampaignCreationResponse | null> => {
      try {
        setLoading(true);
        const response = await emailApi.createCampaign(data);
        toast.success("Campaign created successfully!");
        return response;
      } catch (error) {
        toast.error("Failed to create campaign");
        console.error("Error creating campaign:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Schedule bulk email campaign
  const scheduleBulkEmail = useCallback(
    async (
      data: CreateBulkEmailRequest
    ): Promise<CreateBulkEmailResponse | null> => {
      try {
        setLoading(true);
        const response = await emailApi.scheduleBulkEmail(data);
        toast.success("Campaign scheduled successfully!");
        return response;
      } catch (error) {
        toast.error("Failed to schedule campaign");
        console.error("Error scheduling campaign:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get campaigns with pagination and filters - Updated for new API
  const getCampaigns = useCallback(
    async (
      page: number = 1,
      limit: number = 10,
      filters?: CampaignFilters
    ): Promise<SimplePaginatedCampaignsResponse | null> => {
      try {
        setLoading(true);
        const response = await emailApi.getCampaigns(page, limit, filters);
        return response;
      } catch (error) {
        toast.error("Failed to fetch campaigns");
        console.error("Error fetching campaigns:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get detailed campaign info
  const getCampaignDetailed = useCallback(
    async (campaignId: string): Promise<Campaign | null> => {
      try {
        setLoading(true);
        const response = await emailApi.getCampaignDetailed(campaignId);
        return response;
      } catch (error) {
        toast.error("Failed to fetch campaign details");
        console.error("Error fetching campaign details:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get today's schedule
  const getTodaySchedule =
    useCallback(async (): Promise<TodaySchedule | null> => {
      try {
        setLoading(true);
        const response = await emailApi.getTodaySchedule();
        return response;
      } catch (error) {
        toast.error("Failed to fetch today's schedule");
        console.error("Error fetching today's schedule:", error);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  // Cancel campaign
  const cancelCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await emailApi.cancelCampaign(campaignId);
        if (response.success) {
          toast.success("Campaign cancelled successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to cancel campaign");
          return false;
        }
      } catch (error) {
        toast.error("Failed to cancel campaign");
        console.error("Error cancelling campaign:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Retry failed batch
  const retryBatch = useCallback(async (batchId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await emailApi.retryBatch(batchId);
      if (response.success) {
        toast.success("Batch retry initiated successfully");
        return true;
      } else {
        toast.error(response.message || "Failed to retry batch");
        return false;
      }
    } catch (error) {
      toast.error("Failed to retry batch");
      console.error("Error retrying batch:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get email statistics
  const getEmailStats = useCallback(async (): Promise<EmailStats | null> => {
    try {
      setLoading(true);
      const response = await emailApi.getEmailStats();
      return response;
    } catch (error) {
      toast.error("Failed to fetch email statistics");
      console.error("Error fetching stats:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get available templates
  const getTemplates = useCallback(async (): Promise<
    EmailTemplateInfo[] | null
  > => {
    try {
      setLoading(true);
      const response: EmailTemplatesResponse = await emailApi.getTemplates();
      return response.templates;
    } catch (error) {
      toast.error("Failed to fetch templates");
      console.error("Error fetching templates:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Test email configuration
  const testConfiguration = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await emailApi.testConfiguration();
      if (response.success) {
        toast.success("Email configuration test passed!");
        return true;
      } else {
        toast.error(response.message || "Email configuration test failed");
        return false;
      }
    } catch (error) {
      toast.error("Failed to test email configuration");
      console.error("Error testing configuration:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check email service health
  const checkHealth =
    useCallback(async (): Promise<HealthCheckResponse | null> => {
      try {
        setLoading(true);
        const response = await emailApi.healthCheck();
        return response;
      } catch (error) {
        toast.error("Failed to check email service health");
        console.error("Error checking health:", error);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  // Send immediate test email
  const sendTestEmail = useCallback(
    async (data: TestEmailRequest): Promise<TestEmailResponse | null> => {
      try {
        setLoading(true);
        const response = await emailApi.sendImmediateEmail(data);
        if (response.success) {
          toast.success("Test email sent successfully!");
        } else {
          toast.error(response.message || "Failed to send test email");
        }
        return response;
      } catch (error) {
        toast.error("Failed to send test email");
        console.error("Error sending test email:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Test bulk email immediate
  const testBulkImmediate = useCallback(
    async (data: CreateBulkEmailRequest): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await emailApi.testBulkImmediate(data);
        if (response.success) {
          toast.success("Bulk test email sent successfully!");
          return true;
        } else {
          toast.error(response.message || "Failed to send bulk test email");
          return false;
        }
      } catch (error) {
        toast.error("Failed to send bulk test email");
        console.error("Error sending bulk test email:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Campaign Management Actions
  const forceScheduleCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await emailApi.forceScheduleCampaign(campaignId);
        if (response.success) {
          toast.success("Campaign scheduled successfully!");
          return true;
        } else {
          toast.error(response.message || "Failed to schedule campaign");
          return false;
        }
      } catch (error) {
        toast.error("Failed to schedule campaign");
        console.error("Error scheduling campaign:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const activateCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await emailApi.activateCampaign(campaignId);
        if (response.success) {
          toast.success("Campaign activated successfully!");
          return true;
        } else {
          toast.error(response.message || "Failed to activate campaign");
          return false;
        }
      } catch (error) {
        toast.error("Failed to activate campaign");
        console.error("Error activating campaign:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const pauseCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await emailApi.pauseCampaign(campaignId);
        if (response.success) {
          toast.success("Campaign paused successfully!");
          return true;
        } else {
          toast.error(response.message || "Failed to pause campaign");
          return false;
        }
      } catch (error) {
        toast.error("Failed to pause campaign");
        console.error("Error pausing campaign:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkPendingCampaigns = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await emailApi.checkPendingCampaigns();
      if (response.success) {
        toast.success("Pending campaigns checked and scheduled!");
        return true;
      } else {
        toast.error(response.message || "Failed to check pending campaigns");
        return false;
      }
    } catch (error) {
      toast.error("Failed to check pending campaigns");
      console.error("Error checking pending campaigns:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    createCampaign,
    scheduleBulkEmail,
    getCampaigns,
    getCampaignDetailed,
    getTodaySchedule,
    cancelCampaign,
    retryBatch,
    getEmailStats,
    getTemplates,
    testConfiguration,
    checkHealth,
    sendTestEmail,
    testBulkImmediate,
    forceScheduleCampaign,
    activateCampaign,
    pauseCampaign,
    checkPendingCampaigns,
  };
};
