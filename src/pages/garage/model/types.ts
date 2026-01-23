export type CarItem = {
  car: SVGSVGElement;
  buttons: {
    selectButton: HTMLButtonElement;
    deleteButton: HTMLButtonElement;
    startButton: HTMLButtonElement;
    stopButton: HTMLButtonElement;
  };
  stopAnimation?: () => void;
};
