import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import { UserProfileSidebar } from "../../../components/user/UserProfileSidebar";
import { getBookingsColumns } from "../../../constants/tablecolumns/BookingsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import useBookings from "../../../hooks/useBookings";

const UserBookingsList: React.FC = () => {
  const itemsPerPage = 6;

  const {
    bookings,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    handleViewDetails,
  } = useBookings();

  const columns = getBookingsColumns(handleViewDetails);

  return (
    <UserLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0 p-12 pl-42">
          <UserProfileSidebar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-68 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="bg-white rounded-lg shadow">
              <Table
                data={bookings || []}
                columns={columns}
                currentPage={currentPage}
                loading={loading}
                pageSize={itemsPerPage}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserBookingsList;