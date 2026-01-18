export type PaginationProps = {
  getPage: () => number;
  getTotal: () => number;
  pageSize: number;
  onChange: (page: number) => void;
};
