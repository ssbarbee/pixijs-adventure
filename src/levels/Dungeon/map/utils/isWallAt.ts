import { Dungeon, SupportedObstacles } from '../types';
import { getRoomAt } from './getRoomAt';

function isPointInsideObstacle(x: number, y: number, obstacle: SupportedObstacles): boolean {
  return (
    x >= obstacle.x &&
    x < obstacle.x + obstacle.width &&
    y >= obstacle.y &&
    y < obstacle.y + obstacle.height
  );
}

export function isWallAt(x: number, y: number, dungeon: Dungeon): boolean {
  const roomOrConnection = getRoomAt(x, y, dungeon);
  if (!roomOrConnection) {
    // If no room or connection is found at the position, it's a wall or empty space
    return true;
  }

  // Check if the point is inside an obstacle (only ConnectableRooms have obstacles)
  if (roomOrConnection.type !== 'connection') {
    for (const obstacle of roomOrConnection.obstacles) {
      if (isPointInsideObstacle(x, y, obstacle)) {
        return true;
      }
    }
  }

  return false;
}
