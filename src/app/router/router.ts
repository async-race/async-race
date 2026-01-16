import { ROUTE_PATHS, type RouteName, type RouterApi } from './model/routes';
import { normalizeLocation, syncUrl } from './lib';
import type { PageInstance } from '@/pages/model/types';

let router: RouterApi | null = null;

export function createRouter(
  root: HTMLElement,
  onPageChange: (route: RouteName) => PageInstance,
) {
  const pages = new Map<RouteName, PageInstance>();
  let activeRoute: RouteName | null = null;

  function hideAll() {
    pages.forEach((page) => {
      page.hide();
    });
  }

  function showRoute(route: RouteName) {
    let page = pages.get(route);

    if (!page) {
      page = onPageChange(route);
      pages.set(route, page);
      root.append(page.element);
    }

    hideAll();
    page.show();
    activeRoute = route;
  }

  function navigate(route: RouteName) {
    if (activeRoute === route) {
      return;
    }

    history.pushState({ route }, '', ROUTE_PATHS[route]);
    showRoute(route);
  }

  function start() {
    const route = normalizeLocation();

    syncUrl(route);
    showRoute(route);

    globalThis.addEventListener('popstate', () => {
      const route = normalizeLocation();
      syncUrl(route);
      showRoute(route);
    });
  }

  return {
    navigate,
    start,
  };
}

export function initRouter(api: RouterApi) {
  router = api;
}

export function navigate(route: RouteName) {
  if (!router) {
    throw new Error('Router is not initialized');
  }

  router.navigate(route);
}
