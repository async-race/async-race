export type PaginationProps = {
  getPage: () => number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
};
