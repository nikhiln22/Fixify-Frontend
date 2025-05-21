import { useState } from "react";
import { Column } from "../../types/component.types";
import { Idesignation } from "../../models/designation";
import Modal from "../../components/common/Modal";

export const getJobDesignationColumns = (
  handleStatusToggle: (id: string) => void,
): Column<Idesignation>[] => [
  {
    key: "_id",
    label: "Sl.no",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  },
  {
    key: "designation",
    label: "Designation",
    render: (item) => (
      <div className="flex items-center justify-center">{item.designation}</div>
    ),
  },
  {
    key: "Status",
    label: "Status",
    render: (item) => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            item.Status
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {item.Status ? "Active" : "InActive"}
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

        function closeModal() {
          setIsOpen(false);
        }

        function openModal() {
          setIsOpen(true);
        }

        const handleConfirm = () => {
          handleStatusToggle(item._id);
        };

        return (
          <div className="flex justify-center">
            <button
              onClick={openModal}
              className={`px-3 py-1 rounded ${
                item.Status ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              {item.Status ? "Block" : "Unblock"}
            </button>

            <Modal
              isOpen={isOpen}
              onClose={closeModal}
              title="Confirmation"
              confirmText="Confirm"
              cancelText="Cancel"
              onConfirm={handleConfirm}
              confirmButtonColor={item.Status ? "red" : "green"}
            >
              <p>
                Are you sure you want to {item.Status ? "block" : "unblock"} the
                designation "{item.designation}"?
              </p>
            </Modal>
          </div>
        );
      };
      return <ActionButton />;
    },
  },
];
