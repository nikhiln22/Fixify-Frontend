import { useState } from "react";
import { toggleCouponStatus } from "../services/admin.services";
import { getAllCoupons } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { ICoupon } from "../models/coupon";

const useCoupons = () => {
  const {
    data: services,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<ICoupon>(getAllCoupons);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );

  const handleStatusToggle = async (couponId: string) => {
    setStatusUpdateLoading(couponId);
    try {
      console.log("toggling the service status");
      const result = await toggleCouponStatus(couponId);
      console.log("result from the useService hook");
      if (result) {
        setData((prevServices) =>
          prevServices.map((coupon) =>
            coupon._id === couponId
              ? result.data || { ...coupon, status: coupon.status }
              : coupon
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle service status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    services,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    handleStatusToggle,
    statusUpdateLoading,
  };
};

export default useCoupons;
