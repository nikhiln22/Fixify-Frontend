import { ISubscriptionPlanHistory } from "../../models/subscriptionPlanHistory";
import { Column } from "../../types/component.types";

export const getSubscriptionPlanHistoryColumns = (options?: {
  showTechnicianName?: boolean;
}): Column<ISubscriptionPlanHistory>[] => {
  const { showTechnicianName = true } = options || {};

  const columns: Column<ISubscriptionPlanHistory>[] = [];

  columns.push({
    key: "_id",
    label: "Sl. No",
    render: (_, index) => (
      <div className="flex items-center justify-center">{index + 1}</div>
    ),
  });

  if (showTechnicianName) {
    columns.push({
      key: "technicianId",
      label: "Technician Name",
      render: (item) => (
        <div className="text-center font-medium">
          {item?.technicianId?.username || "Untitled"}
        </div>
      ),
    });
  }
  columns.push(
    {
      key: "subscriptionPlanId",
      label: "Plan Name",
      render: (item) => (
        <div className="text-center font-medium">
          {item?.subscriptionPlanId.planName || "Untitled"}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount paid",
      render: (item) => (
        <div className="text-center font-medium">₹{item?.amount || 0}</div>
      ),
    },
    {
      key: "subscriptionPlanId",
      label: "Commission Rate",
      render: (item) => (
        <div className="text-center font-medium">
          {item?.subscriptionPlanId.commissionRate || "N/A"}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Start Date",
      render: (item) => {
        if (!item?.createdAt) {
          return <div className="text-center font-medium">N/A</div>;
        }

        const startDate = new Date(item.createdAt);
        const formattedDate = startDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div className="text-center font-medium">{formattedDate}</div>;
      },
    },
    {
      key: "subscriptionPlanId",
      label: "Expires At",
      render: (item) => {
        const durationInMonths = item?.subscriptionPlanId?.durationInMonths;

        if (!durationInMonths || durationInMonths === 0) {
          if (item.status === "Expired") {
            return <div className="text-center font-medium">Upgraded</div>;
          }
          return <div className="text-center font-medium">Lifetime</div>;
        }

        if (!item?.createdAt) {
          return <div className="text-center font-medium">N/A</div>;
        }

        const startDate = new Date(item.createdAt);
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);

        const formattedExpiryDate = expiryDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return (
          <div className="text-center font-medium">{formattedExpiryDate}</div>
        );
      },
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
            {item?.status || "Unknown"}
          </span>
        </div>
      ),
    }
  );

  return columns;
};
