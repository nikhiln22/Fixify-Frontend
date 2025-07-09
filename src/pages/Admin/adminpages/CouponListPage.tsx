import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import Modal from "../../../components/common/Modal";
import { AddCoupon } from "../../../components/admin/AddCoupon";
import { Search } from "lucide-react";
import { showToast } from "../../../utils/toast";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import {
  addCoupon,
  updateCoupon,
  toggleCouponStatus,
  getAllCoupons,
} from "../../../services/admin.services";
import { ICoupon } from "../../../models/coupon";
import { getCouponColumns } from "../../../constants/tablecolumns/couponColumn";

export const CouponListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Coupons" },
    { value: "active", label: "Active Coupons" },
    { value: "inactive", label: "Inactive Coupons" },
  ];

  const fetchCouponsWithFilters = useCallback(
    async (page: number) => {
      console.log("Fetching coupons with filters:", {
        page,
        searchQuery,
        filterStatus,
      });

      return await getAllCoupons(page, searchQuery, filterStatus);
    },
    [searchQuery, filterStatus]
  );

  const {
    data: coupons,
    setData: setCoupons,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
  } = usePaginatedList(fetchCouponsWithFilters);

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
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleSubmitCoupon = async (couponData: any) => {
    setIsLoading(true);
    try {
      if (selectedCoupon) {
        const response = await updateCoupon(selectedCoupon._id, couponData);
        if (response && coupons) {
          setCoupons(
            coupons.map((coupon) =>
              coupon._id === selectedCoupon._id ? response.data : coupon
            )
          );
          showToast({
            message: "Coupon updated successfully",
            type: "success",
          });
        }
      } else {
        const response = await addCoupon(couponData);
        if (response && coupons) {
          const firstPageItems = [
            response.data,
            ...coupons.slice(0, itemsPerPage - 1),
          ];

          setCoupons(firstPageItems);

          if (currentPage !== 1) {
            setCurrentPage(1);
          }

          showToast({
            message: "Coupon added successfully",
            type: "success",
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedCoupon ? "updating" : "creating"} coupon:`,
        error
      );
      showToast({
        message: `Failed to ${selectedCoupon ? "update" : "add"} coupon`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (couponId: string) => {
    try {
      const result = await toggleCouponStatus(couponId);
      console.log("result from toggling the coupon status:", result);
      if (result) {
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon._id === couponId
              ? result.data || { ...coupon, status: !coupon.status }
              : coupon
          )
        );
      }

      const coupon = coupons.find((coup) => coup._id === couponId);
      const statusLabel = coupon?.status ? "blocked" : "unblocked";
      showToast({
        message: `Coupon ${statusLabel} successfully`,
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle coupon status:", error);
      showToast({
        message: "Failed to update coupon status",
        type: "error",
      });
      throw error;
    }
  };

  const columns = getCouponColumns(handleStatusToggle, handleOpenEditModal);

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Coupons</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search coupons..."
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
            <Button
              onClick={handleOpenAddModal}
              className="h-10 px-4 py-2 whitespace-nowrap"
            >
              Add Coupon
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Table
          data={coupons || []}
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
        title={selectedCoupon ? "Edit Coupon" : "Add Coupon"}
        className="max-w-4xl w-full mx-4"
      >
        <div className="w-full">
          <AddCoupon
            onSubmit={handleSubmitCoupon}
            onCancel={handleCloseModal}
            isLoading={isLoading}
            initialValues={
              selectedCoupon
                ? ({
                    _id: selectedCoupon._id,
                    code: selectedCoupon.code,
                    title: selectedCoupon.title,
                    description: selectedCoupon.description,
                    discount_type: selectedCoupon.discount_type,
                    discount_value: selectedCoupon.discount_value,
                    max_discount: selectedCoupon.max_discount,
                    min_booking_amount: selectedCoupon.min_booking_amount,
                    valid_until: selectedCoupon.valid_until
                      ? new Date(selectedCoupon.valid_until)
                          .toISOString()
                          .split("T")[0]
                      : undefined,
                  } as Partial<ICoupon>)
                : undefined
            }
            isEditing={!!selectedCoupon}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default CouponListPage;
