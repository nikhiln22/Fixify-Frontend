import AdminLayout from "../../../layouts/AdminLayout";
import { getApplicantsColumns } from "../../../constants/tablecolumns/ApplicantsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { getAllApplicants } from "../../../services/admin.services";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ApplicantListPage: React.FC = () => {
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const handleViewDetails = (applicantId: string) => {
    console.log("View details of:", applicantId);
    navigate(`/admin/applicant/${applicantId}`);
  };

  const fetchApplicants = useCallback(async (page: number) => {
    return await getAllApplicants(page);
  }, []);

  const {
    data: applicants,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(fetchApplicants);

  const columns = getApplicantsColumns(handleViewDetails);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Applicants</h1>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <Table
          data={applicants || []}
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

export default ApplicantListPage;
