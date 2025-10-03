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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGroupChipStyles = (group: string) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md";

    switch (group) {
      case "Science":
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-300`;
      case "Business Studies":
        return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-300`;
      case "Humanities":
        return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white border border-gray-300`;
    }
  };

  const getGenderChipStyles = (gender: string) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md";

    switch (gender) {
      case "Male":
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-300`;
      case "Female":
        return `${baseClasses} bg-gradient-to-r from-pink-500 to-pink-600 text-white border border-pink-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white border border-gray-300`;
    }
  };

  const getPaymentChipStyles = (paymentType: string) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md";

    switch (paymentType) {
      case "Bkash":
        return `${baseClasses} bg-gradient-to-r from-pink-500 to-pink-600 text-white border border-pink-300`;
      case "Nagad":
        return `${baseClasses} bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-300`;
      case "Cash":
        return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-300`;
      case "Bank Account":
        return `${baseClasses} bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border border-indigo-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white border border-gray-300`;
    }
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "participantCategory",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              value === "Alumni"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : value === "Student"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            }`}
          >
            {value}
          </span>
        ),
      },
    },
    {
      name: "fullName",
      label: "Full Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (rowData.participantCategory === "Guest") {
            return (
              <div>
                <div className="font-semibold">{rowData.guestName}</div>
                <div className="text-sm text-gray-500">
                  Guest of: {rowData.mainParticipantName}
                </div>
              </div>
            );
          }
          return value;
        },
      },
    },
    {
      name: "phoneNumber",
      label: "Phone",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (rowData.participantCategory === "Guest") {
            return rowData.guestMobileNumber || value;
          }
          return value;
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
      name: "hscPassingYear",
      label: "HSC Year",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "group",
      label: "Group",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span className={getGroupChipStyles(value)}>{value}</span>
        ),
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span className={getGenderChipStyles(value)}>{value}</span>
        ),
      },
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {value}
          </span>
        ),
      },
    },
    {
      name: "paymentType",
      label: "Payment Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span className={getPaymentChipStyles(value)}>{value}</span>
        ),
      },
    },
    {
      name: "amountType",
      label: "Amount Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              value === "Registration"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            }`}
          >
            {value}
          </span>
        ),
      },
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: number) => (
          <span className="font-semibold text-green-600">৳{value}</span>
        ),
      },
    },
    {
      name: "fatherName",
      label: "Father's Name",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
      },
    },
    {
      name: "motherName",
      label: "Mother's Name",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
      },
    },
    {
      name: "comments",
      label: "Comments",
      options: {
        filter: true,
        sort: true,
        display: false, // Hidden by default
        customBodyRender: (value: string) => value || "No comments",
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
                title="Silver Jubilee Participants"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions(
                  "silver-jubilee-participants.csv",
                  {
                    customToolbar: () => (
                      <>
                        <Link href={"/admin/silver-jubilee/submit"}>
                          <Button
                            component="a"
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{
                              ml: 1,
                            }}
                          >
                            Add Participant
                          </Button>
                        </Link>
                      </>
                    ),
                  }
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
