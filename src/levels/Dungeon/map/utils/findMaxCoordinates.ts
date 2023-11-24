import { ConnectableRoom, ConnectionRoom } from '../types';
import { getItemBounds } from './getItemBounds';

export function findMaxCoordinates(items: (ConnectableRoom | ConnectionRoom)[]): {
  maxX: number;
  maxY: number;
} {
  let maxX = -Infinity;
  let maxY = -Infinity;

  items.forEach((item) => {
    const bounds = getItemBounds(item);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

  return { maxX, maxY };
}
