import type { Winner } from './types';
import { createListStore } from '@/shared/store/create-list-store';

export const winnersStore = createListStore<Winner>();
