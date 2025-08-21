import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { getBookings } from "../../../services/commonServices";
import SelectField from "../../../components/common/SelectField";
import { Search } from "lucide-react";
import { getBookingsColumns } from "../../../constants/tablecolumns/BookingsColumn";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import useBookings from "../../../hooks/useBookings";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";

export const BookingsListPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const itemsPerPage = 6;

  const { handleViewDetails } = useBookings("admin");

  const filterOptions = [
    { value: "", label: "All Bookings" },
    { value: "Booked", label: "Booked" },
    { value: "Completed", label: "Completed Bookings" },
    { value: "Cancelled", label: "Cancelled Bookings" },
  ];

  const fetchBookingsWithFilters = useCallback(
    async (page: number) => {
      console.log("Fetching bookings with filters:", {
        page,
        searchQuery,
        filterStatus,
      });

      return await getBookings(page, "admin", searchQuery, filterStatus);
    },
    [searchQuery, filterStatus]
  );

  const {
    data: bookings,
    setData: setBookings,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(fetchBookingsWithFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Filter changed to:", e.target.value);
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, setCurrentPage]);

  const columns = getBookingsColumns(handleViewDetails, "admin");

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Bookings</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-48">
              <SelectField
                label=""
                name="bookingFilter"
                value={filterStatus}
                onChange={handleFilterChange}
                options={filterOptions}
                placeholder="Filter bookings"
                className="mb-0"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2 px-4">{error}</p>}

      <div className="px-4">
        <Table
          data={bookings || []}
          columns={columns}
          currentPage={currentPage}
          loading={loading}
          pageSize={itemsPerPage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};
