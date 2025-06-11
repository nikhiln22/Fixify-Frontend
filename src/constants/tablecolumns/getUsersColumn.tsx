import { useState } from "react";
import { Iuser } from "../../models/user";
import { Column } from "../../types/component.types";
import Modal from "../../components/common/Modal";

export const getUsersColumns = (
  handleStatusToggle: (id: string) => void,
): Column<Iuser>[] => [
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
    label: "Email",
    render: (item) => <div className="text-center">{item.email}</div>,
  },
  {
    key: "phone",
    label: "Phone",
    render: (item) => <div className="text-center">{item.phone}</div>,
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            item.status
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {item.status ? "Active" : "InActive"}
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

        return (
          <div className="flex justify-center">
            <button
              onClick={openModal}
              className={`px-3 py-1 rounded ${
                item.status ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              {item.status ? "Block" : "UnBlock"}
            </button>

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
