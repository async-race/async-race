import { carSvg } from './car.template';
import { describe, expect, it } from 'vitest';

describe('carSvg', () => {
  it('should return an instance with given name, color and id', () => {
    const newSvgCar = carSvg({ id: 1, name: 'lada', color: '#ff0000' });

    expect(newSvgCar).toBeInstanceOf(SVGSVGElement);
    expect(newSvgCar.getAttribute('id')).toEqual('1');
    expect(newSvgCar.getAttribute('name')).toBe('lada');
    expect(newSvgCar.getAttribute('fill')).toBe('#ff0000');
  });
});
