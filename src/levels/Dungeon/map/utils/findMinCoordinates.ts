import { ConnectableRoom, ConnectionRoom } from '../types';
import { getItemBounds } from './getItemBounds';

export function findMinCoordinates(items: (ConnectableRoom | ConnectionRoom)[]): {
  minX: number;
  minY: number;
} {
  let minX = Infinity;
  let minY = Infinity;

  items.forEach((item) => {
    const bounds = getItemBounds(item);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
  });

  return { minX, minY };
}
