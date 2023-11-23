import { CircularRoom, ConnectableRoom, RectangleRoom } from '../types';

function roomsOverlapCoordinates(
  room1: Omit<RectangleRoom, 'id' | 'connections' | 'type' | 'children'>,
  room2: Omit<RectangleRoom, 'id' | 'connections' | 'type' | 'children'>,
): boolean {
  // Basic AABB collision detection
  return (
    room1.x < room2.x + room2.width &&
    room1.x + room1.width > room2.x &&
    room1.y < room2.y + room2.height &&
    room1.y + room1.height > room2.y
  );
}

function roomsOverlap(room1: ConnectableRoom, room2: ConnectableRoom): boolean {
  const convertToRect = (room: ConnectableRoom) => {
    if (room.type === 'circular') {
      const circular = room as CircularRoom;
      return {
        x: circular.x - circular.radius,
        y: circular.y - circular.radius,
        width: circular.radius * 2,
        height: circular.radius * 2,
      };
    }
    return room;
  };

  const rect1 = convertToRect(room1);
  const rect2 = convertToRect(room2);
  return roomsOverlapCoordinates(rect1 as RectangleRoom, rect2 as RectangleRoom);
}

export function checkOverlapRecursive(
  currentRoom: ConnectableRoom,
  newRoom: ConnectableRoom,
): boolean {
  if (roomsOverlap(currentRoom, newRoom)) {
    return true;
  }

  for (const child of currentRoom.children) {
    if (checkOverlapRecursive(child, newRoom)) {
      return true;
    }
  }

  return false;
}

export function checkOverlap(root: ConnectableRoom, newRoom: ConnectableRoom): boolean {
  return checkOverlapRecursive(root, newRoom);
}
