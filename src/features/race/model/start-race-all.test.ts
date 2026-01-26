import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startRaceForAllCars, stoptRaceForAllCars } from './start-race-all';
import { startRaceForCar, stopRaceForCar } from './start-race';
import { updateWinners } from '@/features/winners/update/model/update';
import { notifyUser } from '@/features/notify-user/notify-user';
import { carsStore } from '@/entities';
import { raceController } from './race-controller';

vi.mock('./start-race', () => ({
  startRaceForCar: vi.fn(),
  stopRaceForCar: vi.fn(),
}));

vi.mock('@/features/winners/update/model/update', () => ({
  updateWinners: vi.fn(),
}));

vi.mock('@/features/notify-user/notify-user', () => ({
  notifyUser: vi.fn(),
}));

vi.mock('@/entities', () => ({
  carsStore: { getById: vi.fn() },
}));

vi.mock('./race-controller', () => ({
  raceController: { start: vi.fn() },
}));

describe('startRaceForAllCars', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should resolve with a winner, update winners and notify user', async () => {
    const abortController = new AbortController();
    vi.mocked(raceController.start).mockReturnValue(abortController.signal);

    const mockWinner = { carId: 1, time: 2 };
    vi.mocked(startRaceForCar).mockResolvedValue(mockWinner);
    vi.mocked(updateWinners).mockResolvedValue();
    vi.spyOn(carsStore, 'getById').mockReturnValue({
      id: 1,
      name: 'TestCar',
      color: '#000000',
    });

    const onEnd = vi.fn();

    await startRaceForAllCars(
      [
        {
          id: 1,
          animate: () => ({
            start: vi.fn(),
            stop: vi.fn(),
            getTime: () => 2000,
          }),
        },
      ],
      onEnd,
    );

    expect(onEnd).toHaveBeenCalled();
    expect(updateWinners).toHaveBeenCalledWith(1, 2);
    expect(notifyUser).toHaveBeenCalledWith(
      'Winner: car #1 TestCar with (2.00s)',
    );
  });

  it('should notify "No winners" if all races fail', async () => {
    const abortController = new AbortController();
    vi.mocked(raceController.start).mockReturnValue(abortController.signal);

    vi.mocked(startRaceForCar).mockRejectedValue(new Error('Race error'));

    const onEnd = vi.fn();

    await startRaceForAllCars(
      [
        {
          id: 1,
          animate: () => ({
            start: vi.fn(),
            stop: vi.fn(),
            getTime: () => 2000,
          }),
        },
      ],
      onEnd,
    );

    expect(notifyUser).toHaveBeenCalledWith('No winners');
    expect(onEnd).toHaveBeenCalled();
  });
});

describe('stoptRaceForAllCars', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should stop race for all cars and call onEnd', async () => {
    vi.mocked(stopRaceForCar).mockResolvedValue(void 0);

    const onEnd = vi.fn();

    await stoptRaceForAllCars([{ id: 1 }, { id: 2 }], onEnd);

    expect(stopRaceForCar).toHaveBeenCalledWith(1);
    expect(stopRaceForCar).toHaveBeenCalledWith(2);
    expect(onEnd).toHaveBeenCalled();
  });

  it('should not throw if stopRaceForCar fails', async () => {
    vi.mocked(stopRaceForCar).mockRejectedValue(new Error('Stop failed'));

    const onEnd = vi.fn();

    await expect(
      stoptRaceForAllCars([{ id: 1 }], onEnd),
    ).resolves.not.toThrow();
    expect(onEnd).toHaveBeenCalled();
  });
});
