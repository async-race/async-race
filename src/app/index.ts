import '@/app/styles/global.css';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { createHeader } from '@/widgets/header/ui/header';
import { createFooter } from '@/widgets/footer/ui/footer';
import { createPage } from './lib/create-page';
import { createRouter, initRouter } from './router/router';

export function startApp(rootElement: Element) {
  rootElement.classList.add('app-root');
  const main = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex',
  });
  const header = createHeader();
  const footer = createFooter();

  rootElement.append(header, main, footer);

  const router = createRouter(main, createPage);
  initRouter({ navigate: router.navigate });
  router.start();
}
