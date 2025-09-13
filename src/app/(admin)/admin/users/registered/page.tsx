"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import client from "@/lib/api";
import { User, UserRole, UserStatus, MembershipCategory } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Button from "@mui/material/Button";
import AnimatedButton from "@/components/shared/custom-components/animated-button";

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
      const response = await client.get("/user/all");
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

  const getStatusBadge = (status: UserStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case UserStatus.ACTIVE:
        return `${baseClasses} bg-green-100 text-green-800`;
      case UserStatus.INACTIVE:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
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

  const getRoleBadge = (role: UserRole) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case UserRole.ADMIN:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case UserRole.USER:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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

  const getMembershipBadge = (membership: MembershipCategory) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (membership) {
      case MembershipCategory.FREE:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case MembershipCategory.YEARLY:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case MembershipCategory.PERMANENT:
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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
          <span className={getRoleBadge(value)}>
            {getRoleDisplayText(value)}
          </span>
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
          <span className={getStatusBadge(value)}>
            {getStatusDisplayText(value)}
          </span>
        ),
      },
    },
    {
      name: "membershipCategory",
      label: "Membership",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: MembershipCategory) => (
          <span className={getMembershipBadge(value)}>
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
