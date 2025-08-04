import { NextPage } from "next";
import AdminCategoryComponent from "@/components/pages/admin/faqs/AdminCategoryComponent";
import ProtectedRoute from "@/components/shared/custom-components/ProtectedRoute";
import { UserRole } from "@/types/auth";

const AdminCategoryPage: NextPage = () => {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <AdminCategoryComponent />
    </ProtectedRoute>
  );
};

export default AdminCategoryPage;
