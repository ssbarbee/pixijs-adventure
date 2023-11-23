import { ConnectableRoom } from '../types';

export function getAllRooms(root: ConnectableRoom): ConnectableRoom[] {
  const allRooms: ConnectableRoom[] = [];
  const queue: ConnectableRoom[] = [root];

  while (queue.length > 0) {
    const currentRoom = queue.shift()!;
    allRooms.push(currentRoom);
    currentRoom.children.forEach((child) => queue.push(child));
  }

  return allRooms;
}
