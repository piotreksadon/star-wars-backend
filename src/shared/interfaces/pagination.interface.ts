export interface PaginationMetadata {
    totalRecords: number;
    totalPages: number;
    currentPage: number | null;
    limit: number;
    prevPage: number | null;
    nextPage: number | null;
}