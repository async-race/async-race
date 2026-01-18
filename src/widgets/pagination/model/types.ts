export type PaginationProps = {
  getPage: () => number;
  pageSize: number;
  getTotal: () => number;
  onChange: (page: number) => void;
};
