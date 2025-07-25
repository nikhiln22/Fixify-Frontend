import { ISubscriptionPlanHistory } from "../../models/subscriptionPlanHistory";
import { Column } from "../../types/component.types";

export const getSubscriptionPlanHistoryColumns =
  (): Column<ISubscriptionPlanHistory>[] => [
    {
      key: "_id",
      label: "Sl. No",
      render: (_, index) => (
        <div className="flex items-center justify-center">{index + 1}</div>
      ),
    },
    {
      key: "technicianId",
      label: "Technician Name",
      render: (item) => (
        <div className="text-center font-medium">
          {item?.technicianId.username || "Untitled"}
        </div>
      ),
    },
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
      key: "createdAt",
      label: "Start Date",
      render: (item) => (
        <div className="text-center font-medium">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      ),
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

        const startDate = new Date(item.createdAt);
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);

        return (
          <div className="text-center font-medium">
            {expiryDate.toLocaleDateString()}
          </div>
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
    },
  ];
