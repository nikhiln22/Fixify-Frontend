import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ISubscriptionPlan } from "../../models/subscriptionPlan";
import Button from "../../components/common/Button";

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect?: (plan: ISubscriptionPlan) => void;
  plans: ISubscriptionPlan[];
  loading?: boolean;
  error?: string | null;
  currentPlan?: string;
  title?: string;
}

const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  onPlanSelect,
  plans,
  loading = false,
  error = null,
  currentPlan,
  title = "Upgrade Your Plan",
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

  const handlePlanSelect = (plan: ISubscriptionPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
    onClose();
  };

  const isCurrentPlan = (planName: string): boolean => {
    return !!(
      currentPlan && planName.toLowerCase() === currentPlan.toLowerCase()
    );
  };

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading plans...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 text-sm font-medium mb-4">{error}</div>
        </div>
      );
    }

    if (plans.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No subscription plans available.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.planName);

          return (
            <div
              key={plan._id}
              className={`relative border rounded-lg p-6 transition-all duration-200 ${
                isCurrent
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Current
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {plan.planName.toUpperCase()}
                </h3>

                <div className="text-3xl font-bold text-blue-600 mb-4">
                  ₹{plan.price}
                  {plan.durationInMonths > 0 && (
                    <span className="text-sm text-gray-500 font-normal">
                      /{plan.durationInMonths} months
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Commission:</span>
                    <span className="font-medium">{plan.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {plan.durationInMonths > 0
                        ? `${plan.durationInMonths} months`
                        : "Lifetime"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profile Boost:</span>
                    <span className="font-medium">
                      {plan.profileBoost ? "Yes" : "No"}
                    </span>
                  </div>
                  {plan.WalletCreditDelay && (
                    <div className="flex justify-between">
                      <span>Credit Delay:</span>
                      <span className="font-medium">
                        {plan.WalletCreditDelay} days
                      </span>
                    </div>
                  )}
                </div>

                {plan.description && (
                  <p className="text-sm text-gray-700 mb-4">
                    {plan.description}
                  </p>
                )}

                <Button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCurrent}
                  variant={isCurrent ? "outline" : "primary"}
                  className="w-full"
                >
                  {isCurrent ? "Current Plan" : "Choose Plan"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
                className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white px-8 py-6 align-middle shadow-xl border border-gray-100"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative text-center mb-6">
                  <h3 className="text-2xl font-medium leading-tight text-gray-800">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="absolute top-0 right-0 text-black hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="text-gray-700">{renderContent()}</div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionPlansModal;
