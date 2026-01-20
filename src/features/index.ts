import { createCar } from './car/create/model/create';
import { loadCars } from './car/load/model/load';
import { updateCar } from './car/update/model/update';
import { deleteCar } from './car/delete/model/delete';

import { loadWinners } from './winners/load/model/load';
import { updateWinners } from './winners/update/model/update';
import { deleteWinners } from './winners/delete/model/delete';

export const cars = { createCar, loadCars, updateCar, deleteCar };
export const winners = { loadWinners, updateWinners, deleteWinners };
