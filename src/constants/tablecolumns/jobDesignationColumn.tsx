import { Column } from "../../types/component.types";
import { Idesignation } from "../../models/designation";

export const getJobDesignationColumns = (
  handleStatusToggle: (id: string) => void,
): Column<Idesignation>[] => [
  { key: "designation", label: "Designation" },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${
          item.status
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        {item.status ? "Active" : "Blocked"}
      </span>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (item) => (
      <button
        onClick={() => handleStatusToggle(item._id)}
        className={`px-3 py-1 rounded ${
          item.status ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {item.status ? "Block" : "Unblock"}
      </button>
    ),
  },
];
