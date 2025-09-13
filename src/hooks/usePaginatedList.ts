import { useState, useEffect, useCallback } from "react";

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  overview?: {
    activeTechnicians: number;
    paidSubscribers: number;
    monthlyRevenue: number;
  };
}

type FetchFunction<T> = (
  page: number | null,
  searchQuery?: string,
  filterStatus?: string,
  limit?: number | null,
  filterDesignation?: string,
  serviceType?: string
) => Promise<PaginatedResponse<T>>;

export const usePaginatedList = <T>(
  fetchFunction: FetchFunction<T>,
  searchQuery: string,
  filterStatus: string,
  limit?: number | null,
  filterDesignation?: string,
  serviceType?: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<{
    activeTechnicians: number;
    paidSubscribers: number;
    monthlyRevenue: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction(
        currentPage,
        searchQuery,
        filterStatus,
        limit,
        filterDesignation || "",
        serviceType || ""
      );
      setData(response.data);
      setTotalPages(response.totalPages);

      if (response.overview) {
        setOverview(response.overview);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchQuery,
    filterStatus,
    filterDesignation,
    limit,
    serviceType,
    fetchFunction,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    overview,
  };
};
