# Email Campaign Management System

A comprehensive email campaign management system for super admins that respects daily email limits (500 emails/day) and provides detailed tracking of which recipients receive emails on which days.

## 🚀 Features

### Core Features

1. **Campaign Dashboard**

   - View all email campaigns with status, progress, and completion dates
   - Create new campaign button
   - Quick stats (total campaigns, active campaigns, emails sent today)
   - Search and filter campaigns by status, template, and date range
   - Real-time progress indicators

2. **Campaign Creation Form**

   - Bulk email input (comma/line separated)
   - Individual recipient addition with name and email
   - Recipient validation and duplicate removal
   - Template selection (welcome, newsletter, notification)
   - Template preview with sample data
   - Custom template data (JSON editor for dynamic content)
   - Scheduling options with daily limit warnings
   - Estimated completion date display

3. **Campaign Details Page**

   - Campaign overview with metadata
   - Overall progress bar and statistics
   - Daily schedule calendar view
   - Visual calendar showing scheduled days
   - Daily breakdown with recipient counts
   - Click to view detailed recipient list for each day
   - Status indicators (completed, today, future, failed)
   - Complete recipient list with search/filter
   - Export recipient list functionality

4. **Today's Schedule Page**

   - Overview of all emails scheduled for today
   - Campaign-wise breakdown
   - Real-time status updates
   - All recipients scheduled for today
   - Export functionality

5. **Email Statistics Dashboard**
   - Overall statistics and performance metrics
   - Charts and graphs for trends
   - Daily sending trends
   - Campaign performance analysis
   - Success/failure rates

### Key Features

- **Daily Limit Enforcement**: Respects 500 emails/day limit with visual warnings
- **Real-time Updates**: Live status updates and progress tracking
- **Template System**: Pre-built templates with preview functionality
- **Recipient Management**: Bulk import, validation, and duplicate removal
- **Export Functionality**: CSV export for recipient lists and reports
- **Search & Filter**: Advanced filtering and search capabilities
- **Responsive Design**: Mobile-friendly interface
- **Role-based Access**: Super admin only access

## 📁 Project Structure

```
src/
├── app/(admin)/admin/email/
│   ├── campaigns/
│   │   └── page.tsx                 # Main campaigns page
│   ├── today-schedule/
│   │   └── page.tsx                 # Today's schedule page
│   └── stats/
│       └── page.tsx                 # Email statistics page
├── components/
│   ├── pages/admin/email/
│   │   ├── CampaignDashboard.tsx    # Campaign dashboard component
│   │   ├── CampaignForm.tsx         # Campaign creation form
│   │   ├── CampaignDetails.tsx      # Campaign details view
│   │   ├── TodaySchedule.tsx        # Today's schedule component
│   │   └── EmailStats.tsx           # Email statistics component
│   └── shared/email/
│       └── TemplatePreview.tsx      # Template preview component
├── hooks/
│   └── useEmailManagement.ts        # Email management hook
├── lib/
│   └── emailApi.ts                  # Email API functions
└── types/
    └── email.ts                     # Email-related TypeScript types
```

## 🛠️ Components

### CampaignDashboard

The main dashboard component that displays all email campaigns with:

- Campaign list with status and progress
- Quick statistics
- Search and filter functionality
- Pagination
- Create campaign button

### CampaignForm

A comprehensive form for creating new email campaigns with:

- Recipient management (bulk + individual)
- Template selection and preview
- Scheduling options
- Validation and error handling
- Test email functionality

### CampaignDetails

Detailed view for individual campaigns with:

- Overview tab with campaign metadata
- Daily schedule tab with calendar view
- Recipients tab with search/filter
- Export functionality

### TodaySchedule

Dedicated page showing today's email schedule with:

- Campaign breakdown
- Recipient lists
- Real-time status updates
- Export functionality

### EmailStats

Statistics dashboard with:

- Key metrics and performance indicators
- Charts and graphs
- Daily trends
- Campaign performance analysis

### TemplatePreview

Template rendering component with:

- Live preview of email templates
- Sample data editing
- Template switching

## 🔌 API Integration

### Required API Endpoints

```typescript
// Campaign Management
POST /email/schedule-bulk          // Create campaign
GET /email/campaigns               // Get all campaigns
GET /email/campaign/:campaignId    // Get campaign details
GET /email/campaign/:campaignId/detailed  // Get detailed campaign info
POST /email/campaign/:campaignId/cancel   // Cancel campaign

// Today's Schedule
GET /email/today-schedule          // Get today's schedule

// Testing & Monitoring
POST /email/test-configuration     // Test email configuration
POST /email/send-immediate         // Send immediate test email
POST /email/test-bulk-immediate    // Test bulk email immediate
GET /email/stats                   // Get email statistics
GET /email/templates               // Get available templates
GET /email/health                  // Health check
```

### Data Structures

```typescript
interface Campaign {
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

interface DailyScheduleItem {
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
```

## 🎨 UI/UX Features

### Design System

- **Colors**: Primary, secondary, and status-specific colors
- **Typography**: Consistent font hierarchy
- **Spacing**: Standardized spacing system
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and loading states

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Adaptive layouts

### Accessibility

- WCAG compliance
- Keyboard navigation
- Screen reader support
- High contrast support

## 🔧 Technical Implementation

### State Management

- React hooks for local state
- Custom hooks for API integration
- Real-time updates with polling
- Optimistic updates

### Performance

- Pagination for large lists
- Lazy loading
- Optimized re-renders
- Caching strategies

### Security

- Input sanitization
- XSS prevention
- CSRF protection
- Secure API calls

### Error Handling

- Graceful error states
- User-friendly error messages
- Retry mechanisms
- Loading states

## 📊 Usage Examples

### Creating a Campaign

1. Navigate to the Campaigns page
2. Click "Create Campaign"
3. Add recipients (bulk or individual)
4. Select template and customize content
5. Configure scheduling options
6. Preview template
7. Submit campaign

### Viewing Campaign Details

1. Click "View" on any campaign
2. Navigate between Overview, Daily Schedule, and Recipients tabs
3. Use the calendar view to see daily breakdown
4. Export recipient lists as needed

### Monitoring Today's Schedule

1. Navigate to Today's Schedule page
2. View campaign breakdown
3. Monitor real-time status updates
4. Export data as needed

### Analyzing Statistics

1. Navigate to Email Statistics page
2. View key metrics and trends
3. Analyze performance data
4. Export reports

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React 18+
- TypeScript 5+
- Tailwind CSS

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Configuration

1. Update API endpoints in `src/lib/emailApi.ts`
2. Configure email templates in `src/components/shared/email/TemplatePreview.tsx`
3. Customize styling in `tailwind.config.js`

## 📝 API Documentation

### Request/Response Examples

#### Create Campaign

```typescript
// Request
POST /email/schedule-bulk
{
  "recipients": [
    { "email": "user@example.com", "name": "John Doe" }
  ],
  "subject": "Welcome to our platform",
  "templateName": "welcome",
  "templateData": { "company": "Example Corp" },
  "immediate": false
}

// Response
{
  "campaignId": "camp_123",
  "totalRecipients": 1,
  "totalBatches": 1,
  "estimatedCompletionDate": "2024-01-15T10:00:00Z"
}
```

#### Get Campaign Details

```typescript
// Request
GET /email/campaign/camp_123/detailed

// Response
{
  "campaignId": "camp_123",
  "subject": "Welcome to our platform",
  "status": "processing",
  "totalRecipients": 1000,
  "dailySchedule": [...],
  "summary": {...}
}
```

## 🔍 Testing

### Unit Tests

- Component testing with React Testing Library
- Hook testing
- Utility function testing

### Integration Tests

- API integration testing
- End-to-end workflow testing
- Error scenario testing

### User Acceptance Testing

- Campaign creation flow
- Daily schedule viewing
- Real-time updates
- Error handling

## 🚀 Deployment

### Environment Configuration

- API endpoint configuration
- Environment variables
- Feature flags

### Monitoring

- Error tracking
- Performance monitoring
- User analytics

### Security

- Input validation
- XSS prevention
- CSRF protection
- Rate limiting

## 📈 Future Enhancements

### Planned Features

- Advanced analytics and reporting
- A/B testing for campaigns
- Email template builder
- Advanced scheduling options
- Integration with external email services
- Webhook support
- Advanced filtering and segmentation

### Performance Improvements

- Real-time WebSocket updates
- Advanced caching strategies
- Database optimization
- CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This system is designed for super admin use only and includes comprehensive role-based access control. Ensure proper authentication and authorization are implemented before deployment.
