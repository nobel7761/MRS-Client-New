import { NextPage } from "next";
import AdminFaqsComponent from "@/components/pages/admin/faqs/AdminFaqsComponent";
import ProtectedRoute from "@/components/shared/custom-components/ProtectedRoute";
import { UserRole } from "@/types/auth";

const AdminFaqsPage: NextPage = () => {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <AdminFaqsComponent />
    </ProtectedRoute>
  );
};

export default AdminFaqsPage;
