"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import directApi from "@/lib/directApi";

const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;

// Placeholder interface for event participants
// This will be updated when the API endpoint is provided
interface EventParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventName: string;
  registrationDate: string;
  status: string;
}

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

const EventParticipantsPage = () => {
  const [data, setData] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API endpoint when provided
      // const response = await client.get("/event-participants");
      // setData(response.data);

      // Placeholder data for now
      setData([]);
      toast.info("Event participants API endpoint will be provided later");
    } catch (error) {
      console.error("Error fetching event participants data:", error);
      toast.error("Failed to fetch event participants data");
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "active":
      case "registered":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "firstName",
      label: "First Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        filter: true,
        sort: true,
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
      name: "eventName",
      label: "Event",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <span className={getStatusBadge(value)}>{value}</span>
        ),
      },
    },
    {
      name: "registrationDate",
      label: "Registration Date",
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
            {data.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Event Participants
                </h3>
                <p className="text-gray-500">
                  No event participants data available. API endpoint will be
                  provided later.
                </p>
              </div>
            ) : (
              <MUIDataTable
                title="Event Participants"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("event-participants.csv")}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventParticipantsPage;
