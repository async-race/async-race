export function createQueryStore<Q extends Record<string, unknown>>(
  initialState: Required<Q>,
) {
  let query = initialState;

  const listeners = new Set<() => void>();

  return {
    get(this: void) {
      return query;
    },

    set(this: void, patch: Partial<Q>) {
      query = { ...query, ...patch };
      listeners.forEach((listener) => {
        listener();
      });
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
