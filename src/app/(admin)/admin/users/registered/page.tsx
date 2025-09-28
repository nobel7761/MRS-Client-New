"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import directApi from "@/lib/directApi";
import {
  User,
  UserRole,
  UserStatus,
  UserType,
  MembershipCategory,
} from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Button from "@mui/material/Button";
import AnimatedButton from "@/components/shared/custom-components/animated-button";
import StatusChip from "@/components/shared/custom-components/StatusChip";

const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;

function getMuiDatatableOptions(
  downloadFileName: string,
  more?: MUIDataTableOptions
): MUIDataTableOptions {
  return {
    print: false,
    selectableRows: undefined,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 75, 100],
    downloadOptions: {
      filename: downloadFileName,
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    textLabels: {
      body: {
        noMatch: "No matching record found",
      },
      pagination: {
        rowsPerPage: "Rows per page",
      },
    },
    ...more,
  };
}

const RegisteredUsersPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const response = await directApi.get("/user/all");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users data:", error);
      toast.error("Failed to fetch users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusDisplayText = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "Active";
      case UserStatus.INACTIVE:
        return "Inactive";
      default:
        return status;
    }
  };

  const getRoleDisplayText = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Super Admin";
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.USER:
        return "User";
      default:
        return role;
    }
  };

  const getUserTypeDisplayText = (userType: UserType) => {
    switch (userType) {
      case UserType.OWNER:
        return "Owner";
      case UserType.COLLECTOR:
        return "Collector";
      case UserType.VISITOR:
        return "Visitor";
      default:
        return userType;
    }
  };

  const getMembershipDisplayText = (membership: MembershipCategory) => {
    switch (membership) {
      case MembershipCategory.FREE:
        return "Free";
      case MembershipCategory.YEARLY:
        return "Yearly";
      case MembershipCategory.PERMANENT:
        return "Permanent";
      default:
        return membership || "Free";
    }
  };

  const getMembershipChipStyles = (membership: MembershipCategory) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md";

    switch (membership) {
      case MembershipCategory.FREE:
        return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-300`;
      case MembershipCategory.YEARLY:
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border border-yellow-300`;
      case MembershipCategory.PERMANENT:
        return `${baseClasses} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white border border-gray-300`;
    }
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "firstName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          return `${rowData.firstName} ${rowData.lastName}`;
        },
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "phone",
      label: "Phone",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: UserRole) => (
          <StatusChip variant="role" value={value}>
            {getRoleDisplayText(value)}
          </StatusChip>
        ),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: UserStatus) => (
          <StatusChip variant="status" value={value}>
            {getStatusDisplayText(value)}
          </StatusChip>
        ),
      },
    },
    {
      name: "userType",
      label: "User Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: UserType) => (
          <StatusChip variant="userType" value={value}>
            {getUserTypeDisplayText(value)}
          </StatusChip>
        ),
      },
    },
    {
      name: "membershipCategory",
      label: "Membership",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: MembershipCategory) => (
          <span className={getMembershipChipStyles(value)}>
            {getMembershipDisplayText(value)}
          </span>
        ),
      },
    },
    {
      name: "createdAt",
      label: "Registered On",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => formatDate(value),
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 bg-cover bg-center bg-no-repeat rounded-lg"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="bg-white rounded-lg">
            {data && (
              <MUIDataTable
                title="Registered Users"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("registered-users.csv", {
                  customToolbar: () => (
                    <>
                      <Link href={"/"}>
                        <Button
                          component="a"
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{
                            ml: 1,
                          }}
                        >
                          Create User
                        </Button>
                      </Link>
                    </>
                  ),
                })}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisteredUsersPage;
