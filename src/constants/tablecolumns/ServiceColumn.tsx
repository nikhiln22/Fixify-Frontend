import { useState } from "react";
import { IService } from "../../models/service";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

export const getServicesColumns = (
  handleStatusToggle: (id: string) => Promise<void>,
  onEditService: (service: IService) => void
): Column<IService>[] => [
  {
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "image",
    label: "Service Image",
    render: (item) => (
      <div className="flex items-center justify-center">
        {item?.image ? (
          <img
            src={buildCloudinaryUrl(item.image)}
            alt={item?.name || "Service"}
            className="w-12 h-12 rounded-md object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
    ),
  },
  {
    key: "name",
    label: "Service Name",
    render: (item) => (
      <div className="text-center">{item?.name || "Untitled"}</div>
    ),
  },
  {
    key: "serviceType",
    label: "Service Type",
    render: (item) => (
      <div className="text-center">{item?.serviceType || "Untitled"}</div>
    ),
  },
  {
    key: "category",
    label: "Category Name",
    render: (item) => (
      <div className="text-center">
        {item?.category?.name || "Uncategorized"}
      </div>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (item) => (
      <div className="text-center font-medium">
        {item?.serviceType === "hourly"
          ? item?.hourlyRate
            ? `${item.hourlyRate.toFixed(2)} / hr`
            : "N/A"
          : item?.price
            ? `${item.price.toFixed(2)}`
            : "N/A"}
      </div>
    ),
  },

  {
    key: "status",
    label: "Status",
    render: (item) => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            item?.status === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {item?.status === "Active" ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (item) => {
      if (!item) {
        return <div>Loading...</div>;
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
              onClick={() => onEditService(item)}
              className="px-4 py-1 text-xs w-20 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit
            </Button>
            <Button
              onClick={openModal}
              className={`px-4 py-1 text-xs w-20 ${
                item?.status === "Active"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {item?.status === "Active" ? "Block" : "Unblock"}
            </Button>
            <Modal
              isOpen={isOpen}
              onClose={closeModal}
              title="Confirmation"
              confirmText={isProcessing ? "Processing..." : "Confirm"}
              cancelText="Cancel"
              onConfirm={handleConfirm}
              confirmButtonColor={item?.status === "Blocked" ? "red" : "green"}
            >
              {isProcessing ? (
                <p className="text-center py-4">Processing your request...</p>
              ) : (
                <p>
                  Are you sure you want to{" "}
                  {item?.status === "Active" ? "block" : "unblock"} service{" "}
                  <strong>{item?.name || "this service"}</strong>?
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
