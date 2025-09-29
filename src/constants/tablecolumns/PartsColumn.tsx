import { useState } from "react";
import { IPart } from "../../models/parts";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

export const getPartsColumns = (
  handleStatusToggle: (id: string) => Promise<void>,
  onEditService: (part: IPart) => void
): Column<IPart>[] => [
  {
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "name",
    label: "Part Name",
    render: (item) => (
      <div className="text-center">{item?.name || "Untitled"}</div>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (item) => (
      <div className="text-center font-medium">{item?.price}</div>
    ),
  },
  {
    key: "services",
    label: "Services",
    render: (item) => (
      <div className="text-center">
        {item?.services && item.services.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1">
            {item.services.slice(0, 2).map((service, index) => (
              <span
                key={service._id || index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {service.name}
              </span>
            ))}
            {item.services.length > 2 && (
              <span
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                title={item.services
                  .slice(2)
                  .map((s) => s.name)
                  .join(", ")}
              >
                +{item.services.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No services</span>
        )}
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
                  {item?.status === "Active" ? "block" : "unblock"} part{" "}
                  <strong>{item?.name || "this Part"}</strong>?
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
