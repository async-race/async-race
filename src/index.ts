import { startApp } from '@/app';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('#root not found in DOM');
}

startApp(rootElement);
