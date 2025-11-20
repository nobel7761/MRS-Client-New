"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import MUIDataTableImport from "mui-datatables";
import { toast } from "react-toastify";
import { souvenirApi, Souvenir } from "@/lib/souvenirApi";
import { useRouter } from "next/navigation";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

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

const SouvenirList = () => {
  const [data, setData] = useState<Souvenir[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [souvenirToDelete, setSouvenirToDelete] = useState<Souvenir | null>(
    null
  );
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await souvenirApi.getAll();
      setData(response.souvenirs || []);
    } catch (error: any) {
      console.error("Error fetching souvenirs data:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch souvenirs data"
      );
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

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      "memory-writeup": "স্মৃতিচারণ",
      story: "গল্প",
      poem: "কবিতা",
      article: "প্রবন্ধ/নিবন্ধ",
      "batch-message": "শুভেচ্ছা বার্তা",
      "one-liner": "এক লাইনের বার্তা",
      artwork: "চিত্র/আর্টवर्क",
      "batch-photo": "ব্যাচ গ্রুপ ছবি",
      "old-campus-photo": "ক্যাম্পাস পুরোনো ছবি",
      "new-campus-photo": "ক্যাম্পাস নতুন ছবি",
      "humor-comic": "Humor / Comic Corner",
      "quote-thought": "Quote / Thought",
      "alumni-spotlight": "Alumni Spotlight Profile",
      "teacher-tribute": "Teacher Tribute",
      "interview-suggestion": "Interview Suggestion",
      "sponsor-message": "Sponsor Message",
    };
    return categoryMap[category] || category;
  };

  const handleViewClick = (id: string) => {
    router.push(`/admin/silver-jubilee/souvenir-management/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/silver-jubilee/souvenir-management/${id}/edit`);
  };

  const handleDeleteClick = (souvenir: Souvenir) => {
    setSouvenirToDelete(souvenir);
    setDeleteConfirmName("");
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!souvenirToDelete) return;

    if (deleteConfirmName.trim() !== souvenirToDelete.name.trim()) {
      toast.error("নাম মিলছে না। দয়া করে সঠিক নাম লিখুন।");
      return;
    }

    try {
      setDeleteLoading(true);
      await souvenirApi.delete(souvenirToDelete._id);
      toast.success("Souvenir সফলভাবে মুছে ফেলা হয়েছে");
      setDeleteModalOpen(false);
      setSouvenirToDelete(null);
      setDeleteConfirmName("");
      fetchData();
    } catch (error: any) {
      console.error("Error deleting souvenir:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete souvenir"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "batch",
      label: "Batch",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "group",
      label: "Group",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => {
          const groupMap: Record<string, string> = {
            science: "Science",
            "business-studies": "Business Studies",
            humanities: "Humanities",
          };
          return groupMap[value] || value || "-";
        },
      },
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => getCategoryLabel(value) || "-",
      },
    },
    {
      name: "createdAt",
      label: "Submission Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (value ? formatDate(value) : "-"),
      },
    },
    {
      name: "_id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string) => {
          return (
            <div className="flex items-center gap-3">
              {/* View Icon */}
              <FaEye
                className="text-blue-500 text-xl cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleViewClick(value)}
                title="View Souvenir"
              />

              {/* Edit Icon */}
              <FaEdit
                className="text-indigo-500 text-xl cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => handleEditClick(value)}
                title="Edit Souvenir"
              />

              {/* Delete Icon */}
              <MdDelete
                className="text-red-500 text-xl cursor-pointer hover:text-red-600 transition-colors"
                onClick={() => {
                  const souvenir = data.find((s) => s._id === value);
                  if (souvenir) handleDeleteClick(souvenir);
                }}
                title="Delete Souvenir"
              />
            </div>
          );
        },
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
                title="Souvenir Management"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("souvenirs_list.csv")}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => !deleteLoading && setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Souvenir</DialogTitle>
        <DialogContent>
          <div className="space-y-4 py-4">
            <p className="text-gray-700">
              আপনি কি নিশ্চিত যে আপনি এই souvenir মুছে ফেলতে চান?
            </p>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {souvenirToDelete?.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Category:</strong>{" "}
              {souvenirToDelete
                ? getCategoryLabel(souvenirToDelete.category)
                : ""}
            </p>
            <TextField
              fullWidth
              label="নাম লিখুন (Name)"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={souvenirToDelete?.name}
              variant="outlined"
              required
              disabled={deleteLoading}
              helperText="নিশ্চিত করতে দয়া করে সম্পূর্ণ নাম লিখুন"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteModalOpen(false);
              setDeleteConfirmName("");
            }}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading || deleteConfirmName.trim() === ""}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SouvenirList;
