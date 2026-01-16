import { ROUTE_PATHS, type RouteName } from '../model/routes';

export function normalizeLocation(): RouteName {
  const path = location.pathname.replaceAll(/\/+/g, '/');

  if (path === '/' || path === '/garage') {
    return 'garage';
  }

  if (path === '/winners') {
    return 'winners';
  }

  return 'garage';
}

export function syncUrl(route: RouteName) {
  const expectedPath = ROUTE_PATHS[route];

  if (location.pathname !== expectedPath) {
    history.replaceState({ route }, '', expectedPath);
  }
}
