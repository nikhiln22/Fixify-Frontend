import React from "react";
import { AdminPrivateRoute } from "./PrivateRoutes";
import { AdminPublicRoute } from "./PublicRoutes";
import { Route, Routes } from "react-router-dom";
import { AdminLogin } from "../pages/Admin/auth/AdminLogin";
import { AdminDashboard } from "../pages/Admin/adminpages/AdminDashboard";
import JobDesignationListPage from "../pages/Admin/adminpages/JobDesignationListPage";
import UserListPage from "../pages/Admin/adminpages/UserListPage";
import ApplicantListPage from "../pages/Admin/adminpages/ApplicantListPage";
import { ApplicantDetailsPreview } from "../pages/Admin/adminpages/ApplicantsDetailsPreview";
import { CategoryListPage } from "../pages/Admin/adminpages/CategoryListPage";
import { ServiceListPage } from "../pages/Admin/adminpages/ServiceListPage";
import { TechnicianListPage } from "../pages/Admin/adminpages/TechnicianListPage";
import { PageNotFound } from "../components/common/PageNotFound";
import { BookingsListPage } from "../pages/Admin/adminpages/BookingsListPage";
import { BookingDetailPage } from "../pages/Admin/adminpages/BookingDetailPage";
import OfferListPage from "../pages/Admin/adminpages/OfferListPage";
import { CouponListPage } from "../pages/Admin/adminpages/CouponListPage";
import { SubscriptionPlan } from "../pages/Admin/adminpages/SubscriptionPlan";
import { SubscriptionHistory } from "../pages/Admin/adminpages/SubscriptionHistory";

export const AdminRoutes: React.FC = () => {
  const user: string = "Admin";
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
        <Route path="/admin/technicianlist" element={<TechnicianListPage />} />
        <Route path="/admin/applicantslist" element={<ApplicantListPage />} />
        <Route
          path="/admin/applicant/:applicantId"
          element={<ApplicantDetailsPreview />}
        />
        <Route path="/admin/categories" element={<CategoryListPage />} />
        <Route path="/admin/services" element={<ServiceListPage />} />
        <Route path="/admin/bookings" element={<BookingsListPage />} />
        <Route path="/admin/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/admin/offers" element={<OfferListPage />} />
        <Route path="/admin/coupons" element={<CouponListPage />} />
        <Route path="/admin/subscriptionplans" element={<SubscriptionPlan />} />
      </Route>
      <Route
        path="/admin/subscriptionhistory"
        element={<SubscriptionHistory />}
      />
      <Route
        path="/admin/*"
        element={<PageNotFound userName={user} userRole="admin" />}
      />
    </Routes>
  );
};
