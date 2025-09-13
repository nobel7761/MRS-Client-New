export enum EmailTemplate {
  WELCOME = "welcome",
  NEWSLETTER = "newsletter",
  NOTIFICATION = "notification",
}

export enum CampaignStatus {
  SCHEDULED = "scheduled",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  COMPLETED_WITH_FAILURES = "completed_with_failures",
  CANCELLED = "cancelled",
}

export enum BatchStatus {
  SCHEDULED = "scheduled",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface EmailRecipient {
  email: string;
  name?: string;
  context?: Record<string, any>;
}

export interface RecipientDetail {
  email: string;
  name?: string;
  scheduledFor: Date;
  status: "scheduled" | "sent" | "failed";
  sentAt?: Date;
  error?: string;
}

export interface DailyScheduleItem {
  day: number;
  date: Date;
  batchNumber: number;
  recipientCount: number;
  recipients: Array<{
    email: string;
    name?: string;
    status: "scheduled" | "sent" | "failed";
  }>;
  status: "scheduled" | "completed" | "failed";
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  batchStatus: string;
  sentCount: number;
  failedCount: number;
  recipientDetails: RecipientDetail[];
}

export interface EmailBatch {
  batchId: string;
  totalBatches: number;
  batchNumber: number;
  scheduledFor: Date;
  recipientCount: number;
  status: BatchStatus;
}

export interface EmailCampaign {
  campaignId: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  totalRecipients: number;
  totalBatches: number;
  batches: EmailBatch[];
  status: CampaignStatus;
  createdAt: Date;
  scheduledFor?: Date;
  estimatedCompletionDate?: Date;
  completedAt?: Date;
}

// Enhanced Campaign with Daily Schedule
export interface Campaign {
  campaignId: string;
  subject: string;
  templateName: string;
  templateData?: any;
  status: CampaignStatus;
  totalRecipients: number;
  totalBatches: number;
  totalSent: number;
  totalFailed: number;
  totalPending: number;
  estimatedCompletionDate: Date;
  completedAt?: Date;
  createdAt: Date;
  currentDay: number;
  dailySchedule: DailyScheduleItem[];
  summary: {
    today: DailyScheduleItem | undefined;
    completed: DailyScheduleItem[];
    pending: DailyScheduleItem[];
    failed: DailyScheduleItem[];
  };
}

export interface TodaySchedule {
  date: Date;
  totalCampaigns: number;
  totalRecipients: number;
  campaigns: Array<{
    campaignId: string;
    subject: string;
    templateName: string;
    campaignStatus: string;
    batches: Array<{
      batchId: string;
      batchNumber: number;
      status: string;
      recipientCount: number;
      scheduledFor: Date;
      recipients: EmailRecipient[];
      recipientDetails: RecipientDetail[];
    }>;
    totalRecipients: number;
  }>;
}

export interface CreateBulkEmailRequest {
  recipients: EmailRecipient[];
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  immediate?: boolean;
}

export interface CreateBulkEmailResponse {
  campaignId: string;
  totalRecipients: number;
  totalBatches: number;
  batches: EmailBatch[];
  estimatedCompletionDate: Date;
}

export interface CampaignStatusResponse {
  campaign: EmailCampaign;
  progress: {
    totalBatches: number;
    completedBatches: number;
    failedBatches: number;
    processingBatches: number;
    percentage: number;
  };
}

export interface PaginatedCampaignsResponse {
  campaigns: EmailCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmailStats {
  totalCampaigns: number;
  activeCampaigns: number;
  emailsSentToday: number;
  failedToday: number;
  successRate: number;
  averageDeliveryTime: number;
  // Optional additional fields for extended statistics
  campaignsByStatus?: Record<CampaignStatus, number>;
  emailsSentByMonth?: Array<{
    month: string;
    count: number;
  }>;
  dailyStats?: Array<{
    date: string;
    emailsSent: number;
    emailsFailed: number;
    campaignsActive: number;
  }>;
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

// Daily Email Trends Response
export interface DailyTrend {
  date: string;
  emailsSent: number;
  emailsFailed: number;
}

export interface DailyTrendsResponse {
  trends: DailyTrend[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Campaign Filters
export interface CampaignFilters {
  status?: CampaignStatus;
  template?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// Campaign Creation Form Data
export interface CampaignFormData {
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  recipients: EmailRecipient[];
  immediate: boolean;
}

// New comprehensive campaign creation interface
export interface CampaignCreationRequest {
  name: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  recipients: Array<{
    email: string;
    firstName: string;
    lastName: string;
    hscPassingYear: number;
  }>;
  emailsPerDay: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CampaignCreationResponse {
  success: boolean;
  campaignId: string;
  message: string;
  totalRecipients: number;
  estimatedCompletionDate: string;
  dailySchedule: Array<{
    date: string;
    recipientCount: number;
    batchNumber: number;
  }>;
}

// Enhanced Campaign interface with name and notes
export interface EnhancedCampaign extends Campaign {
  name: string;
  notes?: string;
  startDate: string;
  endDate: string;
  emailsPerDay: number;
}

// Template Preview Data
export interface TemplatePreviewData {
  templateName: string;
  templateData?: Record<string, any>;
  sampleData?: Record<string, any>;
}

// New simplified campaign interface matching the API response
export interface SimpleCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  totalRecipients: number;
  emailsSent: number;
  emailsFailed: number;
  emailsScheduled: number;
}

// Updated paginated response interface for the new API
export interface SimplePaginatedCampaignsResponse {
  campaigns: SimpleCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Today's Schedule Response Interface
export interface TodayScheduleCampaign {
  campaignId: string;
  campaignName: string;
  emailsForToday: number;
  emailsForUpcoming: number;
  nextSendDate: Date;
  status: CampaignStatus;
}

export interface TodayScheduleResponse {
  campaigns: TodayScheduleCampaign[];
}
