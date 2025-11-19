"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import { silverJubileeApi } from "@/lib/silverJubileeApi";
import { SilverJubileeParticipant } from "@/types/silverJubilee";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, UserType } from "@/types/auth";
import { directApi } from "@/lib/directApi";
import { FaEdit, FaCheck, FaDollarSign } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import EmailPreviewModal from "./EmailPreviewModal";
import PaymentStatusUpdateDialog from "./PaymentStatusUpdateDialog";
import { Button } from "@mui/material";

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

const ParticipantsList = () => {
  const [data, setData] = useState<SilverJubileeParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<SilverJubileeParticipant | null>(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] =
    useState<SilverJubileeParticipant | null>(null);

  // Email Preview Modal State
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [participantForEmail, setParticipantForEmail] =
    useState<SilverJubileeParticipant | null>(null);

  // Payment Status Update Modal State
  const [paymentStatusUpdateOpen, setPaymentStatusUpdateOpen] = useState(false);
  const [participantForPaymentUpdate, setParticipantForPaymentUpdate] =
    useState<SilverJubileeParticipant | null>(null);

  // Check if user can view secret code
  const canViewSecretCode =
    user?.role === UserRole.SUPER_ADMIN ||
    (user?.role === UserRole.ADMIN && user?.userType === UserType.COLLECTOR);

  // Check if user can view email status column
  const canViewEmailStatus =
    user?.role === UserRole.SUPER_ADMIN ||
    (user?.role === UserRole.ADMIN && user?.userType === UserType.COLLECTOR);

  // Check if user is super admin
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const fetchData = async () => {
    try {
      const response = await silverJubileeApi.getAllParticipants();
      // Debug: Log first participant to check submittedFrom field
      if (response && response.length > 0) {
        console.log("Sample participant data:", response[0]);
        console.log("submittedFrom value:", response[0].submittedFrom);
      }
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

  const handleSendEmail = (participant: SilverJubileeParticipant) => {
    setParticipantForEmail(participant);
    setEmailPreviewOpen(true);
  };

  // Edit Participant Handlers
  const handleEditClick = async (participantId: string) => {
    try {
      const response = await directApi.get(`/silver-jubilee/${participantId}`);
      const participantData = response.data;
      setSelectedParticipant(participantData);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching participant details:", error);
      toast.error("Failed to fetch participant details");
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleEditSuccess = () => {
    fetchData();
  };

  // Delete Participant Handlers
  const handleDeleteClick = (participant: SilverJubileeParticipant) => {
    setParticipantToDelete(participant);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setParticipantToDelete(null);
  };

  const handleDeleteSuccess = () => {
    fetchData();
  };

  // Email Preview Modal Handlers
  const handleEmailPreviewClose = () => {
    setEmailPreviewOpen(false);
    setParticipantForEmail(null);
  };

  const handleEmailSent = () => {
    fetchData();
  };

  // Payment Status Update Handlers
  const handlePaymentStatusUpdateClick = (
    participant: SilverJubileeParticipant
  ) => {
    setParticipantForPaymentUpdate(participant);
    setPaymentStatusUpdateOpen(true);
  };

  const handlePaymentStatusUpdateClose = () => {
    setPaymentStatusUpdateOpen(false);
    setParticipantForPaymentUpdate(null);
  };

  const handlePaymentStatusUpdateSuccess = () => {
    fetchData();
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
      name: "submittedFrom",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          // Get the actual value from rowData in case the column name doesn't match
          const submittedFromValue = rowData?.submittedFrom || value;

          // Handle both "Public Page" and "Not Paid" as "Not Paid" status
          const isNotPaid =
            submittedFromValue === "Public Page" ||
            submittedFromValue === "Not Paid";
          const isPaid = submittedFromValue === "Paid";

          const status = isNotPaid ? "Not Paid" : isPaid ? "Paid" : "-";
          return <span>{status}</span>;
        },
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
            return (
              <div>
                <span className="font-bold">{rowData.guestName || "-"}</span>
                <br />
                <span className="text-gray-500 font-light italic text-xs">
                  Guest of: {rowData.mainParticipantName || "-"}
                </span>
              </div>
            );
          }
          if (rowData.participantCategory === "Baby") {
            return (
              <div>
                <span className="font-bold">{rowData.babyName || "-"}</span>
                <br />
                <span className="text-gray-500 font-light italic text-xs">
                  Baby of: {rowData.mainParticipantName || "-"}
                </span>
              </div>
            );
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
        customBodyRender: (value: number, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (
            rowData.participantCategory === "Guest" ||
            rowData.participantCategory === "Baby"
          ) {
            return (
              <div>
                <span>-</span>
                <br />
                <span className="text-gray-500 text-xs">
                  {rowData.mainParticipantBatch || "-"}
                </span>
              </div>
            );
          }
          return value || "-";
        },
      },
    },
    {
      name: "group",
      label: "Group",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (
            rowData.participantCategory === "Guest" ||
            rowData.participantCategory === "Baby"
          ) {
            return (
              <div>
                <span>-</span>
                <br />
                <span className="text-gray-500 text-xs">
                  {rowData.mainParticipantGroup || "-"}
                </span>
              </div>
            );
          }
          return value || "-";
        },
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
        display: false,
        customBodyRender: (value: string) => (value ? formatDate(value) : "-"),
      },
    },
    {
      name: "registeredUnder",
      label: "Registered Under",
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
      name: "formFilledUpBy",
      label: "Form Filled Up By",
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
    canViewEmailStatus && {
      name: "isEmailSent",
      label: "Email Status",
      options: {
        filter: true,
        sort: false,
        display: false,
        customBodyRender: (value: boolean, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          if (value === false) {
            return (
              <Button
                variant="outlined"
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
    // Add Actions column
    canViewEmailStatus && {
      name: "_id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          const submittedFromValue = rowData?.submittedFrom;
          const isNotPaid =
            submittedFromValue === "Public Page" ||
            submittedFromValue === "Not Paid";

          return (
            <div className="flex items-center gap-4">
              {/* Edit Icon */}
              <FaEdit
                className="text-indigo-500 text-xl cursor-pointer hover:text-indigo-600"
                onClick={() => handleEditClick(value)}
                title="Edit Participant"
              />

              {/* Delete/Bin Icon */}
              <MdDelete
                className="text-red-500 text-xl cursor-pointer hover:text-red-600"
                onClick={() => handleDeleteClick(rowData)}
                title="Delete Participant"
              />

              {/* Mark as Paid Button - Only for super admin when status is Not Paid */}
              {isNotPaid && isSuperAdmin && (
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  startIcon={<FaCheck />}
                  onClick={() => handlePaymentStatusUpdateClick(rowData)}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    padding: "4px 12px",
                    minWidth: "auto",
                    borderColor: "#10b981",
                    color: "#10b981",
                    "&:hover": {
                      borderColor: "#059669",
                      backgroundColor: "#ecfdf5",
                    },
                  }}
                  title="Mark as Paid"
                >
                  Mark as Paid
                </Button>
              )}
            </div>
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

      {/* Edit Dialog */}
      <EditDialog
        open={editModalOpen}
        onClose={handleEditClose}
        participant={selectedParticipant}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteModalOpen}
        onClose={handleDeleteClose}
        participant={participantToDelete}
        onSuccess={handleDeleteSuccess}
      />

      {/* Email Preview Modal */}
      <EmailPreviewModal
        open={emailPreviewOpen}
        onClose={handleEmailPreviewClose}
        participant={participantForEmail}
        onEmailSent={handleEmailSent}
      />

      {/* Payment Status Update Dialog */}
      <PaymentStatusUpdateDialog
        open={paymentStatusUpdateOpen}
        onClose={handlePaymentStatusUpdateClose}
        participant={participantForPaymentUpdate}
        onSuccess={handlePaymentStatusUpdateSuccess}
      />
    </div>
  );
};

export default ParticipantsList;
