"use client";

import StatusChip from "@/components/shared/custom-components/StatusChip";
import {
  UserRole,
  UserStatus,
  UserType,
  MembershipCategory,
} from "@/types/auth";

export default function ChipPreviewPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Chip Preview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Role Chips */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Roles</h2>
          <div className="space-y-3">
            <div>
              <StatusChip variant="role" value={UserRole.SUPER_ADMIN}>
                Super Admin
              </StatusChip>
            </div>
            <div>
              <StatusChip variant="role" value={UserRole.ADMIN}>
                Admin
              </StatusChip>
            </div>
            <div>
              <StatusChip variant="role" value={UserRole.USER}>
                User
              </StatusChip>
            </div>
          </div>
        </div>

        {/* Status Chips */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Status</h2>
          <div className="space-y-3">
            <div>
              <StatusChip variant="status" value={UserStatus.ACTIVE}>
                Active
              </StatusChip>
            </div>
            <div>
              <StatusChip variant="status" value={UserStatus.INACTIVE}>
                Inactive
              </StatusChip>
            </div>
          </div>
        </div>

        {/* User Type Chips */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">User Types</h2>
          <div className="space-y-3">
            <div>
              <StatusChip variant="userType" value={UserType.OWNER}>
                Owner
              </StatusChip>
            </div>
            <div>
              <StatusChip variant="userType" value={UserType.COLLECTOR}>
                Collector
              </StatusChip>
            </div>
            <div>
              <StatusChip variant="userType" value={UserType.VISITOR}>
                Visitor
              </StatusChip>
            </div>
          </div>
        </div>

        {/* Color Scheme Info */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            New Color Scheme
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: "#8B5CF6" }}
              ></div>
              <span className="text-sm">Purple - Super Admin, Visitor</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: "#3B82F6" }}
              ></div>
              <span className="text-sm">Blue - Admin</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: "#10B981" }}
              ></div>
              <span className="text-sm">Green - Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: "#EF4444" }}
              ></div>
              <span className="text-sm">Red - Inactive</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: "#F59E0B" }}
              ></div>
              <span className="text-sm">Amber - Owner</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: "#06B6D4" }}
              ></div>
              <span className="text-sm">Cyan - Collector</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-2 text-blue-800">Features</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Attractive and vibrant color scheme</li>
          <li>Consistent minimum width (min-w-24) for all chips</li>
          <li>Normal font weight (not bold) for better readability</li>
          <li>Membership and Registered On columns hidden by default</li>
          <li>Hover effects with shadow enhancement</li>
          <li>Color-coded for easy identification</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </div>
  );
}
