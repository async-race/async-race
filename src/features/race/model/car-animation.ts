import { animateCarMovement } from '@/pages/garage/model/animation';
import type { CarItem } from '@/pages/garage/model/types';

export function startCarAnimation(
  carItem: CarItem,
  velocity: number,
  distance: number,
) {
  const animation = animateCarMovement(velocity, distance, carItem.car);
  carItem.stopAnimation = animation.stop;
  return animation;
}
