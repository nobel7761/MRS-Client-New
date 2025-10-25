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
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  SilverJubileeParticipantCategory,
  SilverJubileeGroup,
  SilverJubileeGender,
  SilverJubileeBloodGroup,
  SilverJubileePaymentType,
} from "@/types/silverJubilee";

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

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<SilverJubileeParticipant | null>(null);
  const [editFormData, setEditFormData] = useState<
    Partial<SilverJubileeParticipant>
  >({});
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] =
    useState<SilverJubileeParticipant | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check if user can view secret code
  const canViewSecretCode =
    user?.role === UserRole.SUPER_ADMIN ||
    (user?.role === UserRole.ADMIN && user?.userType === UserType.COLLECTOR);

  // Check if user can view email status column
  const canViewEmailStatus =
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

  // Edit Participant Handlers
  const handleEditClick = async (participantId: string) => {
    try {
      const response = await directApi.get(`/silver-jubilee/${participantId}`);
      const participantData = response.data;
      setSelectedParticipant(participantData);
      setEditFormData({
        participantCategory: participantData.participantCategory,
        fullName: participantData.fullName,
        phoneNumber: participantData.phoneNumber,
        alternativePhoneNumber: participantData.alternativePhoneNumber,
        email: participantData.email,
        hscPassingYear: participantData.hscPassingYear,
        group: participantData.group,
        gender: participantData.gender,
        bloodGroup: participantData.bloodGroup,
        paymentType: participantData.paymentType,
        amount: participantData.amount,
        comments: participantData.comments,
        fatherName: participantData.fatherName,
        fatherPhoneNumber: participantData.fatherPhoneNumber,
        fatherOccupation: participantData.fatherOccupation,
        motherName: participantData.motherName,
        motherPhoneNumber: participantData.motherPhoneNumber,
        motherOccupation: participantData.motherOccupation,
        // Main participant fields for guest/baby
        mainParticipantBatch: participantData.mainParticipantBatch,
        mainParticipantGroup: participantData.mainParticipantGroup,
        mainParticipantId: participantData.mainParticipantId,
        mainParticipantName: participantData.mainParticipantName,
        // Guest fields
        guestName: participantData.guestName,
        relation: participantData.relation,
        guestMobileNumber: participantData.guestMobileNumber,
        // Baby fields
        babyName: participantData.babyName,
        babyPhone: participantData.babyPhone,
      });
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching participant details:", error);
      toast.error("Failed to fetch participant details");
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedParticipant) return;

    setEditLoading(true);
    try {
      await directApi.patch(
        `/silver-jubilee/${selectedParticipant._id}`,
        editFormData
      );
      toast.success("Participant updated successfully");
      setEditModalOpen(false);
      setSelectedParticipant(null);
      setEditFormData({});
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error updating participant:", error);
      toast.error("Failed to update participant");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedParticipant(null);
    setEditFormData({});
  };

  // Delete Participant Handlers
  const handleDeleteClick = (participant: SilverJubileeParticipant) => {
    setParticipantToDelete(participant);
    setDeleteConfirmName("");
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!participantToDelete) return;

    setDeleteLoading(true);
    try {
      await directApi.delete(`/silver-jubilee/${participantToDelete._id}`);
      toast.success("Participant deleted successfully");
      setDeleteModalOpen(false);
      setParticipantToDelete(null);
      setDeleteConfirmName("");
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error deleting participant:", error);
      toast.error("Failed to delete participant");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setParticipantToDelete(null);
    setDeleteConfirmName("");
  };

  const isDeleteEnabled =
    participantToDelete && deleteConfirmName === participantToDelete.fullName;

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
            return (
              <div>
                <span className="font-bold">{rowData.guestName || "-"}</span>
                <br />
                <span className="text-gray-500 font-light italic">
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
                <span className="text-gray-500 font-light italic">
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
    // canViewEmailStatus && {
    //   name: "isEmailSent",
    //   label: "Email Status",
    //   options: {
    //     filter: true,
    //     sort: false,
    //     display: true,
    //     customBodyRender: (value: boolean, tableMeta: any) => {
    //       const rowData = data[tableMeta.rowIndex];
    //       if (value === false) {
    //         return (
    //           <Button
    //             variant="contained"
    //             color="primary"
    //             size="small"
    //             onClick={() => handleSendEmail(rowData)}
    //             sx={{
    //               textTransform: "none",
    //               fontSize: "0.875rem",
    //               padding: "6px 16px",
    //             }}
    //           >
    //             Send Email
    //           </Button>
    //         );
    //       }
    //       return (
    //         <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
    //           Sent
    //         </span>
    //       );
    //     },
    //   },
    // },
    // Add Actions column
    canViewEmailStatus && {
      name: "_id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-4">
              {/* Edit Icon */}

              <FaEdit
                className="text-indigo-500 text-xl cursor-pointer hover:text-indigo-600"
                onClick={() => handleEditClick(value)}
              />

              {/* Delete/Bin Icon */}
              <MdDelete
                className="text-red-500 text-xl cursor-pointer hover:text-red-600"
                onClick={() => handleDeleteClick(rowData)}
              />
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

      {/* Edit Participant Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Silver Jubilee Participant</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            {/* Participant Category */}
            <FormControl fullWidth>
              <InputLabel>Participant Category</InputLabel>
              <Select
                value={editFormData.participantCategory || ""}
                label="Participant Category"
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    participantCategory: e.target
                      .value as SilverJubileeParticipantCategory,
                  })
                }
              >
                <MenuItem value={SilverJubileeParticipantCategory.ALUMNI}>
                  Alumni
                </MenuItem>
                <MenuItem value={SilverJubileeParticipantCategory.STUDENT}>
                  Student
                </MenuItem>
                <MenuItem value={SilverJubileeParticipantCategory.GUEST}>
                  Guest
                </MenuItem>
                <MenuItem value={SilverJubileeParticipantCategory.BABY}>
                  Baby
                </MenuItem>
                <MenuItem
                  value={SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP}
                >
                  Lifetime Membership
                </MenuItem>
              </Select>
            </FormControl>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                value={editFormData.fullName || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    fullName: e.target.value,
                  })
                }
                fullWidth
                required
              />
              <TextField
                label="Phone Number"
                value={editFormData.phoneNumber || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    phoneNumber: e.target.value,
                  })
                }
                fullWidth
                required
              />
            </div>

            {/* Email and Alternative Phone */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Email"
                type="email"
                value={editFormData.email || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Alternative Phone"
                value={editFormData.alternativePhoneNumber || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    alternativePhoneNumber: e.target.value,
                  })
                }
                fullWidth
              />
            </div>

            {/* HSC Year and Group */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="HSC Passing Year"
                type="number"
                value={editFormData.hscPassingYear || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    hscPassingYear: parseInt(e.target.value) || 0,
                  })
                }
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select
                  value={editFormData.group || ""}
                  label="Group"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      group: e.target.value as SilverJubileeGroup,
                    })
                  }
                >
                  <MenuItem value={SilverJubileeGroup.SCIENCE}>
                    Science
                  </MenuItem>
                  <MenuItem value={SilverJubileeGroup.BUSINESS_STUDIES}>
                    Business Studies
                  </MenuItem>
                  <MenuItem value={SilverJubileeGroup.HUMANITIES}>
                    Humanities
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Gender and Blood Group */}
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={editFormData.gender || ""}
                  label="Gender"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      gender: e.target.value as SilverJubileeGender,
                    })
                  }
                >
                  <MenuItem value={SilverJubileeGender.MALE}>Male</MenuItem>
                  <MenuItem value={SilverJubileeGender.FEMALE}>Female</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={editFormData.bloodGroup || ""}
                  label="Blood Group"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      bloodGroup: e.target.value as SilverJubileeBloodGroup,
                    })
                  }
                >
                  <MenuItem value={SilverJubileeBloodGroup.DONT_KNOW}>
                    Don't know
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.A_POSITIVE}>
                    A+
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.B_POSITIVE}>
                    B+
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.O_POSITIVE}>
                    O+
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.AB_POSITIVE}>
                    AB+
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.AB_NEGATIVE}>
                    AB-
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.A_NEGATIVE}>
                    A-
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.B_NEGATIVE}>
                    B-
                  </MenuItem>
                  <MenuItem value={SilverJubileeBloodGroup.O_NEGATIVE}>
                    O-
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Payment Type and Amount */}
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={editFormData.paymentType || ""}
                  label="Payment Type"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      paymentType: e.target.value as SilverJubileePaymentType,
                    })
                  }
                >
                  <MenuItem value={SilverJubileePaymentType.BKASH}>
                    Bkash
                  </MenuItem>
                  <MenuItem value={SilverJubileePaymentType.NAGAD}>
                    Nagad
                  </MenuItem>
                  <MenuItem value={SilverJubileePaymentType.CASH}>
                    Cash
                  </MenuItem>
                  <MenuItem value={SilverJubileePaymentType.BANK_ACCOUNT}>
                    Bank Account
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Amount"
                type="number"
                value={editFormData.amount || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth
                required
              />
            </div>

            {/* Comments */}
            <TextField
              label="Comments"
              value={editFormData.comments || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, comments: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />

            {/* Parents Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                Parents Information
              </h3>

              {/* Father's Information */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <TextField
                  label="Father's Name"
                  value={editFormData.fatherName || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      fatherName: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Father's Phone"
                  value={editFormData.fatherPhoneNumber || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      fatherPhoneNumber: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Father's Occupation"
                  value={editFormData.fatherOccupation || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      fatherOccupation: e.target.value,
                    })
                  }
                  fullWidth
                />
              </div>

              {/* Mother's Information */}
              <div className="grid grid-cols-3 gap-4">
                <TextField
                  label="Mother's Name"
                  value={editFormData.motherName || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      motherName: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Mother's Phone"
                  value={editFormData.motherPhoneNumber || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      motherPhoneNumber: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Mother's Occupation"
                  value={editFormData.motherOccupation || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      motherOccupation: e.target.value,
                    })
                  }
                  fullWidth
                />
              </div>
            </div>

            {/* Guest/Baby Information (if applicable) */}
            {(editFormData.participantCategory ===
              SilverJubileeParticipantCategory.GUEST ||
              editFormData.participantCategory ===
                SilverJubileeParticipantCategory.BABY) && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {editFormData.participantCategory ===
                  SilverJubileeParticipantCategory.GUEST
                    ? "Guest Information"
                    : "Baby Information"}
                </h3>

                {/* Main Participant Batch and Group */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <TextField
                    label="Main Participant Batch"
                    type="number"
                    value={editFormData.mainParticipantBatch || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mainParticipantBatch: parseInt(e.target.value) || 0,
                      })
                    }
                    fullWidth
                    required
                  />
                  <FormControl fullWidth>
                    <InputLabel>Main Participant Group</InputLabel>
                    <Select
                      value={editFormData.mainParticipantGroup || ""}
                      label="Main Participant Group"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          mainParticipantGroup: e.target
                            .value as SilverJubileeGroup,
                        })
                      }
                    >
                      <MenuItem value={SilverJubileeGroup.SCIENCE}>
                        Science
                      </MenuItem>
                      <MenuItem value={SilverJubileeGroup.BUSINESS_STUDIES}>
                        Business Studies
                      </MenuItem>
                      <MenuItem value={SilverJubileeGroup.HUMANITIES}>
                        Humanities
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* Main Participant Name and ID */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <TextField
                    label="Main Participant Name"
                    value={editFormData.mainParticipantName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mainParticipantName: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Main Participant ID"
                    value={editFormData.mainParticipantId || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mainParticipantId: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                </div>

                {/* Guest/Baby Name and Relation (for guests only) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <TextField
                    label={
                      editFormData.participantCategory ===
                      SilverJubileeParticipantCategory.GUEST
                        ? "Guest Name"
                        : "Baby Name"
                    }
                    value={
                      editFormData.participantCategory ===
                      SilverJubileeParticipantCategory.GUEST
                        ? editFormData.guestName || ""
                        : editFormData.babyName || ""
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        ...(editFormData.participantCategory ===
                        SilverJubileeParticipantCategory.GUEST
                          ? { guestName: e.target.value }
                          : { babyName: e.target.value }),
                      })
                    }
                    fullWidth
                    required
                  />
                  {editFormData.participantCategory ===
                    SilverJubileeParticipantCategory.GUEST && (
                    <TextField
                      label="Relation"
                      value={editFormData.relation || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          relation: e.target.value,
                        })
                      }
                      fullWidth
                      required
                      placeholder="e.g., Spouse, Friend"
                    />
                  )}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <TextField
                    label="Phone Number"
                    value={
                      editFormData.participantCategory ===
                      SilverJubileeParticipantCategory.GUEST
                        ? editFormData.guestMobileNumber || ""
                        : editFormData.babyPhone || ""
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        ...(editFormData.participantCategory ===
                        SilverJubileeParticipantCategory.GUEST
                          ? { guestMobileNumber: e.target.value }
                          : { babyPhone: e.target.value }),
                      })
                    }
                    fullWidth
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={editLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={20} /> : null}
          >
            {editLoading ? "Updating..." : "Update Participant"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Participant Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-red-600">
          Delete Silver Jubilee Participant
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700">
              Are you sure you want to delete this participant?
            </p>
            {participantToDelete && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800">
                  {participantToDelete.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {participantToDelete.email}
                </p>
                <p className="text-sm text-gray-600">
                  Category: {participantToDelete.participantCategory}
                </p>
              </div>
            )}
            <p className="text-sm text-red-600 font-medium">
              To confirm deletion, please type the participant's full name:{" "}
              <span className="font-bold">{participantToDelete?.fullName}</span>
            </p>
            <TextField
              label="Type full name to confirm"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              fullWidth
              placeholder={participantToDelete?.fullName || ""}
              autoFocus
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={!isDeleteEnabled || deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete Participant"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SilverJubileeParticipantsPage;
