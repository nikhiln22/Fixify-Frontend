import { useState } from "react";
import { ISubscriptionPlan } from "../../models/subscriptionPlan";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

export const getSubscriptionPlanColumns = (
  handleStatusToggle: (id: string) => Promise<void>,
  onEditSubscriptionPlan: (subscriptionPlan: ISubscriptionPlan) => void
): Column<ISubscriptionPlan>[] => [
  {
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "planName",
    label: "Plan Name",
    render: (item) => (
      <div className="text-center font-medium">
        {item?.planName || "Untitled"}
      </div>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (item) => (
      <div className="text-center font-medium">₹{item?.price || 0}</div>
    ),
  },
  {
    key: "commissionRate",
    label: "Commission Rate",
    render: (item) => (
      <div className="text-center font-medium">
        {item?.commissionRate || 0}%
      </div>
    ),
  },
  {
    key: "WalletCreditDelay",
    label: "Credit Delay",
    render: (item) => (
      <div className="text-center font-medium">
        {item?.WalletCreditDelay || 0} Days
      </div>
    ),
  },
  {
    key: "durationInMonths",
    label: "Duration",
    render: (item) => {
      const duration = item?.durationInMonths || 0;
      const displayText =
        duration === 0
          ? "Lifetime"
          : `${duration} Month${duration === 1 ? "" : "s"}`;

      return <div className="text-center font-medium">{displayText}</div>;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            item?.status
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {item?.status ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (item) => {
      const ActionButton = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [isProcessing, setIsProcessing] = useState(false);

        const openModal = () => setIsOpen(true);
        const closeModal = () => {
          if (!isProcessing) {
            setIsOpen(false);
          }
        };

        const handleConfirm = async () => {
          setIsProcessing(true);
          try {
            await handleStatusToggle(item._id);
            setIsOpen(false);
          } finally {
            setIsProcessing(false);
          }
        };

        return (
          <div className="flex justify-center space-x-3">
            <Button
              onClick={() => onEditSubscriptionPlan(item)}
              className="px-4 py-1 text-xs w-20 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit
            </Button>

            <Button
              onClick={openModal}
              className={`px-4 py-1 text-xs w-20 ${
                item?.status
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {item?.status ? "Block" : "Unblock"}
            </Button>

            <Modal
              isOpen={isOpen}
              onClose={closeModal}
              title="Confirmation"
              confirmText={isProcessing ? "Processing..." : "Confirm"}
              cancelText="Cancel"
              onConfirm={handleConfirm}
              confirmButtonColor={item?.status ? "red" : "green"}
            >
              {isProcessing ? (
                <p className="text-center py-4">Processing your request...</p>
              ) : (
                <p>
                  Are you sure you want to {item?.status ? "block" : "unblock"}{" "}
                  the Subscription Plan{" "}
                  <strong>"{item?.planName || "this plan"}"</strong>?
                </p>
              )}
            </Modal>
          </div>
        );
      };
      return <ActionButton />;
    },
  },
];
