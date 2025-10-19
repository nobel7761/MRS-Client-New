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

const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;

function getMuiDatatableOptions(
  downloadFileName: string,
  more?: MUIDataTableOptions
): MUIDataTableOptions {
  return {
    print: false,
    selectableRows: undefined,
    rowsPerPage: 75,
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

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

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

  // Edit User Handlers
  const handleEditClick = async (userId: string) => {
    try {
      const response = await directApi.get(`/user/${userId}`);
      const userData = response.data;
      setSelectedUser(userData);
      setEditFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || userData.phoneNumber || "",
        role: userData.role,
        status: userData.status,
        userType: userData.userType,
        membershipCategory:
          userData.membershipCategory || MembershipCategory.FREE,
      });
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    setEditLoading(true);
    try {
      await directApi.patch(`/user/${selectedUser._id}`, editFormData);
      toast.success("User updated successfully");
      setEditModalOpen(false);
      setSelectedUser(null);
      setEditFormData({});
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({});
  };

  // Delete User Handlers
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmName("");
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      await directApi.delete(`/user/${userToDelete._id}`);
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      setDeleteConfirmName("");
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
    setDeleteConfirmName("");
  };

  const isDeleteEnabled =
    userToDelete &&
    deleteConfirmName === `${userToDelete.firstName} ${userToDelete.lastName}`;

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

  // Add Actions column only for super admin
  if (isSuperAdmin) {
    columns.push({
      name: "_id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-2">
              {/* Edit Icon */}
              <IconButton
                onClick={() => handleEditClick(value)}
                size="small"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit User"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </IconButton>

              {/* Delete/Bin Icon */}
              <IconButton
                onClick={() => handleDeleteClick(rowData)}
                size="small"
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete User"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </IconButton>
            </div>
          );
        },
      },
    });
  }

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

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="First Name"
                value={editFormData.firstName || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    firstName: e.target.value,
                  })
                }
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={editFormData.lastName || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, lastName: e.target.value })
                }
                fullWidth
                required
              />
            </div>

            {/* Email and Phone */}
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
                label="Phone"
                value={editFormData.phone || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                fullWidth
              />
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editFormData.role || ""}
                  label="Role"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      role: e.target.value as UserRole,
                    })
                  }
                >
                  <MenuItem value={UserRole.USER}>User</MenuItem>
                  <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                  <MenuItem value={UserRole.SUPER_ADMIN}>Super Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status || ""}
                  label="Status"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value as UserStatus,
                    })
                  }
                >
                  <MenuItem value={UserStatus.ACTIVE}>Active</MenuItem>
                  <MenuItem value={UserStatus.INACTIVE}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* User Type and Membership Category */}
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={editFormData.userType || ""}
                  label="User Type"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      userType: e.target.value as UserType,
                    })
                  }
                >
                  <MenuItem value={UserType.OWNER}>Owner</MenuItem>
                  <MenuItem value={UserType.COLLECTOR}>Collector</MenuItem>
                  <MenuItem value={UserType.VISITOR}>Visitor</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Membership Category</InputLabel>
                <Select
                  value={
                    editFormData.membershipCategory || MembershipCategory.FREE
                  }
                  label="Membership Category"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      membershipCategory: e.target.value as MembershipCategory,
                    })
                  }
                >
                  <MenuItem value={MembershipCategory.FREE}>Free</MenuItem>
                  <MenuItem value={MembershipCategory.YEARLY}>Yearly</MenuItem>
                  <MenuItem value={MembershipCategory.PERMANENT}>
                    Permanent
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
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
            {editLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-red-600">Delete User</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700">
              Are you sure you want to delete this user?
            </p>
            {userToDelete && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800">
                  {userToDelete.firstName} {userToDelete.lastName}
                </p>
                <p className="text-sm text-gray-600">{userToDelete.email}</p>
              </div>
            )}
            <p className="text-sm text-red-600 font-medium">
              To confirm deletion, please type the user's full name:{" "}
              <span className="font-bold">
                {userToDelete?.firstName} {userToDelete?.lastName}
              </span>
            </p>
            <TextField
              label="Type full name to confirm"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              fullWidth
              placeholder={`${userToDelete?.firstName || ""} ${
                userToDelete?.lastName || ""
              }`}
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
            {deleteLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegisteredUsersPage;
