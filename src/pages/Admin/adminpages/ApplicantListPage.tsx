import AdminLayout from "../../../layouts/AdminLayout";
import { getApplicantsColumns } from "../../../constants/tablecolumns/ApplicantsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { getAllApplicants } from "../../../services/applicantService";
import { useNavigate } from "react-router-dom";

export const ApplicantListPage: React.FC = () => {
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const handleViewDetails = (applicantId: string) => {
    console.log("View details of:", applicantId);
    navigate(`/admin/applicants/${applicantId}`);
  };

  const {
    data: applicants,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(getAllApplicants, "", "", itemsPerPage, "");

  const columns = getApplicantsColumns(handleViewDetails);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Applicants</h1>
        <p className="text-gray-600">
          Review and manage pending technician applications
        </p>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="px-4">
        {loading ? (
          <p className="text-gray-500">Loading applicants...</p>
        ) : applicants && applicants.length > 0 ? (
          <>
            <Table
              data={applicants}
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
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg font-medium">
              No pending applications found.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              All technician applications have been reviewed.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
