# Role-Based Access Control for FAQs

## Overview

This implementation restricts access to the FAQs management section to Super Admin users only. Regular Admin users cannot access FAQs functionality.

## Implementation Details

### 1. User Roles

- `SUPER_ADMIN`: Can access all features including FAQs management
- `ADMIN`: Can access admin dashboard and representative registration, but NOT FAQs
- `USER`: Regular user with limited access

### 2. Components Created/Modified

#### New Components:

- `ProtectedRoute.tsx`: Higher-order component that checks user roles and shows access denied page
- `AccessDenied.tsx`: Component displayed when users don't have permission
- `RoleInfo.tsx`: Debug component showing current user role and permissions
- `useRoleAccess.ts`: Custom hook for role-based access control

#### Modified Components:

- `sidebar.items.ts`: Updated to show FAQs only for Super Admin
- `Sidebar.tsx`: Updated to use role-based sidebar items
- `middleware.ts`: Added server-side protection for FAQs routes
- FAQ pages: Wrapped with ProtectedRoute component

### 3. Protection Layers

#### Client-Side Protection:

- Sidebar only shows FAQs option for Super Admin
- ProtectedRoute component checks roles and shows access denied
- Toast notifications for unauthorized access attempts

#### Server-Side Protection:

- Middleware redirects non-Super Admin users from FAQs routes
- Prevents direct URL access even if client-side protection is bypassed

### 4. User Experience

#### For Super Admin:

- Can see FAQs option in sidebar
- Can access `/admin/faqs/category` and `/admin/faqs/all`
- Full access to FAQs management functionality

#### For Regular Admin:

- Cannot see FAQs option in sidebar
- If they try to access FAQs URLs directly, they get:
  - Server-side redirect to `/admin`
  - Client-side access denied page
  - Error toast notification

### 5. Testing

To test the implementation:

1. **Login as Super Admin**: Should see FAQs in sidebar and access all FAQs pages
2. **Login as Admin**: Should NOT see FAQs in sidebar
3. **Direct URL Access**: Try accessing `/admin/faqs/all` as Admin - should be redirected
4. **Role Info**: Check the RoleInfo component on admin dashboard for current permissions

### 6. Files Modified

```
src/
├── components/
│   ├── shared/
│   │   ├── custom-components/
│   │   │   ├── ProtectedRoute.tsx (NEW)
│   │   │   ├── AccessDenied.tsx (NEW)
│   │   │   └── RoleInfo.tsx (NEW)
│   │   └── sidebar/
│   │       ├── Sidebar.tsx (MODIFIED)
│   │       └── sidebar.items.ts (MODIFIED)
├── hooks/
│   └── useRoleAccess.ts (NEW)
├── app/(admin)/admin/
│   ├── page.tsx (MODIFIED - added RoleInfo)
│   ├── faqs/
│   │   ├── all/page.tsx (MODIFIED - added ProtectedRoute)
│   │   └── category/page.tsx (MODIFIED - added ProtectedRoute)
└── middleware.ts (MODIFIED - added FAQs protection)
```

### 7. Security Considerations

- **Multiple Layers**: Both client-side and server-side protection
- **No Bypass**: Even if client-side protection is disabled, server-side middleware prevents access
- **User Feedback**: Clear error messages and access denied pages
- **Audit Trail**: Toast notifications for access attempts

### 8. Future Enhancements

- Add logging for access attempts
- Implement role-based API endpoints
- Add more granular permissions (e.g., read-only vs full access)
- Create admin role management interface
