import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/useRedux";
import { showToast } from "../../../utils/toast";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import { AddressCard } from "../../../components/user/AddressCard";
import TechnicianCard from "../../../components/user/TechnicianCard";
import { UserTimeSlotSelection } from "../../../components/user/UserTimeSlotSelection";
import { BookingSummary } from "../../../components/user/BookingSummary";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "../../../components/user/PaymentMethodSelector";
import Button from "../../../components/common/Button";
import { getAvailableTimeSlots } from "../../../services/timeSlotService";
import { applyBestOffer } from "../../../services/offerService";
import {
  getEligibleCoupons,
  applyCoupon,
} from "../../../services/couponService";
import { bookService } from "../../../services/bookingService";
import { ITimeSlot } from "../../../models/timeslot";
import {
  CreateBookingRequest,
  OfferData,
  CouponData,
} from "../../../types/user.types";
import { CouponModal } from "../../../components/user/CouponModal";
import {
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  clearCouponData,
} from "../../../redux/slices/couponSlice";
import technicianBanner from "../../../assets/technician Banner.png";
import { setBookingData } from "../../../redux/slices/bookingSlice";
import { setOfferData } from "../../../redux/slices/offerSlice"; // ✅ added import
import { CheckCircle } from "lucide-react";

export const UserBooking: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { service, address, technician, selectedSlot } = useAppSelector(
    (state) => state.booking
  );
  const { appliedCoupon } = useAppSelector((state) => state.coupon);

  const { currentOffer } = useAppSelector((state) => state.offer);

  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [isLoadingOffer, setIsLoadingOffer] = useState(true);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const [eligibleCoupons, setEligibleCoupons] = useState<CouponData[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  useEffect(() => {
    if (!service || !address || !technician) {
      showToast({
        message: "Please select a service and technician first",
        type: "warning",
      });
      navigate("/user/services");
    }
  }, [service, address, technician, navigate]);

  console.log("technician data in the user booking:", technician);

  useEffect(() => {
    if (
      appliedCoupon &&
      appliedCoupon.serviceId &&
      service &&
      appliedCoupon.serviceId !== service._id
    ) {
      dispatch(clearCouponData());
    }
  }, [service, appliedCoupon, dispatch]);

  useEffect(() => {
    const checkOffers = async () => {
      if (service) {
        if (service.serviceType === "fixed" && service.price) {
          if (currentOffer?.offerId) {
            console.log("Offer already applied, skipping fetch");
            setIsLoadingOffer(false);
            return;
          }

          try {
            setIsLoadingOffer(true);

            const offerResponse = await applyBestOffer(
              service._id,
              service.price
            );
            console.log("Offer response in UserBooking:", offerResponse);

            if (offerResponse?.success && offerResponse.data) {
              const newOffer: OfferData = {
                offerId: offerResponse.data.offerId,
                offerApplied: offerResponse.data.offerApplied,
                offerName: offerResponse.data.offerName,
                discountAmount: offerResponse.data.discountAmount,
                finalAmount: offerResponse.data.finalAmount,
                discountValue: offerResponse.data.discountValue,
                maxDiscount: offerResponse.data.maxDiscount,
                discountType: offerResponse.data.discountType,
                offerType: offerResponse.data.offerType,
                minBookingAmount: offerResponse.data.minBookingAmount,
              };
              dispatch(setOfferData(newOffer));
            }
          } catch (error) {
            console.log("Error occurred while fetching offers:", error);
          } finally {
            setIsLoadingOffer(false);
          }
        } else {
          setIsLoadingOffer(false);
          console.log(
            "Skipping offers for HOURLY service - will apply after completion"
          );
        }
      }
    };

    checkOffers();
  }, [service, currentOffer, dispatch]);

  const handleFetchCoupons = async () => {
    console.log("Fetching eligible coupons...");

    if (!service?._id) {
      console.log("No service ID found");
      return;
    }

    try {
      setIsLoadingCoupons(true);
      console.log("Fetching eligible coupons for service:", service._id);

      const couponResponse = await getEligibleCoupons(service._id);
      console.log("Eligible coupons response:", couponResponse);

      if (couponResponse?.success && couponResponse.data) {
        setEligibleCoupons(couponResponse.data);
        setIsCouponModalOpen(true);
        console.log("Coupons stored in local state:", couponResponse.data);
      } else {
        showToast({
          message: "No coupons available for this service",
          type: "info",
        });
      }
    } catch (error) {
      console.log("Error fetching eligible coupons:", error);
      showToast({
        message: "Failed to fetch coupons",
        type: "error",
      });
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleApplyCoupon = async (
    newCoupon: CouponData,
    currentCoupon: CouponData | null = null
  ) => {
    if (!service) return;

    try {
      console.log("Applying coupon:", newCoupon);
      console.log("Current coupon:", currentCoupon);
      const response = await applyCoupon(service._id, newCoupon.couponId);
      console.log("Apply coupon response:", response);

      if (response?.success && response.data) {
        dispatch(
          applyCouponAction({
            ...newCoupon,
            serviceId: service._id,
            discountAmount: response.data.discountAmount,
            finalAmount: response.data.finalAmount,
            couponId: newCoupon.couponId,
          })
        );

        showToast({
          message: response.message,
          type: "success",
        });
      } else {
        showToast({
          message: response?.message || "Failed to apply coupon",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      showToast({
        message: "Failed to apply coupon. Please try again.",
        type: "error",
      });
    }
  };

  const handleRemoveCoupon = () => {
    if (!appliedCoupon) return;
    dispatch(removeCouponAction());
    showToast({
      message: "Coupon removed successfully",
      type: "success",
    });
  };

  const handleCloseCouponModal = () => {
    setIsCouponModalOpen(false);
  };

  const fetchTimeSlots = async () => {
    if (!technician) return;

    try {
      setIsLoadingSlots(true);
      const response = await getAvailableTimeSlots(technician._id, false);

      console.log(
        "reseponse forthe avilable time slots in the user booking page:",
        response.data
      );

      if (response.success) {
        setTimeSlots(response.data || []);
        setIsSlotModalOpen(true);
      } else {
        showToast({
          message: "Failed to fetch available time slots",
          type: "error",
        });
      }
    } catch (error) {
      console.log(
        "error occured while fetching the available time slots:",
        error
      );
      showToast({
        message: "Failed to fetch available time slots. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: ITimeSlot | null) => {
    dispatch(setBookingData({ selectedSlot: slot }));
    showToast({ message: "Slot selected. Proceed to book now!", type: "info" });
  };

  const handleCloseSlotModal = () => {
    setIsSlotModalOpen(false);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmBooking = async () => {
    if (!service || !address || !technician) {
      showToast({
        message: "Missing booking information",
        type: "error",
      });
      return;
    }

    if (!selectedSlot) {
      showToast({
        message: "Please select a time slot first",
        type: "warning",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      showToast({
        message: "Please select a payment method",
        type: "warning",
      });
      return;
    }

    try {
      setIsConfirmingBooking(true);

      let finalBookingAmount: number = service.price || 0;

      if (currentOffer?.offerApplied && currentOffer.finalAmount) {
        finalBookingAmount = currentOffer.finalAmount;
      }

      if (appliedCoupon?.discountAmount) {
        finalBookingAmount = finalBookingAmount - appliedCoupon.discountAmount;
      }

      const bookingData: CreateBookingRequest = {
        technicianId: technician._id,
        serviceId: service._id,
        addressId: address._id,
        timeSlotId: selectedSlot._id,
        paymentMethod: selectedPaymentMethod,
        originalAmount: service.price,
        bookingAmount: finalBookingAmount,
        offerId: currentOffer?.offerId || "",
        couponId: appliedCoupon?.couponId || "",
      };

      if (service.serviceType === "hourly") {
        bookingData.bookingAmount = 300;
      }

      console.log("Sending booking data to backend:", bookingData);

      const response = await bookService(bookingData);

      if (response.success && response.data) {
        dispatch(clearCouponData());

        if (response.data.requiresPayment && response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          showToast({
            message: "Booking confirmed successfully!",
            type: "success",
          });

          navigate("/user/bookingsuccess", {
            state: {
              booking: response.data,
              paymentMethod: selectedPaymentMethod,
            },
          });
        }
      } else {
        showToast({
          message: response.message || "Failed to confirm booking",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      showToast({
        message: "Failed to confirm booking. Please try again.",
        type: "error",
      });
    } finally {
      setIsConfirmingBooking(false);
    }
  };

  const isBookingReady = selectedSlot && selectedPaymentMethod;

  if (!service || !address || !technician) {
    return null;
  }

  return (
    <UserLayout>
      <Banner backgroundImage={technicianBanner} height="400px" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Service Address
              </h2>
              <AddressCard address={address} showActions={false} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Selected Technician
              </h2>
              <TechnicianCard technician={technician} showBookButton={false} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Schedule Service
              </h2>

              {selectedSlot ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />

                        <h3 className="text-lg font-medium text-green-900">
                          Time Slot Selected
                        </h3>
                      </div>
                      <p className="text-green-800">
                        {selectedSlot.date} at {selectedSlot.startTime}
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsSlotModalOpen(true)}
                      variant="outline"
                      className="text-sm"
                    >
                      Change Slot
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Time Slot
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose from available time slots from {technician.username}
                  </p>
                  <Button
                    onClick={fetchTimeSlots}
                    disabled={isLoadingSlots}
                    isLoading={isLoadingSlots}
                    variant="primary"
                    className="px-8"
                  >
                    Select Time & Date
                  </Button>
                </div>
              )}
            </div>

            <PaymentMethodSelector
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              disabled={!selectedSlot}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              service={service}
              offerData={currentOffer}
              isLoadingOffer={isLoadingOffer}
              appliedCoupon={appliedCoupon}
              onConfirmBooking={handleConfirmBooking}
              onFetchCoupons={handleFetchCoupons}
              onRemoveCoupon={handleRemoveCoupon}
              isLoading={isConfirmingBooking}
              disabled={!isBookingReady}
              selectedPaymentMethod={selectedPaymentMethod}
              isLoadingCoupons={isLoadingCoupons}
              isFinalPayment={false}
            />
          </div>
        </div>
      </div>

      <UserTimeSlotSelection
        isOpen={isSlotModalOpen}
        onClose={handleCloseSlotModal}
        timeSlots={timeSlots}
        onSelectSlot={handleSlotSelect}
        selectedSlot={selectedSlot}
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={handleCloseCouponModal}
        coupons={eligibleCoupons}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />
    </UserLayout>
  );
};
