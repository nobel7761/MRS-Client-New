"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import { silverJubileeApi } from "@/lib/silverJubileeApi";
import { SilverJubileeParticipant } from "@/types/silverJubilee";
import Link from "next/link";
import Button from "@mui/material/Button";
import AnimatedButton from "@/components/shared/custom-components/animated-button";
import StatusChip from "@/components/shared/custom-components/StatusChip";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, UserType } from "@/types/auth";
import { directApi } from "@/lib/directApi";

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

const SilverJubileeParticipantsPage = () => {
  const [data, setData] = useState<SilverJubileeParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Check if user can view secret code
  const canViewSecretCode =
    user?.role === UserRole.SUPER_ADMIN ||
    (user?.role === UserRole.ADMIN && user?.userType === UserType.COLLECTOR);

  const fetchData = async () => {
    try {
      const response = await silverJubileeApi.getAllParticipants();
      setData(response);
    } catch (error) {
      console.error("Error fetching participants data:", error);
      toast.error("Failed to fetch participants data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendEmail = async (participant: SilverJubileeParticipant) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Sending email...");

      // Call the backend API to send email
      await directApi.post(`/silver-jubilee/${participant._id}/send-email`, {});

      // Update the toast to success
      toast.update(loadingToast, {
        render: "Email sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Refresh the data to update the email status
      fetchData();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "participantCategory",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "fullName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (rowData.participantCategory === "Guest") {
            return `${rowData.guestName || "-"} || Guest of: ${
              rowData.mainParticipantName || "-"
            }`;
          }
          if (rowData.participantCategory === "Baby") {
            return `${rowData.babyName || "-"} || Baby of: ${
              rowData.mainParticipantName || "-"
            }`;
          }
          return value || "-";
        },
      },
    },
    {
      name: "phoneNumber",
      label: "Phone",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (rowData.participantCategory === "Guest") {
            return rowData.guestMobileNumber || value || "-";
          }
          if (rowData.participantCategory === "Baby") {
            return rowData.babyPhone || value || "-";
          }
          return value || "-";
        },
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "hscPassingYear",
      label: "Batch",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: number) => value || "-",
      },
    },
    {
      name: "group",
      label: "Group",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    canViewSecretCode && {
      name: "secretCode",
      label: "Secret Code",
      options: {
        filter: true,
        sort: true,
        display: false, // Only visible for SUPER_ADMIN or ADMIN with COLLECTOR userType
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "paymentType",
      label: "Payment Type",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    // {
    //   name: "amountType",
    //   label: "Amount Type",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (value: string) => (
    //       <span
    //         className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
    //           value === "Registration"
    //             ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
    //             : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
    //         }`}
    //       >
    //         {value}
    //       </span>
    //     ),
    //   },
    // },
    {
      name: "amount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: number) => {
          if (!value && value !== 0) return "-";
          return `৳${value}`;
        },
      },
    },
    {
      name: "fatherName",
      label: "Father's Name",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "fatherOccupation",
      label: "Father's Occupation",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "fatherPhoneNumber",
      label: "Father's Phone",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "motherName",
      label: "Mother's Name",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "motherOccupation",
      label: "Mother's Occupation",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "motherPhoneNumber",
      label: "Mother's Phone",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "comments",
      label: "Comments",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "createdAt",
      label: "Registered On",
      options: {
        filter: true,
        sort: true,
        display: true,
        customBodyRender: (value: string) => (value ? formatDate(value) : "-"),
      },
    },
    {
      name: "registeredBy",
      label: "Registered By",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRender: (value: any) => {
          if (!value) return "-";
          return (
            `${value.firstName || ""} ${value.lastName || ""}`.trim() || "-"
          );
        },
      },
    },
    {
      name: "isEmailSent",
      label: "Email Status",
      options: {
        filter: true,
        sort: false,
        display: true,
        customBodyRender: (value: boolean, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (value === false) {
            return (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSendEmail(rowData)}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  padding: "6px 16px",
                }}
              >
                Send Email
              </Button>
            );
          }
          return (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Sent
            </span>
          );
        },
      },
    },
  ].filter(Boolean) as MUIDataTableColumnDef[];

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
                title="Silver Jubilee Participants"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions(
                  "silver-jubilee-participants.csv"
                )}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SilverJubileeParticipantsPage;
