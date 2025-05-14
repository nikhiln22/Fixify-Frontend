import { useState, useEffect, useCallback } from "react";

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
}

type FetchFunction<T> = (page: number) => Promise<PaginatedResponse<T>>;

export const usePaginatedList = <T>(fetchFunction: FetchFunction<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction(currentPage);
      setData(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    refetch
  };
};