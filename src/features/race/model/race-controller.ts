let controller: AbortController | null = null;

function startRace() {
  controller?.abort();
  controller = new AbortController();
  return controller.signal;
}

function stopRace() {
  controller?.abort();
  controller = null;
}

function getSignal() {
  return controller?.signal;
}

export const raceController = {
  start: startRace,
  stop: stopRace,
  getSignal,
};
