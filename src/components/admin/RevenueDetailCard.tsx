import React from "react";
import { User, Wrench, Building, IndianRupee, Calendar } from "lucide-react";

interface RevenueDetailCardProps {
  totalAmount: number;
  fixifyShare: number;
  technicianShare: number;
  technicianPaid: boolean;
  technicianPaidAt?: Date;
  creditReleaseDate?: Date;
}

export const RevenueDetailCard: React.FC<RevenueDetailCardProps> = ({
  totalAmount,
  fixifyShare,
  technicianShare,
  technicianPaid,
  technicianPaidAt,
  creditReleaseDate,
}) => {
  const revenuePercentage = Math.round((fixifyShare / totalAmount) * 100);
  const technicianPercentage = Math.round(
    (technicianShare / totalAmount) * 100
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-full">
            <IndianRupee className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Revenue Details
            </h2>
            <p className="text-sm text-gray-500">
              Payment breakdown and revenue share
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Revenue Breakdown
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Fixify Share
                  </p>
                  <p className="text-xs text-gray-500">
                    {revenuePercentage}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  ₹{fixifyShare}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 bg-purple-100 rounded-full">
                  <Wrench className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Technician Share
                  </p>
                  <p className="text-xs text-gray-500">
                    {technicianPercentage}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-purple-600">
                  ₹{technicianShare}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Technician Payment
          </h3>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-8 w-8 bg-gray-100 rounded-full">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  Payment Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    technicianPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {technicianPaid ? "Paid" : "Pending"}
                </span>
              </div>

              {technicianPaid && technicianPaidAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Paid on:{" "}
                  {new Date(technicianPaidAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}

              {!technicianPaid && creditReleaseDate && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center justify-center h-4 w-4 bg-orange-100 rounded-full">
                    <Calendar className="h-3 w-3 text-orange-600" />
                  </div>
                  <p className="text-xs text-orange-600 font-medium">
                    Credit Release Date:{" "}
                    {new Date(creditReleaseDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
