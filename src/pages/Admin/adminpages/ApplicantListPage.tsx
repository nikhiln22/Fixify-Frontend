// import AdminLayout from "../../../layouts/AdminLayout";
// import useApplicants from "../../../hooks/useApplicants";
// import { getApplicantsColumns } from "../../../constants/tablecolumns/ApplicantsColumn";
// import TableWithPagination from "../../../components/common/TableWithPagination";

// function ApplicantListPage() {
//   const {
//     applicants,
//     currentPage,
//     totalPages,
//     setCurrentPage,
//     handleViewDetails,
//     loading,
//     error,
//   } = useApplicants();
  
//   const columns = getApplicantsColumns(handleViewDetails);
  
//   return (
//     <AdminLayout>
//       <div className="p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-semibold mb-4 text-center">Applicants</h1>
//       </div>
//       {error && <p className="text-red-500 mb-2">{error}</p>}
//       <TableWithPagination
//         data={applicants}
//         columns={columns}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//         loading={loading}
//       />
//     </AdminLayout>
//   );
// }

// export default ApplicantListPage;