import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import Modal from "../../../components/common/Modal";
import { AddSubscriptionPlan } from "../../../components/admin/AddSubscriptionPlan";
import { Search } from "lucide-react";
import { showToast } from "../../../utils/toast";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import {
  addSubscriptionPlan,
  updateSubscriptionPlan,
  toggleSubscriptionPlanStatus,
  getAllSubscriptionPlans,
} from "../../../services/subscriptionPlanService";
import { ISubscriptionPlan } from "../../../models/subscriptionPlan";
import { getSubscriptionPlanColumns } from "../../../constants/tablecolumns/SubscriptionPlanColumns";
import { Link } from "react-router-dom";

export const SubscriptionPlan: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] =
    useState<ISubscriptionPlan | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Plans" },
    { value: "active", label: "Active Plans" },
    { value: "inactive", label: "Inactive Plans" },
  ];

  const {
    data: subscriptionPlans,
    setData: setSubscriptionPlans,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    overview,
  } = usePaginatedList(
    getAllSubscriptionPlans,
    "admin",
    searchQuery,
    filterStatus,
    itemsPerPage
  );

  const overviewData = overview || {
    activeTechnicians: 0,
    paidSubscribers: 0,
    monthlyRevenue: 0,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Status filter changed to:", e.target.value);
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, setCurrentPage]);

  const handleOpenAddModal = () => {
    setSelectedSubscriptionPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subscriptionPlan: ISubscriptionPlan) => {
    setSelectedSubscriptionPlan(subscriptionPlan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscriptionPlan(null);
  };

  const handleSubmitSubscriptionPlan = async (subscriptionPlanData: any) => {
    setIsLoading(true);
    try {
      if (selectedSubscriptionPlan) {
        const response = await updateSubscriptionPlan(
          selectedSubscriptionPlan._id,
          subscriptionPlanData,
          "admin"
        );
        if (response && subscriptionPlans) {
          setSubscriptionPlans(
            subscriptionPlans.map((plan) =>
              plan._id === selectedSubscriptionPlan._id ? response.data : plan
            )
          );
          showToast({
            message: "Subscription plan updated successfully",
            type: "success",
          });
        }
      } else {
        const response = await addSubscriptionPlan(
          subscriptionPlanData,
          "admin"
        );
        if (response && subscriptionPlans) {
          const firstPageItems = [
            response.data,
            ...subscriptionPlans.slice(0, itemsPerPage - 1),
          ];

          setSubscriptionPlans(firstPageItems);

          if (currentPage !== 1) {
            setCurrentPage(1);
          }

          showToast({
            message: "Subscription plan added successfully",
            type: "success",
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedSubscriptionPlan ? "updating" : "creating"} subscription plan:`,
        error
      );
      showToast({
        message: `Failed to ${selectedSubscriptionPlan ? "update" : "add"} subscription plan`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (subscriptionPlanId: string) => {
    try {
      const result = await toggleSubscriptionPlanStatus(
        subscriptionPlanId,
        "admin"
      );
      console.log("result from toggling the subscription plan status:", result);
      if (result) {
        console.log("New status:", result.data.status);
        setSubscriptionPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan._id === subscriptionPlanId
              ? { ...plan, status: result.data.status }
              : plan
          )
        );
      }

      showToast({
        message: result.message,
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle subscription plan status:", error);
      showToast({
        message: "Failed to update subscription plan status",
        type: "error",
      });
      throw error;
    }
  };

  const columns = getSubscriptionPlanColumns(
    handleStatusToggle,
    handleOpenEditModal
  );

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Subscription Plans</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search subscription plans..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-48">
              <SelectField
                label=""
                name="statusFilter"
                value={filterStatus}
                onChange={handleStatusFilterChange}
                options={statusOptions}
                placeholder="Filter by status"
                className="mb-0"
              />
            </div>
            <Link to="/admin/subscriptionhistory">
              <Button
                variant="outline"
                className="h-10 px-4 py-2 whitespace-nowrap"
              >
                Subscription Plan History
              </Button>
            </Link>
            <Button
              onClick={handleOpenAddModal}
              className="h-10 px-4 py-2 whitespace-nowrap"
            >
              Add Subscription Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Active Technicians
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {overviewData.activeTechnicians}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Paid Subscribers
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {overviewData.paidSubscribers}
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">
              Monthly Revenue
            </h3>
            <p className="text-2xl font-bold text-pink-600">
              {" "}
              ₹ {overviewData.monthlyRevenue.toLocaleString("en-IN")}/-
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Table
          data={subscriptionPlans || []}
          columns={columns}
          currentPage={currentPage}
          loading={loading}
          pageSize={itemsPerPage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedSubscriptionPlan
            ? "Edit Subscription Plan"
            : "Add Subscription Plan"
        }
        className="max-w-4xl w-full mx-4"
      >
        <div className="w-full">
          <AddSubscriptionPlan
            onSubmit={handleSubmitSubscriptionPlan}
            onCancel={handleCloseModal}
            isLoading={isLoading}
            initialValues={
              selectedSubscriptionPlan
                ? {
                    _id: selectedSubscriptionPlan._id,
                    planName: selectedSubscriptionPlan.planName,
                    price: selectedSubscriptionPlan.price,
                    commissionRate: selectedSubscriptionPlan.commissionRate,
                    WalletCreditDelay:
                      selectedSubscriptionPlan.WalletCreditDelay,
                    durationInMonths: selectedSubscriptionPlan.durationInMonths,
                    description: selectedSubscriptionPlan.description,
                  }
                : undefined
            }
            isEditing={!!selectedSubscriptionPlan}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};
