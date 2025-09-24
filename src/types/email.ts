export enum EmailTemplate {
  WELCOME = "welcome",
  NEWSLETTER = "newsletter",
  NOTIFICATION = "notification",
}

export interface TestEmailRequest {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
}

export interface TestEmailResponse {
  success: boolean;
  message: string;
  error?: string;
  sentAt?: Date;
}

export interface EmailTemplateInfo {
  name: string;
  description: string;
  contextFields: string[];
}

export interface EmailTemplatesResponse {
  templates: EmailTemplateInfo[];
}

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  stats?: {
    campaigns?: {
      total: number;
      completed: number;
      pending: number;
    };
    batches?: {
      total: number;
      completed: number;
      pending: number;
    };
    emails?: {
      sent: number;
      failed: number;
    };
    agenda?: {
      totalJobs: number;
      runningJobs: number;
      failedJobs: number;
      pendingJobs: number;
    };
  };
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
