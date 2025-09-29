import { Itechnician } from "../../models/technician";
import { Column } from "../../types/component.types";

export const getApplicantsColumns = (
  handleViewDetails: (id: string) => void
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
    label: "Applicant Name",
    render: (item) => (
      <div className="text-center truncate">
        {item.username.charAt(0).toUpperCase() + item.username.slice(1)}
      </div>
    ),
  },
  {
    key: "email",
    label: "Contact Info",
    render: (item) => (
      <div className="text-center">
        <div>
          {item.email},{item.phone}
        </div>
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Application Date",
    render: (item) => (
      <div className="text-center">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "N/A"}
      </div>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (item) => (
      <div className="flex justify-center">
        <button
          onClick={() => handleViewDetails(item._id)}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          View
        </button>
      </div>
    ),
  },
];
