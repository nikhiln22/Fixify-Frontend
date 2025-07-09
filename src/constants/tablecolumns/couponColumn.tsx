import { useState } from "react";
import { ICoupon } from "../../models/coupon";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

export const getCouponColumns = (
  handleStatusToggle: (id: string) => Promise<void>,
  onEditCoupon: (offer: ICoupon) => void
): Column<ICoupon>[] => [
  {
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "code",
    label: "Coupon code",
    render: (item) => (
      <div className="text-center font-medium">{item?.code || "Untitled"}</div>
    ),
  },
  {
    key: "discount_value",
    label: "Discount",
    render: (item) => (
      <div className="text-center font-medium">
        {item?.discount_type === "percentage"
          ? `${item.discount_value}%`
          : `₹${item.discount_value}`}
        {item?.max_discount && (
          <div className="text-gray-500">Max: ₹{item.max_discount}</div>
        )}
      </div>
    ),
  },
  {
    key: "valid_until",
    label: "Valid Until",
    render: (item) => (
      <div className="text-center">
        {item?.valid_until ? (
          <div className="font-medium">
            {new Date(item.valid_until).toLocaleDateString("en-GB")}
          </div>
        ) : (
          <span className="text-gray-500">No Expiry</span>
        )}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => {
      const isExpired =
        item?.valid_until && new Date(item.valid_until) < new Date();
      const isManuallyActive = item?.status;

      let status = "Active";
      let colorClass = "bg-green-200 text-green-800";

      if (isExpired) {
        status = "Expired";
        colorClass = "bg-gray-200 text-gray-800";
      } else if (!isManuallyActive) {
        status = "Inactive";
        colorClass = "bg-red-200 text-red-800";
      }

      return (
        <div className="flex justify-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${colorClass}`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    key: "action",
    label: "Action",
    render: (item) => {
      if (!item) {
        return <div>Loading...</div>;
      }

      const isExpired =
        item?.valid_until && new Date(item.valid_until) < new Date();

      if (isExpired) {
        return <div></div>;
      }

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
              onClick={() => onEditCoupon(item)}
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
                  the coupon <strong>"{item?.title || "this coupon"}"</strong>?
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
