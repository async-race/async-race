import { createCar } from './car/create/model/create';
import { loadCars } from './car/load/model/load';
import { updateCar } from './car/update/model/update';
import { deleteCar } from './car/delete/model/delete';
import { generateCars } from './car/generate-cars/generate-cars';

import { loadWinners } from './winners/load/model/load';
import { updateWinners } from './winners/update/model/update';
import { deleteWinners } from './winners/delete/model/delete';
import { getWinnersWithCars } from './winners/get-winners-with-cars/get-winners-with-cars';
export type { WinnersWithCars } from './winners/get-winners-with-cars/get-winners-with-cars';

import { startRaceForCar, stopRaceForCar } from './race/model/start-race';
import { startRaceForAllCars } from './race/model/start-race-all';
import { raceController } from './race/model/race-controller';
import { startCarAnimation } from './race/model/car-animation';

export const cars = { createCar, loadCars, updateCar, deleteCar, generateCars };
export const winners = {
  loadWinners,
  updateWinners,
  deleteWinners,
  getWinnersWithCars,
};
export const race = {
  startRaceForCar,
  startRaceForAllCars,
  stopRaceForCar,
  raceController,
  startCarAnimation,
};
