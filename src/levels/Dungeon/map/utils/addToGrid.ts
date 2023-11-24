import { ConnectableRoom, ConnectionRoom } from '../types';
import { getItemBounds } from './getItemBounds';

export function addToGrid(
  item: ConnectableRoom | ConnectionRoom,
  grid: (ConnectableRoom | ConnectionRoom)[][][],
  gridSize: number,
): void {
  const bounds = getItemBounds(item);
  const startX = Math.floor(bounds.x / gridSize);
  const endX = Math.floor((bounds.x + bounds.width) / gridSize);
  const startY = Math.floor(bounds.y / gridSize);
  const endY = Math.floor((bounds.y + bounds.height) / gridSize);

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (grid[x] && grid[x][y]) {
        grid[x][y].push(item);
      }
    }
  }
}
