import { useState } from "react";
import { Icategory } from "../../models/category";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

export const getCategoriesColumns = (
  handleStatusToggle: (id: string) => Promise<void>,
  onEditCategory: (category: Icategory) => void,
): Column<Icategory>[] => [
  {
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "image",
    label: "Category Image",
    render: (item) => (
      <div className="flex items-center justify-center">
        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name || "Category"}
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
    label: "Category Name",
    render: (item) => (
      <div className="text-center">{item?.name || "Untitled"}</div>
    ),
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
              onClick={() => onEditCategory(item)}
              className="px-4 py-1 text-xs min-w-[80px] bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit
            </Button>

            <Button
              onClick={openModal}
              className={`px-4 py-1 text-xs min-w-[80px] ${
                item?.status
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
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
                  category <strong>{item?.name || "this category"}</strong>?
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
