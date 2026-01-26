export function createListStore<T extends { id: number }>() {
  let items: T[] = [];
  let total = 0;

  const listeners = new Set<() => void>();

  return {
    get(this: void) {
      return { items, total };
    },

    getById(id: number) {
      return items.find((item) => item.id === id);
    },

    set(newItems: T[], totalCount: number) {
      items = newItems;
      total = totalCount;
      listeners.forEach((listener) => {
        listener();
      });
    },

    subscribe(this: void, listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
