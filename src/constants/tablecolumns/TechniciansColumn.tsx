import { useState } from "react";
import { Itechnician } from "../../models/technician";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

export const getTechniciansColumns = (
  handleStatusToggle: (id: string) => void,
  handleView: (technician: Itechnician) => void
): Column<Itechnician>[] => [
  {
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "username",
    label: "Name",
    render: (item) => <div className="text-center">{item.username}</div>,
  },
  {
    key: "email",
    label: "Contact Info",
    render: (item) => (
      <div className="text-center">
        <div className="text-center">
          {item.email}, {item.phone}
        </div>
      </div>
    ),
  },
  {
    key: "Designation",
    label: "Designation",
    render: (item) => (
      <div className="text-center">
        {item.Designation?.designation || "N/A"}
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
            item.status === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {item.status}
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

        const openModal = () => setIsOpen(true);
        const closeModal = () => setIsOpen(false);

        const handleConfirm = () => {
          handleStatusToggle(item._id);
          closeModal();
        };

        const handleViewClick = () => {
          handleView(item);
        };

        return (
          <div className="flex justify-center gap-2">
            <Button
              onClick={openModal}
              className={`px-4 py-1 text-xs min-w-[80px] ${
                item?.status
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {item.status === "Active" ? "Block" : "UnBlock"}
            </Button>

            <Button
              onClick={handleViewClick}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              View
            </Button>

            <Modal
              isOpen={isOpen}
              onClose={closeModal}
              title="Confirmation"
              confirmText="Confirm"
              cancelText="Cancel"
              onConfirm={handleConfirm}
              confirmButtonColor={item.status ? "red" : "green"}
            >
              <p>
                Are you sure you want to {item.status ? "block" : "unblock"}{" "}
                user <strong>{item.username}</strong>?
              </p>
            </Modal>
          </div>
        );
      };

      return <ActionButton />;
    },
  },
];
