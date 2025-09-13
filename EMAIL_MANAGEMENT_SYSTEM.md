# Email Management System

A comprehensive email management solution for super admins to create, monitor, and manage bulk email campaigns with full control over scheduling, templates, and recipient management.

## Features

### 🎯 Core Functionality

- **Bulk Email Campaigns**: Schedule and manage large-scale email campaigns
- **Template System**: Pre-built templates (Welcome, Newsletter, Notification) with customization
- **Recipient Management**: Add individual recipients or bulk import via CSV/text
- **Campaign Monitoring**: Real-time status tracking and progress monitoring
- **Batch Processing**: Automatic batch processing for large recipient lists
- **Retry Mechanism**: Automatic retry for failed email batches

### 📊 Analytics & Monitoring

- **Real-time Statistics**: Comprehensive email metrics and performance data
- **Campaign Status Tracking**: Monitor campaign progress and batch status
- **Success Rate Analysis**: Track delivery success rates and failure reasons
- **Monthly Trends**: Visualize email sending patterns over time

### 🔧 Testing & Configuration

- **Service Health Monitoring**: Check email service connectivity and status
- **Configuration Testing**: Verify email provider settings
- **Test Email Sending**: Send immediate test emails for validation
- **Template Preview**: Preview emails before sending

## API Endpoints

### Base URL: `/email`

All endpoints require authentication and super admin role.

| Endpoint                             | Method | Description                      |
| ------------------------------------ | ------ | -------------------------------- |
| `/email/schedule-bulk`               | POST   | Schedule a bulk email campaign   |
| `/email/campaign/:campaignId`        | GET    | Get campaign status and details  |
| `/email/campaigns`                   | GET    | List all campaigns (paginated)   |
| `/email/campaign/:campaignId/cancel` | POST   | Cancel a scheduled campaign      |
| `/email/batch/:batchId/retry`        | POST   | Retry a failed email batch       |
| `/email/stats`                       | GET    | Get email statistics and metrics |
| `/email/test-configuration`          | POST   | Test email service configuration |
| `/email/templates`                   | GET    | Get available email templates    |
| `/email/health`                      | GET    | Check email service health       |
| `/email/send-immediate`              | POST   | Send immediate test email        |

## Frontend Implementation

### Pages Structure

```
src/app/(admin)/admin/email/
├── campaigns/
│   └── page.tsx          # Campaign list and management (includes create form)
├── stats/
│   └── page.tsx          # Email statistics and analytics
├── test/
│   └── page.tsx          # Test configuration and send test emails
└── today-schedule/
    └── page.tsx          # Today's email schedule
```

### Key Components

#### 1. Campaign Management (`/admin/email/campaigns`)

- **Features**:
  - Paginated list of all email campaigns
  - Real-time status monitoring
  - Campaign details modal with batch information
  - Cancel scheduled campaigns
  - Retry failed batches
  - Export campaign data

#### 2. Create Campaign (`/admin/email/campaigns`)

- **Features**:
  - Template selection (Welcome, Newsletter, Notification)
  - Dynamic template data configuration
  - Individual recipient management
  - Bulk recipient import with real-time parsing
  - Duplicate email removal
  - Test email sending functionality
  - Advanced scheduling options with completion estimation
  - Real-time campaign summary
  - Form validation and error handling

#### 3. Email Statistics (`/admin/email/stats`)

- **Features**:
  - Key metrics dashboard (total campaigns, emails sent, success rate)
  - Campaign status distribution charts
  - Monthly email trends visualization
  - Performance metrics breakdown
  - Real-time data refresh

#### 4. Test Configuration (`/admin/email/test`)

- **Features**:
  - Email service health monitoring
  - Configuration testing
  - Immediate test email sending
  - Template preview functionality
  - Test result history

### Reusable Components

#### EmailTemplatePreview

```tsx
<EmailTemplatePreview
  templateName={EmailTemplate.WELCOME}
  templateData={{ companyName: "Example Corp" }}
  subject="Welcome to our platform"
  recipientName="John Doe"
/>
```

#### useEmailManagement Hook

```tsx
const {
  loading,
  scheduleBulkEmail,
  getCampaigns,
  cancelCampaign,
  retryBatch,
  getEmailStats,
  getTemplates,
  testConfiguration,
  checkHealth,
  sendTestEmail,
} = useEmailManagement();
```

## Data Models

### Email Types (`src/types/email.ts`)

```typescript
enum EmailTemplate {
  WELCOME = "welcome",
  NEWSLETTER = "newsletter",
  NOTIFICATION = "notification",
}

enum CampaignStatus {
  SCHEDULED = "scheduled",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

interface EmailRecipient {
  email: string;
  name?: string;
  context?: Record<string, any>;
}

interface EmailCampaign {
  campaignId: string;
  subject: string;
  templateName: EmailTemplate;
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
```

## Template System

### Available Templates

#### 1. Welcome Template

- **Purpose**: Welcome new users to the platform
- **Dynamic Data**: `recipientName`, `companyName`, `companyDescription`
- **Features**: Personalized greeting, company information, call-to-action

#### 2. Newsletter Template

- **Purpose**: Send regular updates and announcements
- **Dynamic Data**: `newsletterTitle`, `featuredArticle`, `updates`, `stats`
- **Features**: Featured content, update lists, statistics display

#### 3. Notification Template

- **Purpose**: Send important notifications and alerts
- **Dynamic Data**: `notificationTitle`, `message`, `details`, `actionUrl`
- **Features**: Alert styling, detailed information, action buttons

### Template Customization

Templates support dynamic data injection through the `templateData` field:

```json
{
  "companyName": "Example Corp",
  "companyDescription": "Leading technology solutions",
  "recipientName": "John Doe",
  "featuredArticle": {
    "title": "New Feature Release",
    "excerpt": "Check out our latest updates"
  }
}
```

## Security & Access Control

### Role-Based Access

- **Access Level**: Super Admin only
- **Authentication**: Required for all endpoints
- **Authorization**: Role verification on each request

### Input Validation

- Email address validation
- Template data sanitization
- Recipient list validation
- Rate limiting for API calls

## Error Handling

### Frontend Error Management

- Toast notifications for user feedback
- Form validation with detailed error messages
- Graceful error handling for API failures
- Loading states and retry mechanisms

### API Error Responses

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## Usage Examples

### Creating a Campaign

1. **Navigate to Email Management** → **Create Campaign**
2. **Select Template**: Choose from Welcome, Newsletter, or Notification
3. **Configure Campaign**:
   - Enter subject line
   - Add template data (JSON format)
4. **Add Recipients**:
   - Individual: Add one by one
   - Bulk: Import CSV or paste email list
5. **Preview**: Use template preview to see final email
6. **Schedule**: Submit to schedule the campaign

### Monitoring Campaigns

1. **Navigate to Email Management** → **Campaigns**
2. **View Status**: Check real-time campaign status
3. **Monitor Progress**: Track batch completion
4. **Manage Issues**: Retry failed batches or cancel campaigns
5. **Export Data**: Download campaign results

### Testing Configuration

1. **Navigate to Email Management** → **Test Configuration**
2. **Check Health**: Verify service connectivity
3. **Test Configuration**: Validate email provider settings
4. **Send Test Email**: Send immediate test email
5. **Review Results**: Check delivery status and logs

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

### API Base URL

The system expects the email management API to be available at the configured base URL with the `/email` prefix.

## Dependencies

### Required Packages

- `react-hook-form`: Form management
- `yup`: Form validation
- `@hookform/resolvers`: Yup integration
- `recharts`: Data visualization
- `framer-motion`: Animations
- `react-toastify`: Notifications
- `react-icons`: Icons

### Development Dependencies

- `@types/react`: TypeScript support
- `tailwindcss`: Styling
- `typescript`: Type safety

## Future Enhancements

### Planned Features

- **Advanced Scheduling**: Time zone support, recurring campaigns
- **A/B Testing**: Campaign variant testing
- **Email Analytics**: Open rates, click tracking
- **Template Editor**: Visual template builder
- **Segmentation**: Advanced recipient filtering
- **Automation**: Trigger-based email campaigns

### Integration Possibilities

- **CRM Integration**: Sync with customer data
- **Marketing Tools**: Connect with external platforms
- **Analytics Platforms**: Enhanced reporting
- **Webhook Support**: Real-time notifications

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.

---

**Note**: This email management system is designed for super admin use only and includes comprehensive security measures to protect sensitive data and prevent abuse.
