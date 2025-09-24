import client from "./api";
import {
  TestEmailRequest,
  TestEmailResponse,
  EmailTemplatesResponse,
  HealthCheckResponse,
} from "@/types/email";

export const emailApi = {
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
};
