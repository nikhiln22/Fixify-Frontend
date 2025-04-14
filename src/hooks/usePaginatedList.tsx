import { useState, useEffect, useCallback } from 'react';

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  // Add other pagination-related fields if needed
}

// Generic type for API fetcher function
type FetcherFunction<T> = (page: number) => Promise<PaginatedResponse<T>>;

export const usePaginatedList = <T extends object>(
  fetchFunction: FetcherFunction<T>,
  initialPage = 1
) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction(currentPage);
      setData(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Now fetchData is properly included in dependencies

  return {
    data,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    refetch: fetchData,
  };
};