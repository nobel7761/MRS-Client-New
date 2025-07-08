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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;

interface Category {
  _id: string;
  name: string;
  order: number;
}

interface FAQ {
  _id: string;
  categoryId: string;
  category?: Category;
  question: string;
  answer: string;
  order: number;
  showHomePage: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateFaqRequest {
  categoryId: string;
  question: string;
  answer: string;
  order: number;
  showHomePage: boolean;
}

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  faq: FAQ | null;
  onSave: (data: Partial<CreateFaqRequest>) => Promise<void>;
  isEdit: boolean;
  submitting?: boolean;
  categories: Category[];
}

const EditDialog = ({
  open,
  onClose,
  faq,
  onSave,
  isEdit,
  submitting = false,
  categories,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<CreateFaqRequest>({
    categoryId: "",
    question: "",
    answer: "",
    order: 0,
    showHomePage: false,
  });

  useEffect(() => {
    if (faq && isEdit) {
      setFormData({
        categoryId: faq.categoryId,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        showHomePage: faq.showHomePage,
      });
    } else {
      setFormData({
        categoryId: "",
        question: "",
        answer: "",
        order: 0,
        showHomePage: false,
      });
    }
  }, [faq, isEdit]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name as string]:
        target.type === "number" ? parseInt(value as string) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!formData.answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <FormControl fullWidth required>
            <InputLabel>Select Categories</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              label="Select Categories"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Type Question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Type Answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="showHomePage"
                checked={formData.showHomePage}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Show Home Page"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  faq: FAQ | null;
  onConfirm: () => Promise<void>;
}

const DeleteDialog = ({ open, onClose, faq, onConfirm }: DeleteDialogProps) => {
  const [faqQuestion, setFaqQuestion] = useState("");
  const [showFinalWarning, setShowFinalWarning] = useState(false);

  useEffect(() => {
    if (open) {
      setFaqQuestion("");
      setShowFinalWarning(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (faqQuestion !== faq?.question) {
      toast.error("FAQ question does not match");
      return;
    }

    if (!showFinalWarning) {
      setShowFinalWarning(true);
      return;
    }

    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const isContinueDisabled = !showFinalWarning && faqQuestion !== faq?.question;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {showFinalWarning ? "Final Confirmation" : "Delete FAQ"}
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          {!showFinalWarning ? (
            <>
              <p className="text-gray-700">
                To delete the FAQ "{faq?.question}", please type the FAQ
                question below:
              </p>
              <TextField
                fullWidth
                label="FAQ Question"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                placeholder={faq?.question}
              />
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">⚠️ Warning</p>
              <p className="text-red-700">
                This action will permanently delete the FAQ. This action cannot
                be undone.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isContinueDisabled}
        >
          {showFinalWarning ? "Delete Permanently" : "Continue"}
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
    selectableRows: "none",
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight: "400px",
    tableBodyMaxHeight: "400px",
    textLabels: {
      body: {
        noMatch: "No FAQs found",
        toolTip: "Sort",
        columnHeaderTooltip: (column) => `Sort for ${column.label}`,
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table",
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET",
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Table Columns",
      },
      selectedRows: {
        text: "row(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    },
    ...more,
  };
}

const AdminFaqsComponent = () => {
  const { user } = useAuth();
  const [data, setData] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faqsResponse, categoriesResponse] = await Promise.all([
        client.get("/faqs"),
        client.get("/faqs-category"),
      ]);
      setData(faqsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createFaq = async (faqData: CreateFaqRequest) => {
    try {
      const response = await client.post("/faqs", faqData);
      toast.success("FAQ created successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error creating FAQ:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create FAQ";
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateFaq = async (
    id: string,
    updateData: Partial<CreateFaqRequest>
  ) => {
    try {
      const response = await client.patch(`/faqs/${id}`, updateData);
      toast.success("FAQ updated successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update FAQ";
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const response = await client.delete(`/faqs/${id}`);
      toast.success(response.data.message || "FAQ deleted successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete FAQ";
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedFaq(null);
    setAddDialogOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setEditDialogOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFaq(faq);
    setDeleteDialogOpen(true);
  };

  const handleCreate = async (faqData: Partial<CreateFaqRequest>) => {
    try {
      setSubmitting(true);
      if (
        faqData.categoryId &&
        faqData.question &&
        faqData.answer &&
        faqData.order !== undefined &&
        faqData.showHomePage !== undefined
      ) {
        await createFaq({
          categoryId: faqData.categoryId,
          question: faqData.question,
          answer: faqData.answer,
          order: faqData.order,
          showHomePage: faqData.showHomePage,
        });
        await fetchData();
      }
    } catch (error) {
      console.error("Error in handleCreate:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (updateData: Partial<CreateFaqRequest>) => {
    if (!selectedFaq) return;

    try {
      setSubmitting(true);
      await updateFaq(selectedFaq._id, updateData);
      await fetchData();
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFaq) return;

    try {
      setSubmitting(true);
      await deleteFaq(selectedFaq._id);
      await fetchData();
    } catch (error) {
      console.error("Error in handleDeleteConfirm:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "categoryId.name",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (_, tableMeta) => {
          const faq = data[tableMeta.rowIndex];
          return typeof faq.categoryId === "object" &&
            (faq.categoryId as { name?: string }).name
            ? (faq.categoryId as { name?: string }).name
            : "N/A";
        },
      },
    },
    {
      name: "question",
      label: "Question",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <div className="max-w-xs truncate" title={value}>
            {value}
          </div>
        ),
      },
    },
    {
      name: "answer",
      label: "Answer",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRender: (value: string) => (
          <div className="max-w-xs truncate" title={value}>
            {value}
          </div>
        ),
      },
    },
    {
      name: "order",
      label: "Order",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "showHomePage",
      label: "Show Home Page",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: boolean) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        ),
      },
    },
  ];

  if (user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN) {
    columns.push({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        display: true,
        customBodyRender: (_, tableMeta) => {
          const faq = data[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(faq)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq)}
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
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">All FAQs</h2>
              {(user?.role === UserRole.SUPER_ADMIN ||
                user?.role === UserRole.ADMIN) && (
                <button
                  onClick={handleAdd}
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              )}
            </div>
            {data && data.length > 0 ? (
              <MUIDataTable
                title=""
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("faqs.csv")}
              />
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">No FAQs found</p>
                  {(user?.role === UserRole.SUPER_ADMIN ||
                    user?.role === UserRole.ADMIN) && (
                    <button
                      onClick={handleAdd}
                      className="mt-4 flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors mx-auto"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Your First FAQ</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <EditDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        faq={null}
        onSave={handleCreate}
        isEdit={false}
        submitting={submitting}
        categories={categories}
      />

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        faq={selectedFaq}
        onSave={handleUpdate}
        isEdit={true}
        submitting={submitting}
        categories={categories}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        faq={selectedFaq}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminFaqsComponent;
