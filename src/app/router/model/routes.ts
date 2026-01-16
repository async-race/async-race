export type RouterApi = {
  navigate: (route: RouteName) => void;
};

export const ROUTE_PATHS = {
  garage: '/garage',
  winners: '/winners',
} as const;

export type RouteName = keyof typeof ROUTE_PATHS;
