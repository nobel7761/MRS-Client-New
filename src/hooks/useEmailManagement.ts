import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { emailApi } from "@/lib/emailApi";
import {
  TestEmailRequest,
  TestEmailResponse,
  EmailTemplatesResponse,
  HealthCheckResponse,
  EmailTemplateInfo,
} from "@/types/email";

export const useEmailManagement = () => {
  const [loading, setLoading] = useState(false);

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

  return {
    loading,
    getTemplates,
    testConfiguration,
    checkHealth,
    sendTestEmail,
  };
};
