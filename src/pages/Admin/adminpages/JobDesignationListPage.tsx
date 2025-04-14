import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useJobDesignations } from "../../../hooks/useJobDesignation";
import { getJobDesignationColumns } from "../../../constants/tablecolumns/jobDesignationColumn";
import TableWithPagination from "../../../components/common/TableWithPagination";

export const JobDesignationListPage: React.FC = () => {
  const {
    designations,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusToggle,
    loading,
    error,
  } = useJobDesignations();

  const columns = getJobDesignationColumns(handleStatusToggle);

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Job Designations</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <TableWithPagination
          data={designations}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};
