import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { initWinners } from './init';
import { winnersQueryStore } from '@/entities';
import { winners } from '@/features';

vi.mock('@/entities', () => ({
  winnersQueryStore: {
    subscribe: vi.fn(),
  },
}));

vi.mock('@/features', () => ({
  winners: {
    loadWinners: vi.fn(),
  },
}));

let subscriptionCallback: (() => void) | undefined;

function unsubscribeMock() {}

function subscribeImplementation(callback: () => void) {
  subscriptionCallback = callback;
  return unsubscribeMock;
}

describe('initWinners', () => {
  beforeEach(function clearMocksAndResetCallback() {
    vi.clearAllMocks();
    subscriptionCallback = undefined;
  });

  it('calls winners.loadWinners immediately', async function testImmediateLoad() {
    await initWinners();
    expect(winners.loadWinners).toHaveBeenCalledTimes(1);
  });

  it('subscribes to winnersQueryStore and calls winners.loadWinners on change', async function testSubscription() {
    (winnersQueryStore.subscribe as Mock).mockImplementation(
      subscribeImplementation,
    );

    await initWinners();
    subscriptionCallback?.();

    expect(winners.loadWinners).toHaveBeenCalledTimes(2);
  });
});
