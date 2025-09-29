import React from "react";
import { AdminPrivateRoute } from "./PrivateRoutes";
import { AdminPublicRoute } from "./PublicRoutes";
import { Route, Routes } from "react-router-dom";
import { AdminLogin } from "../pages/Admin/auth/AdminLogin";
import { AdminDashboard } from "../pages/Admin/adminpages/AdminDashboard";
import { JobDesignationListPage } from "../pages/Admin/adminpages/JobDesignationListPage";
import { UserListPage } from "../pages/Admin/adminpages/UserListPage";
import { ApplicantListPage } from "../pages/Admin/adminpages/ApplicantListPage";
import { ApplicantDetails } from "../pages/Admin/adminpages/ApplicantsDetails";
import { CategoryListPage } from "../pages/Admin/adminpages/CategoryListPage";
import { ServiceListPage } from "../pages/Admin/adminpages/ServiceListPage";
import { TechnicianListPage } from "../pages/Admin/adminpages/TechnicianListPage";
import { PageNotFound } from "../components/common/PageNotFound";
import { BookingsListPage } from "../pages/Admin/adminpages/BookingsListPage";
import { BookingDetailPage } from "../pages/Admin/adminpages/BookingDetailPage";
import { OfferListPage } from "../pages/Admin/adminpages/OfferListPage";
import { CouponListPage } from "../pages/Admin/adminpages/CouponListPage";
import { SubscriptionPlan } from "../pages/Admin/adminpages/SubscriptionPlan";
import { SubscriptionHistory } from "../pages/Admin/adminpages/SubscriptionHistory";
import { TechnicianDetails } from "../pages/Admin/adminpages/TechnicianDetailPage";
import { PartListPage } from "../pages/Admin/adminpages/PartListPage";

export const AdminRoutes: React.FC = () => {
  const user: string = "Admin";

  return (
    <Routes>
      <Route element={<AdminPublicRoute />}>
        <Route path="login" element={<AdminLogin />} />
      </Route>

      <Route element={<AdminPrivateRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="jobdesignations" element={<JobDesignationListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="technicians" element={<TechnicianListPage />} />
        <Route
          path="technicians/:technicianId"
          element={<TechnicianDetails />}
        />
        <Route path="applicants" element={<ApplicantListPage />} />
        <Route path="applicants/:applicantId" element={<ApplicantDetails />} />
        <Route path="categories" element={<CategoryListPage />} />
        <Route path="services" element={<ServiceListPage />} />
        <Route path="parts" element={<PartListPage />} />
        <Route path="bookings" element={<BookingsListPage />} />
        <Route path="bookings/:id" element={<BookingDetailPage />} />
        <Route path="offers" element={<OfferListPage />} />
        <Route path="coupons" element={<CouponListPage />} />
        <Route path="subscriptionplans" element={<SubscriptionPlan />} />
        <Route path="subscriptionhistory" element={<SubscriptionHistory />} />
      </Route>

      <Route
        path="*"
        element={<PageNotFound userName={user} userRole="ADMIN" />}
      />
    </Routes>
  );
};
