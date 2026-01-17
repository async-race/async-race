import type { RouteName } from '../router/model/routes';
import { createGaragePage } from '@/pages/garage/ui/garage-page';
import { createWinnersPage } from '@/pages/winners/ui/winners-page';

export function createPage(route: RouteName) {
  switch (route) {
    case 'garage': {
      return createGaragePage();
    }
    case 'winners': {
      return createWinnersPage();
    }
  }
}
