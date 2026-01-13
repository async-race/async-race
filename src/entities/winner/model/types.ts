export type WinnerId = number;

export type Winner = {
  id: WinnerId;
  wins: number;
  time: number;
};

export type CreateWinnerDto = Winner;

export type UpdateWinnerDto = {
  wins: number;
  time: number;
};
