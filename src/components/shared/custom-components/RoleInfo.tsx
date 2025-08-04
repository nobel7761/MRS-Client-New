"use client";

import { useRoleAccess } from "@/hooks/useRoleAccess";

const RoleInfo = () => {
  const { userRole, isSuperAdmin, isAdmin, canAccessFaqs } = useRoleAccess();

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Current User Role & Permissions</h3>
      <div className="space-y-1 text-sm">
        <p>
          <strong>Role:</strong> {userRole || "Not logged in"}
        </p>
        <p>
          <strong>Is Super Admin:</strong> {isSuperAdmin() ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Admin:</strong> {isAdmin() ? "Yes" : "No"}
        </p>
        <p>
          <strong>Can Access FAQs:</strong> {canAccessFaqs() ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export default RoleInfo;
