// Grid-based spatial partitioning system
import { ConnectableRoom, ConnectionRoom } from '../types';

export function createEmptyGrid(
  dungeonWidth: number,
  dungeonHeight: number,
  gridSize: number,
): (ConnectableRoom | ConnectionRoom)[][][] {
  const gridWidth = Math.ceil(dungeonWidth / gridSize);
  const gridHeight = Math.ceil(dungeonHeight / gridSize);
  const grid: (ConnectableRoom | ConnectionRoom)[][][] = new Array<
    (ConnectableRoom | ConnectionRoom)[][]
  >(gridWidth);

  for (let x = 0; x < gridWidth; x++) {
    grid[x] = new Array<(ConnectableRoom | ConnectionRoom)[]>(gridHeight);
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = [];
    }
  }

  return grid;
}
