import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CouponModalProps } from "../../types/component.types";
import { CouponData } from "../../types/user.types";
import Button from "../common/Button";

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  coupons,
  onApplyCoupon,
  appliedCoupon,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  };

  const handleApplyCoupon = (coupon: CouponData) => {
    onApplyCoupon(coupon, appliedCoupon); 
    onClose();
  };

  const renderCouponAction = (coupon: CouponData) => {
    const isApplied = appliedCoupon && appliedCoupon.code === coupon.code;

    if (isApplied) {
      return (
        <div className="ml-4 py-2 px-4 text-sm bg-green-100 text-green-700 rounded border border-green-200 font-medium">
          APPLIED
        </div>
      );
    } else {
      return (
        <Button
          onClick={() => handleApplyCoupon(coupon)}
          variant="outline"
          className="ml-4 py-2 px-4 text-sm"
        >
          APPLY
        </Button>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9998]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white shadow-xl border border-gray-100"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Coupons
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {coupons && coupons.length > 0 ? (
                      coupons.map((coupon: CouponData, index: number) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-mono text-lg font-bold text-gray-800 mb-2">
                                {coupon.code}
                              </div>

                              <h3 className="font-semibold text-gray-900 mb-3 text-base">
                                {coupon.title}
                              </h3>

                              {coupon.discountType === "percentage" &&
                                coupon.maxDiscount && (
                                  <div className="text-sm text-gray-600">
                                    Up to ₹{coupon.maxDiscount} off
                                  </div>
                                )}
                            </div>

                            {renderCouponAction(coupon)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No coupons available for this booking</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
