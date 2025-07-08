"use client";

import { useEffect, useState, Fragment } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import client from "@/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { Listbox, Transition } from "@headlessui/react";
import { FiChevronDown, FiEdit, FiTrash2 } from "react-icons/fi";
const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;

// Dropdown data constants (same as RepresentativeRegistration2026.tsx)
const hscYears = Array.from({ length: 25 }, (_, i) => 2003 + i);
const hscGroups = ["Science", "Business Studies", "Humanities"];
const genders = ["Male", "Female"];

interface Representative {
  _id: string;
  name: string;
  hscYear: number;
  hscGroup: string;
  gender: string;
  phone: string;
  facebookUrl: string;
  comments: string;
}

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  representative: Representative | null;
  onSave: (data: Partial<Representative>) => Promise<void>;
}

const EditDialog = ({
  open,
  onClose,
  representative,
  onSave,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Representative>>({});
  const [selectedHscYear, setSelectedHscYear] = useState<number | null>(null);
  const [selectedHscGroup, setSelectedHscGroup] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  useEffect(() => {
    if (representative) {
      setFormData(representative);
      setSelectedHscYear(representative.hscYear || null);
      setSelectedHscGroup(representative.hscGroup || null);
      setSelectedGender(representative.gender || null);
    }
  }, [representative]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHscYearChange = (value: number | null) => {
    setSelectedHscYear(value);
    setFormData((prev) => ({ ...prev, hscYear: value || 0 }));
  };

  const handleHscGroupChange = (value: string | null) => {
    setSelectedHscGroup(value);
    setFormData((prev) => ({ ...prev, hscGroup: value || "" }));
  };

  const handleGenderChange = (value: string | null) => {
    setSelectedGender(value);
    setFormData((prev) => ({ ...prev, gender: value || "" }));
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating representative:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Representative</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
          {/* HSC Year Dropdown */}
          <div>
            <label className="block text-gray-700 mb-2">HSC Year</label>
            <Listbox value={selectedHscYear} onChange={handleHscYearChange}>
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                  <span>{selectedHscYear || "Select HSC Year"}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                    {hscYears.map((year) => (
                      <Listbox.Option
                        key={year}
                        value={year}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-10 pr-4 ${
                            active ? "bg-primary text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {year}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* HSC Group Dropdown */}
          <div>
            <label className="block text-gray-700 mb-2">HSC Group</label>
            <Listbox value={selectedHscGroup} onChange={handleHscGroupChange}>
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                  <span>{selectedHscGroup || "Select HSC Group"}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                    {hscGroups.map((group) => (
                      <Listbox.Option
                        key={group}
                        value={group}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-10 pr-4 ${
                            active ? "bg-primary text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {group}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Gender Dropdown */}
          <div>
            <label className="block text-gray-700 mb-2">Gender</label>
            <Listbox value={selectedGender} onChange={handleGenderChange}>
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                  <span>{selectedGender || "Select Gender"}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                    {genders.map((gender) => (
                      <Listbox.Option
                        key={gender}
                        value={gender}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-10 pr-4 ${
                            active ? "bg-primary text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {gender}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Facebook URL"
            name="facebookUrl"
            value={formData.facebookUrl || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Comments"
            name="comments"
            multiline
            rows={4}
            value={formData.comments || ""}
            onChange={handleChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  phone: string;
  onConfirm: () => Promise<void>;
}

const DeleteDialog = ({
  open,
  onClose,
  phone,
  onConfirm,
}: DeleteDialogProps) => {
  const [confirmPhone, setConfirmPhone] = useState("");

  const handleConfirm = async () => {
    if (confirmPhone === phone) {
      try {
        await onConfirm();
        onClose();
      } catch (error) {
        console.error("Error deleting representative:", error);
      }
    } else {
      toast.error("Phone number does not match");
    }
  };

  const isPhoneMatch = confirmPhone === phone;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Representative</DialogTitle>
      <DialogContent>
        <div className="mt-4">
          <p className="mb-2">
            Please type the following phone number to confirm deletion:
          </p>
          <p className="mb-4 text-lg font-semibold text-red-600">{phone}</p>
          <TextField
            fullWidth
            label="Phone Number"
            value={confirmPhone}
            onChange={(e) => setConfirmPhone(e.target.value)}
            placeholder="Enter the phone number shown above"
            error={confirmPhone !== "" && !isPhoneMatch}
            helperText={
              confirmPhone !== "" && !isPhoneMatch
                ? "Phone number does not match"
                : ""
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={!isPhoneMatch}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export function getMuiDatatableOptions(
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

const RepresentativeRegistrationComponent = () => {
  const [data, setData] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] =
    useState<Representative | null>(null);

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/representative-collection`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching representative data:", error);
      toast.error("Failed to fetch representative data");
    } finally {
      setLoading(false);
    }
  };

  const updateRepresentative = async (
    id: string,
    updateData: Partial<Representative>
  ) => {
    // Ensure hscYear is sent as number to match backend schema
    const processedData = {
      ...updateData,
      hscYear: updateData.hscYear
        ? Number(updateData.hscYear)
        : updateData.hscYear,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/representative-collection/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(processedData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      toast.success("Representative updated successfully");
      return result;
    } catch (error) {
      console.error("Error updating representative:", error);
      toast.error("Failed to update representative");
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (representative: Representative) => {
    setSelectedRepresentative(representative);
    setEditDialogOpen(true);
  };

  const handleDelete = (representative: Representative) => {
    setSelectedRepresentative(representative);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async (updateData: Partial<Representative>) => {
    if (!selectedRepresentative) return;

    try {
      await updateRepresentative(selectedRepresentative._id, updateData);
      fetchData();
    } catch (error) {
      console.error("Error updating representative:", error);
      toast.error("Failed to update representative");
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRepresentative) return;

    try {
      await client.delete(
        `/representative-collection/${selectedRepresentative._id}`
      );
      toast.success("Representative deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting representative:", error);
      toast.error("Failed to delete representative");
      throw error;
    }
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "hscYear",
      label: "Batch",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "hscGroup",
      label: "Group",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "gender",
      label: "Gender",
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
      },
    },
    {
      name: "facebookUrl",
      label: "Facebook",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View Profile
          </a>
        ),
      },
    },
    {
      name: "comments",
      label: "Comments",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRender: (value: string) => value || "-",
      },
    },
  ];

  if (user?.role === UserRole.SUPER_ADMIN) {
    columns.push({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        display: true,
        customBodyRender: (_, tableMeta) => {
          const representative = data[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(representative)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(representative)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Delete"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
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
                title="Representative Submission List"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("representative-list.csv")}
              />
            )}
          </div>
        </div>
      </motion.div>

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        representative={selectedRepresentative}
        onSave={handleUpdate}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        phone={selectedRepresentative?.phone || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default RepresentativeRegistrationComponent;
