import { CircularRoom, ConnectableRoom, RectangleRoom } from '../types';

export interface SpawnableRoom {
  room: ConnectableRoom;
  centerX: number;
  centerY: number;
}

/**
 * Gets all rooms where entities can spawn, excluding the starting room and corridors.
 * Uses BFS traversal to collect all ConnectableRooms except the root.
 */
export function getSpawnableRooms(root: ConnectableRoom): SpawnableRoom[] {
  const spawnableRooms: SpawnableRoom[] = [];
  const visited = new Set<string>();
  visited.add(root.id);

  const queue: ConnectableRoom[] = [...root.children];

  while (queue.length > 0) {
    const room = queue.shift()!;

    if (visited.has(room.id)) {
      continue;
    }
    visited.add(room.id);

    // Calculate center based on room type
    let centerX: number;
    let centerY: number;

    if (room.type === 'rectangle') {
      const rectRoom = room as RectangleRoom;
      centerX = rectRoom.x + rectRoom.width / 2;
      centerY = rectRoom.y + rectRoom.height / 2;
    } else {
      // Circular room - center is already x, y
      const circRoom = room as CircularRoom;
      centerX = circRoom.x;
      centerY = circRoom.y;
    }

    spawnableRooms.push({ room, centerX, centerY });

    // Add children to queue
    for (const child of room.children) {
      if (!visited.has(child.id)) {
        queue.push(child);
      }
    }
  }

  return spawnableRooms;
}
