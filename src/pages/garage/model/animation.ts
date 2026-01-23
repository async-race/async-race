export const animateCarMovement = (
  velocity: number,
  distance: number,
  carElement: SVGSVGElement,
) => {
  const animationTime = distance / velocity;
  const startTime = performance.now();

  let animationStopped = false;
  let animationFrameId: number;

  const animateFrame = (currentTime: number): void => {
    if (animationStopped) return;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / animationTime, 1);

    const trackWidth = carElement.parentElement?.clientWidth || 0;
    const maxDistance = trackWidth - carElement.clientWidth;
    const currentPosition = progress * maxDistance;

    carElement.style.transform = `translateX(${currentPosition.toString()}px)`;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animateFrame);
    }
  };

  return {
    start: (): void => {
      animationFrameId = requestAnimationFrame(animateFrame);
    },
    stop: (): void => {
      animationStopped = true;
      cancelAnimationFrame(animationFrameId);
    },
    getTime: (): number => {
      return animationTime;
    },
  };
};
