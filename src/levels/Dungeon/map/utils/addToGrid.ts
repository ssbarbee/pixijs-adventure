import { ConnectableRoom, ConnectionRoom } from '../types';
import { getItemBounds } from './getItemBounds';

export function addToGrid(
  item: ConnectableRoom | ConnectionRoom,
  grid: (ConnectableRoom | ConnectionRoom)[][][],
  gridSize: number,
): void {
  const bounds = getItemBounds(item);
  const gridWidth = grid.length;
  const gridHeight = gridWidth > 0 ? grid[0].length : 0;

  // Calculate grid indices and clamp to valid bounds
  const startX = Math.max(0, Math.floor(bounds.x / gridSize));
  const endX = Math.min(gridWidth - 1, Math.floor((bounds.x + bounds.width) / gridSize));
  const startY = Math.max(0, Math.floor(bounds.y / gridSize));
  const endY = Math.min(gridHeight - 1, Math.floor((bounds.y + bounds.height) / gridSize));

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (grid[x] && grid[x][y]) {
        grid[x][y].push(item);
      }
    }
  }
}
