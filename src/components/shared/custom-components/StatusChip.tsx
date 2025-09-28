import React from "react";
import { UserRole, UserStatus, UserType } from "@/types/auth";

interface ChipProps {
  children: React.ReactNode;
  variant: "role" | "status" | "userType";
  value: UserRole | UserStatus | UserType;
}

const StatusChip: React.FC<ChipProps> = ({ children, variant, value }) => {
  const getChipStyles = () => {
    // Special handling for Super Admin to ensure it fits on one line
    const isSuperAdmin = variant === "role" && value === UserRole.SUPER_ADMIN;
    const baseClasses = isSuperAdmin
      ? "inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-normal shadow-sm transition-all duration-200 hover:shadow-md w-28 whitespace-nowrap"
      : "inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-normal shadow-sm transition-all duration-200 hover:shadow-md min-w-24 whitespace-nowrap";

    switch (variant) {
      case "role":
        switch (value as UserRole) {
          case UserRole.SUPER_ADMIN:
            return `${baseClasses} text-white border-0`; // #0162B8 background
          case UserRole.ADMIN:
            return `${baseClasses} text-white border-0`; // #0162B8 background
          case UserRole.USER:
            return `${baseClasses} text-white border-0`; // #0162B8 background
          default:
            return `${baseClasses} text-white border-0`; // #0162B8 background
        }

      case "status":
        switch (value as UserStatus) {
          case UserStatus.ACTIVE:
            return `${baseClasses} text-white border-0`; // #0162B8 background
          case UserStatus.INACTIVE:
            return `${baseClasses} text-white border-0`; // #432200 background with #F5CD6F text
          default:
            return `${baseClasses} text-white border-0`; // #0162B8 background
        }

      case "userType":
        switch (value as UserType) {
          case UserType.OWNER:
            return `${baseClasses} text-white border-0`; // #0162B8 background
          case UserType.COLLECTOR:
            return `${baseClasses} text-white border-0`; // #94DCF7 background with #00468A text
          case UserType.VISITOR:
            return `${baseClasses} text-white border-0`; // #0162B8 background
          default:
            return `${baseClasses} text-white border-0`; // #0162B8 background
        }

      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white border border-gray-300`;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "role":
        switch (value as UserRole) {
          case UserRole.SUPER_ADMIN:
            return "#8B5CF6"; // Purple for Super Admin
          case UserRole.ADMIN:
            return "#3B82F6"; // Blue for Admin
          case UserRole.USER:
            return "#6B7280"; // Gray for User
          default:
            return "#6B7280";
        }
      case "status":
        switch (value as UserStatus) {
          case UserStatus.ACTIVE:
            return "#10B981"; // Green for Active
          case UserStatus.INACTIVE:
            return "#EF4444"; // Red for Inactive
          default:
            return "#6B7280";
        }
      case "userType":
        switch (value as UserType) {
          case UserType.OWNER:
            return "#F59E0B"; // Amber for Owner
          case UserType.COLLECTOR:
            return "#06B6D4"; // Cyan for Collector
          case UserType.VISITOR:
            return "#8B5CF6"; // Purple for Visitor
          default:
            return "#6B7280";
        }
      default:
        return "#6B7280";
    }
  };

  const getTextColor = () => {
    return "white"; // Always use white text for better contrast
  };

  return (
    <span
      className={getChipStyles()}
      style={{
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
      }}
    >
      {children}
    </span>
  );
};

export default StatusChip;
