export type CarId = number;

export type Car = {
  id: CarId;
  name: string;
  color: string;
};

export type CreateCarDto = {
  name: string;
  color: string;
};

export type UpdateCarDto = CreateCarDto;

export type EngineStatus = 'started' | 'stopped' | 'drive';

export type EngineStartResponse = {
  velocity: number;
  distance: number;
};

export type EngineDriveResponse = {
  success: boolean;
};
