# Events Management Module

## Overview

The Events Management Module provides comprehensive functionality for managing events in the NICAA system. This module is accessible only to SUPER_ADMIN users and includes features for creating, viewing, editing, and deleting events.

## Features Implemented

### 1. Sidebar Integration

- Added "Events" section to the admin sidebar for SUPER_ADMIN users
- Includes "All Events" submenu item
- Uses party emoji (🎉) as the icon

### 2. Event Types and Interfaces

- **File**: `src/types/event.ts`
- Complete TypeScript interfaces for:
  - `Event` - Main event interface
  - `CreateEventData` - Event creation data
  - `PricingRange` - Pricing structure for paid events
  - `SocialMediaLinks` - Social media integration
  - `EventStatus` - Event status enum (Upcoming, Ongoing, Completed)
  - `EventVisibility` - Visibility enum (Public, Private, Alumni-only)
  - `EventFilters` - Filtering options
  - `EventsResponse` - API response structure

### 3. API Service Layer

- **File**: `src/lib/eventApi.ts`
- Complete API service with all endpoints:
  - `getEvents()` - Fetch events with filtering and pagination
  - `getEvent()` - Fetch single event
  - `createEvent()` - Create new event
  - `updateEvent()` - Update existing event
  - `deleteEvent()` - Delete event
  - `registerForEvent()` - Register user for event
  - `unregisterFromEvent()` - Unregister user from event
  - `getUserRegisteredEvents()` - Get user's registered events
  - `getFeaturedUpcomingEvents()` - Get featured upcoming events
- Automatic JWT token handling
- Error handling and response typing

### 4. Main Events Page

- **File**: `src/app/(admin)/admin/events/page.tsx`
- **Features**:
  - Responsive design with Material UI components
  - Dual view modes: Cards and Table
  - Advanced filtering (search, status, visibility)
  - Pagination support
  - Real-time data fetching
  - Error handling with user-friendly alerts
  - Loading states
  - Create event button with modal integration

### 5. Event Form Component

- **File**: `src/components/pages/admin/events/EventForm.tsx`
- **Features**:
  - Comprehensive form with all event fields
  - Dynamic pricing ranges for paid events
  - Special guests management
  - Social media links integration
  - Form validation with error messages
  - Responsive design
  - Real-time form state management

### 6. Event Card Component

- **File**: `src/components/pages/admin/events/EventCard.tsx`
- **Features**:
  - Beautiful card-based event display
  - Event banner image support
  - Status and visibility badges
  - Seat availability progress bar
  - Special guests display
  - Pricing information for paid events
  - Action buttons (View, Edit, Delete)
  - Hover effects and animations
  - Responsive design

## UI/UX Features

### Design Elements

- **Material UI Integration**: Complete Material UI component library usage
- **Responsive Design**: Mobile-first approach with breakpoints
- **Color Coding**: Status and visibility indicators with appropriate colors
- **Icons**: Consistent iconography throughout the interface
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Spacing**: Consistent spacing using Material UI's spacing system

### Interactive Elements

- **View Toggle**: Switch between card and table views
- **Advanced Filtering**: Search, status, and visibility filters
- **Pagination**: Efficient data pagination
- **Modal Forms**: Clean modal-based event creation
- **Hover Effects**: Subtle animations and hover states
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling in modals

## API Integration

### Backend Compatibility

The module is fully compatible with the provided Event API documentation:

- All endpoints implemented
- Proper request/response handling
- Error handling for all HTTP status codes
- Authentication token management
- Query parameter support for filtering and pagination

### Data Flow

1. **Fetch Events**: Load events with current filters
2. **Create Event**: Submit form data to create new event
3. **Update Event**: Modify existing event data
4. **Delete Event**: Remove event with confirmation
5. **Real-time Updates**: Refresh data after operations

## File Structure

```
src/
├── types/
│   └── event.ts                    # Event type definitions
├── lib/
│   └── eventApi.ts                 # API service layer
├── app/(admin)/admin/events/
│   └── page.tsx                    # Main events page
└── components/pages/admin/events/
    ├── EventForm.tsx               # Event creation/edit form
    └── EventCard.tsx               # Event card component
```

## Usage

### For SUPER_ADMIN Users

1. Navigate to the admin panel
2. Click on "Events" in the sidebar
3. Select "All Events" to view the events management page
4. Use the "Create Event" button to add new events
5. Switch between card and table views using the toggle
6. Use filters to search and filter events
7. Edit or delete events using the action buttons

### Event Creation Process

1. Click "Create Event" button
2. Fill in the comprehensive form:
   - Basic information (title, description, banner image)
   - Date and time details
   - Venue information
   - Organizer details
   - Special guests (optional)
   - Event settings (status, visibility, seat limit)
   - Pricing ranges (for paid events)
   - Social media links (optional)
3. Submit the form to create the event

## Future Enhancements

- Event editing functionality
- Event details view modal
- Bulk operations (bulk delete, status update)
- Event analytics and statistics
- Event registration management
- Email notifications for event updates
- Event calendar integration
- Advanced search and filtering options

## Technical Notes

- Built with Next.js 14 and React 18
- Uses Material UI v7 for components
- TypeScript for type safety
- Responsive design with Tailwind CSS
- State management with React hooks
- Error handling with try-catch blocks
- Form validation with custom validation logic
