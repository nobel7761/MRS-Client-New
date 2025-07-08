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
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;

interface Category {
  _id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryRequest {
  name: string;
  order: number;
}

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (data: Partial<CreateCategoryRequest>) => Promise<void>;
  isEdit: boolean;
  submitting?: boolean;
}

const EditDialog = ({
  open,
  onClose,
  category,
  onSave,
  isEdit,
  submitting = false,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    order: 0,
  });

  useEffect(() => {
    if (category && isEdit) {
      setFormData({
        name: category.name,
        order: category.order,
      });
    } else {
      setFormData({
        name: "",
        order: 0,
      });
    }
  }, [category, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      // Don't close the dialog on error, let the user see the error message
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
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
  category: Category | null;
  onConfirm: () => Promise<void>;
}

const DeleteDialog = ({
  open,
  onClose,
  category,
  onConfirm,
}: DeleteDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [showFinalWarning, setShowFinalWarning] = useState(false);

  useEffect(() => {
    if (open) {
      setCategoryName("");
      setShowFinalWarning(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (categoryName !== category?.name) {
      toast.error("Category name does not match");
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
      console.error("Error deleting category:", error);
    }
  };

  const isContinueDisabled =
    !showFinalWarning && categoryName !== category?.name;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {showFinalWarning ? "Final Confirmation" : "Delete Category"}
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          {!showFinalWarning ? (
            <>
              <p className="text-gray-700">
                To delete the category "{category?.name}", please type the
                category name below:
              </p>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder={category?.name}
              />
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">⚠️ Warning</p>
              <p className="text-red-700">
                If you delete this category, all the corresponding FAQs will be
                deleted automatically. This action cannot be undone.
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
        noMatch: "No categories found",
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

const AdminCategoryComponent = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await client.get("/faqs-category");
      setData(response.data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch categories";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryRequest) => {
    try {
      const response = await client.post("/faqs-category", categoryData);
      toast.success("Category created successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error creating category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateCategory = async (
    id: string,
    updateData: Partial<CreateCategoryRequest>
  ) => {
    try {
      const response = await client.patch(`/faqs-category/${id}`, updateData);
      toast.success("Category updated successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error updating category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update category";
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await client.delete(`/faqs-category/${id}`);
      toast.success(response.data.message || "Category deleted successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setAddDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCreate = async (categoryData: Partial<CreateCategoryRequest>) => {
    try {
      setSubmitting(true);
      if (categoryData.name && categoryData.order !== undefined) {
        await createCategory({
          name: categoryData.name,
          order: categoryData.order,
        });
        await fetchData();
      }
    } catch (error) {
      console.error("Error in handleCreate:", error);
      // Don't re-throw the error to prevent the dialog from closing
      // The error is already handled in createCategory function
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (updateData: Partial<CreateCategoryRequest>) => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      await updateCategory(selectedCategory._id, updateData);
      await fetchData();
    } catch (error) {
      console.error("Error in handleUpdate:", error);
      // Don't re-throw the error to prevent the dialog from closing
      // The error is already handled in updateCategory function
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      await deleteCategory(selectedCategory._id);
      await fetchData();
    } catch (error) {
      console.error("Error in handleDeleteConfirm:", error);
      // Don't re-throw the error to prevent the dialog from closing
      // The error is already handled in deleteCategory function
    } finally {
      setSubmitting(false);
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
      name: "order",
      label: "Order",
      options: {
        filter: true,
        sort: true,
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
          const category = data[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category)}
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
              <h2 className="text-xl font-semibold text-gray-900">
                FAQ Categories
              </h2>
              {(user?.role === UserRole.SUPER_ADMIN ||
                user?.role === UserRole.ADMIN) && (
                <button
                  onClick={handleAdd}
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              )}
            </div>
            {data && data.length > 0 ? (
              <MUIDataTable
                title=""
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("faq-categories.csv")}
              />
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">No categories found</p>
                  {(user?.role === UserRole.SUPER_ADMIN ||
                    user?.role === UserRole.ADMIN) && (
                    <button
                      onClick={handleAdd}
                      className="mt-4 flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors mx-auto"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Your First Category</span>
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
        category={null}
        onSave={handleCreate}
        isEdit={false}
        submitting={submitting}
      />

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        category={selectedCategory}
        onSave={handleUpdate}
        isEdit={true}
        submitting={submitting}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        category={selectedCategory}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminCategoryComponent;
