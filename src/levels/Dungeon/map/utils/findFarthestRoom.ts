import { ConnectableRoom } from '../types';

/**
 * Finds the room that is farthest from the root room using BFS traversal depth.
 * Returns the room with the maximum depth (number of connections from root).
 */
export function findFarthestRoom(root: ConnectableRoom): ConnectableRoom {
  let farthestRoom = root;
  let maxDepth = 0;

  const queue: { room: ConnectableRoom; depth: number }[] = [{ room: root, depth: 0 }];
  const visited = new Set<string>();
  visited.add(root.id);

  while (queue.length > 0) {
    const { room, depth } = queue.shift()!;

    if (depth > maxDepth) {
      maxDepth = depth;
      farthestRoom = room;
    }

    for (const child of room.children) {
      if (!visited.has(child.id)) {
        visited.add(child.id);
        queue.push({ room: child, depth: depth + 1 });
      }
    }
  }

  return farthestRoom;
}
