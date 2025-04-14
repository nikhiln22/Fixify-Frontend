export interface UsePaginatedListReturn<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refresh: () => void;
  loading: boolean;
  error: string | null;
}
