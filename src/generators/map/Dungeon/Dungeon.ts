// Constants for better readability and maintainability
export const MIN_ROOM_SIZE = 3;
export const MAX_ROOM_SIZE = 6;
export const MIN_CONNECTION_LENGTH = 1;
export const MAX_CONNECTION_LENGTH = 3;
export const MAX_ATTEMPTS = 10;
export const DIRECTION_COUNT = 4;

// Enum for directions
export enum Direction {
  Right,
  Bottom,
  Left,
  Top,
}

interface BaseRoom {
  id: string;
  x: number;
  y: number;
  type: 'rectangle' | 'connection';
}

export interface RectangleRoom extends BaseRoom {
  type: 'rectangle';
  width: number;
  height: number;
  children: RectangleRoom[];
  connections: ConnectionRoom[];
}

export interface ConnectionRoom extends BaseRoom {
  type: 'connection';
  width: number;
  height: number;
}

export interface Dungeon {
  root: RectangleRoom;
}

// Utility functions
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomRoomSize(): number {
  return getRandomNumber(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
}

export function getRandomConnectionLength(): number {
  return getRandomNumber(MIN_CONNECTION_LENGTH, MAX_CONNECTION_LENGTH);
}

export function roomsOverlap(room1: RectangleRoom, room2: RectangleRoom): boolean {
  // Basic AABB collision detection
  return (
    room1.x < room2.x + room2.width &&
    room1.x + room1.width > room2.x &&
    room1.y < room2.y + room2.height &&
    room1.y + room1.height > room2.y
  );
}

export function checkOverlapRecursive(currentRoom: RectangleRoom, newRoom: RectangleRoom): boolean {
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

export function checkOverlap(root: RectangleRoom, newRoom: RectangleRoom): boolean {
  return checkOverlapRecursive(root, newRoom);
}

export function createRectangleRoom(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
): RectangleRoom {
  return {
    id,
    x,
    y,
    width,
    height,
    type: 'rectangle',
    children: [],
    connections: [],
  };
}

export function createConnectionRoom(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
): ConnectionRoom {
  return {
    id,
    x,
    y,
    width,
    height,
    type: 'connection',
  };
}

export function createRoom(id: string): RectangleRoom {
  const width = getRandomRoomSize();
  const height = getRandomRoomSize();
  return createRectangleRoom(id, 0, 0, width, height);
}

export function adjustChildPosition(parent: RectangleRoom, child: RectangleRoom): void {
  child.x += (Math.random() - 0.5) * parent.width;
  child.y += (Math.random() - 0.5) * parent.height;
}

export function setPositionAndDimensions(
  direction: Direction,
  parent: RectangleRoom,
  child: RectangleRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  let x, y, width, height;

  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.width;
      y = parent.y + Math.random() * (parent.height - 1);
      width = connectionSize;
      height = 1;
      child.x = x + width;
      child.y = y;
      break;
    case Direction.Bottom:
      x = parent.x + Math.random() * (parent.width - 1);
      y = parent.y + parent.height;
      width = 1;
      height = connectionSize;
      child.x = x;
      child.y = y + height;
      break;
    case Direction.Left:
      x = parent.x - connectionSize;
      y = parent.y + Math.random() * (parent.height - 1);
      width = connectionSize;
      height = 1;
      child.x = x - child.width;
      child.y = y;
      break;
    case Direction.Top:
      x = parent.x + Math.random() * (parent.width - 1);
      y = parent.y - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x;
      child.y = y - child.height;
      break;
  }

  return { x, y, width, height };
}

export function createConnection(
  root: RectangleRoom,
  parent: RectangleRoom,
  child: RectangleRoom,
): ConnectionRoom | null {
  const connectionSize = getRandomConnectionLength();
  const direction = getRandomNumber(0, DIRECTION_COUNT - 1) as Direction;

  let { x, y, width, height } = setPositionAndDimensions(direction, parent, child, connectionSize);

  let attempts = 0;
  while (checkOverlap(root, child) && attempts < MAX_ATTEMPTS) {
    adjustChildPosition(parent, child);
    ({ x, y, width, height } = setPositionAndDimensions(direction, parent, child, connectionSize));
    attempts++;
  }

  if (checkOverlap(root, child)) {
    return null; // Unable to position room without overlap
  }

  return createConnectionRoom(`${parent.id}->${child.id}`, x, y, width, height);
}

export function createInitialRoom(): RectangleRoom {
  const initialX = 0;
  const initialY = 0;
  const width = getRandomRoomSize();
  const height = getRandomRoomSize();
  return createRectangleRoom('0', initialX, initialY, width, height);
}

export function getAllRooms(root: RectangleRoom): RectangleRoom[] {
  const allRooms: RectangleRoom[] = [];
  const queue: RectangleRoom[] = [root];

  while (queue.length > 0) {
    const currentRoom = queue.shift()!;
    allRooms.push(currentRoom);
    currentRoom.children.forEach((child) => queue.push(child));
  }

  return allRooms;
}

export function selectRandomRoom(root: RectangleRoom): RectangleRoom {
  const allRooms = getAllRooms(root);
  return allRooms[Math.floor(Math.random() * allRooms.length)];
}

export function generateDungeon(totalRooms: number): Dungeon {
  const root = createInitialRoom();
  let roomsCount = 1;
  const queue: RectangleRoom[] = [root];

  while (roomsCount < totalRooms) {
    const currentRoom = queue.length > 0 ? queue.shift()! : selectRandomRoom(root);

    for (let i = 0; i < 4; i++) {
      if (Math.random() < 0.5) {
        const newRoom = createRoom(roomsCount.toString());
        const connection = createConnection(root, currentRoom, newRoom);

        if (connection) {
          currentRoom.children.push(newRoom);
          currentRoom.connections.push(connection);
          queue.push(newRoom);
          roomsCount++;
        }

        if (roomsCount >= totalRooms) break;
      }
    }
  }

  return { root };
}
