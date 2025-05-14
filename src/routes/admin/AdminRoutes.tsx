import React from "react";
import { AdminPrivateRoute } from "./AdminPrivateRoute";
import { AdminPublicRoute } from "./AdminPublicRoute";
import { Route, Routes } from "react-router-dom";
import { AdminLogin } from "../../pages/Admin/auth/AdminLogin";
import { AdminDashboard } from "../../pages/Admin/adminpages/AdminDashboard";
import JobDesignationListPage from "../../pages/Admin/adminpages/JobDesignationListPage";
import UserListPage from "../../pages/Admin/adminpages/UserListPage";
import ApplicantListPage from "../../pages/Admin/adminpages/ApplicantListPage";
import { ApplicantDetailsPreview } from "../../pages/Admin/adminpages/ApplicantsDetailsPreview";
import { CategoryListPage } from "../../pages/Admin/adminpages/CategoryListPage";
import { ServiceListPage } from "../../pages/Admin/adminpages/ServiceListPage";
export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* admin public routes */}
      <Route element={<AdminPublicRoute />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* admin private routes */}
      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/jobdesignations"
          element={<JobDesignationListPage />}
        />
        <Route path="/admin/userslist" element={<UserListPage />} />
        <Route path="/admin/applicantslist" element={<ApplicantListPage />} />
        <Route
          path="/admin/applicantdetailpreview"
          element={<ApplicantDetailsPreview />}
        />
        <Route path="/admin/categories" element={<CategoryListPage />} />
        <Route path="/admin/services" element={<ServiceListPage />} />
      </Route>
    </Routes>
  );
};
