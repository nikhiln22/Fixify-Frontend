import { Column } from "../../types/component.types";
import { IWalletTransaction } from "../../models/walletTransaction";
import dayjs from "dayjs";

export const getWalletTransactionsColumns =
  (): Column<IWalletTransaction>[] => [
    {
      key: "_id",
      label: "Sl. No",
      render: (_, index) => (
        <div className="flex items-center justify-center">{index + 1}</div>
      ),
    },
    {
      key: "createdAt",
      label: "Date & Time",
      render: (item) => (
        <div className="text-center">
          {dayjs(item.createdAt).format("MMM DD, YYYY hh:mm A")}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <div
          className={`text-center font-semibold ${
            item.type === "Credit" ? "text-green-600" : "text-red-600"
          }`}
        >
          {item.type}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => (
        <div className="text-center font-medium">₹{item.amount.toFixed(2)}</div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item) => <div className="text-center">{item.description}</div>,
    },
    {
      key: "referenceId",
      label: "Reference ID",
      render: (item) => (
        <div className="text-center font-mono text-sm">
          {item.referenceId ? `#${item.referenceId.slice(-8).toUpperCase()}` : "—"}
        </div>
      ),
    },
  ];