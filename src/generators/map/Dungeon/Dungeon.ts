// Constants for better readability and maintainability
export const MIN_RECTANGLE_ROOM_SIZE = 3;
export const MAX_RECTANGLE_ROOM_SIZE = 6;
export const MIN_CIRCLE_ROOM_SIZE = 3;
export const MAX_CIRCLE_ROOM_SIZE = 4;
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
  type: 'rectangle' | 'circular' | 'connection';
}

export interface ConnectableRoom extends BaseRoom {
  type: 'rectangle' | 'circular';
  children: ConnectableRoom[];
  connections: ConnectionRoom[];
}

export interface CircularRoom extends ConnectableRoom {
  type: 'circular';
  radius: number;
}

export interface RectangleRoom extends ConnectableRoom {
  type: 'rectangle';
  width: number;
  height: number;
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

export function getRandomRectangleRoomSize(): number {
  return getRandomNumber(MIN_RECTANGLE_ROOM_SIZE, MAX_RECTANGLE_ROOM_SIZE);
}

export function getRandomCircleRoomSize(): number {
  return getRandomNumber(MIN_CIRCLE_ROOM_SIZE, MAX_CIRCLE_ROOM_SIZE);
}

export function getRandomConnectionLength(): number {
  return getRandomNumber(MIN_CONNECTION_LENGTH, MAX_CONNECTION_LENGTH);
}

export function roomsOverlapCoordinates(
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

export function roomsOverlap(room1: ConnectableRoom, room2: ConnectableRoom): boolean {
  const convertToRect = (room: BaseRoom) => {
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

export function createCircularRoom(id: string, x: number, y: number, radius: number): CircularRoom {
  return {
    id,
    x,
    y,
    radius,
    type: 'circular',
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
// Function to randomly decide the room type
function getRandomRoomType(): 'rectangle' | 'circular' {
  return Math.random() < 0.5 ? 'rectangle' : 'circular';
}

export function createRoom(id: string): ConnectableRoom {
  const roomType = getRandomRoomType();
  if (roomType === 'rectangle') {
    const width = getRandomRectangleRoomSize();
    const height = getRandomRectangleRoomSize();
    return createRectangleRoom(id, 0, 0, width, height);
  } else {
    const radius = getRandomCircleRoomSize();
    return createCircularRoom(id, 0, 0, radius);
  }
}

export function adjustChildPosition(parent: ConnectableRoom, child: ConnectableRoom): void {
  if (parent.type === 'rectangle') {
    child.x += (Math.random() - 0.5) * (parent as RectangleRoom).width;
    child.y += (Math.random() - 0.5) * (parent as RectangleRoom).height;
  }
  if (parent.type === 'circular') {
    child.x += (Math.random() - 0.5) * (parent as CircularRoom).radius * 2;
    child.y += (Math.random() - 0.5) * (parent as CircularRoom).radius * 2;
  }
}

export function setPositionAndDimensionsCircularRectangleRooms(
  direction: Direction,
  parent: CircularRoom,
  child: RectangleRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  let x, y, width, height;

  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.radius; // Connection starts at the edge of the circle
      y = parent.y - connectionSize / 2; // Vertically centered on the parent
      width = connectionSize;
      height = 1;
      child.x = x + width; // The child's x starts after the connection
      child.y = y + height / 2 - child.height / 2; // Center the child vertically
      break;
    case Direction.Bottom:
      x = parent.x - connectionSize / 2; // Horizontally centered on the parent
      y = parent.y + parent.radius; // Connection starts at the edge of the circle
      width = 1;
      height = connectionSize;
      child.x = x + width / 2 - child.width / 2; // Center the child horizontally
      child.y = y + height; // The child's y starts after the connection
      break;
    case Direction.Left:
      x = parent.x - parent.radius - connectionSize; // Connection starts at the left edge of the circle
      y = parent.y - connectionSize / 2; // Vertically centered on the parent
      width = connectionSize;
      height = 1;
      child.x = x - child.width; // The child's x ends at the connection's start
      child.y = y + height / 2 - child.height / 2; // Center the child vertically
      break;
    case Direction.Top:
      x = parent.x - connectionSize / 2; // Horizontally centered on the parent
      y = parent.y - parent.radius - connectionSize; // Connection starts at the top edge of the circle
      width = 1;
      height = connectionSize;
      child.x = x + width / 2 - child.width / 2; // Center the child horizontally
      child.y = y - child.height; // The child's y ends at the connection's start
      break;
  }

  return { x, y, width, height };
}
export function setPositionAndDimensionsRectangleCircularRooms(
  direction: Direction,
  parent: RectangleRoom,
  child: CircularRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  let x, y, width, height;

  // Calculate the connection's position and size
  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.width;
      y = parent.y + parent.height / 2 - connectionSize / 2;
      width = connectionSize;
      height = 1;
      // Now set the circular child's center position
      child.x = x + width + child.radius;
      child.y = y + height / 2;
      break;
    case Direction.Bottom:
      x = parent.x + parent.width / 2 - connectionSize / 2;
      y = parent.y + parent.height;
      width = 1;
      height = connectionSize;
      child.x = x + width / 2;
      child.y = y + height + child.radius;
      break;
    case Direction.Left:
      x = parent.x - connectionSize;
      y = parent.y + parent.height / 2 - connectionSize / 2;
      width = connectionSize;
      height = 1;
      child.x = x - child.radius;
      child.y = y + height / 2;
      break;
    case Direction.Top:
      x = parent.x + parent.width / 2 - connectionSize / 2;
      y = parent.y - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x + width / 2;
      child.y = y - child.radius;
      break;
  }

  return { x, y, width, height };
}

export function setPositionAndDimensionsCircularRooms(
  direction: Direction,
  parent: CircularRoom,
  child: CircularRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  let x, y, width, height;

  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.radius;
      y = parent.y;
      width = connectionSize;
      height = 1;
      child.x = x + width + child.radius;
      child.y = y;
      break;
    case Direction.Bottom:
      x = parent.x;
      y = parent.y + parent.radius;
      width = 1;
      height = connectionSize;
      child.x = x;
      child.y = y + height + child.radius;
      break;
    case Direction.Left:
      x = parent.x - parent.radius - connectionSize;
      y = parent.y;
      width = connectionSize;
      height = 1;
      child.x = x - child.radius;
      child.y = y;
      break;
    case Direction.Top:
      x = parent.x;
      y = parent.y - parent.radius - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x;
      child.y = y - child.radius;
      break;
  }

  return { x, y, width, height };
}

export function setPositionAndDimensionsRectangleRooms(
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

export function setPositionAndDimensions(
  direction: Direction,
  parent: ConnectableRoom,
  child: ConnectableRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  if (parent.type === 'rectangle' && child.type === 'rectangle') {
    return setPositionAndDimensionsRectangleRooms(
      direction,
      parent as RectangleRoom,
      child as RectangleRoom,
      connectionSize,
    );
  }
  if (parent.type === 'rectangle' && child.type === 'circular') {
    return setPositionAndDimensionsRectangleCircularRooms(
      direction,
      parent as RectangleRoom,
      child as CircularRoom,
      connectionSize,
    );
  }
  if (parent.type === 'circular' && child.type === 'rectangle') {
    return setPositionAndDimensionsCircularRectangleRooms(
      direction,
      parent as CircularRoom,
      child as RectangleRoom,
      connectionSize,
    );
  }
  if (parent.type === 'circular' && child.type === 'circular') {
    return setPositionAndDimensionsCircularRooms(
      direction,
      parent as CircularRoom,
      child as CircularRoom,
      connectionSize,
    );
  }

  throw new Error('unsupported rooms');
}

export function createConnection(
  root: RectangleRoom,
  parent: ConnectableRoom,
  child: ConnectableRoom,
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
  const width = getRandomRectangleRoomSize();
  const height = getRandomRectangleRoomSize();
  return createRectangleRoom('0', initialX, initialY, width, height);
}

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

export function selectRandomRoom(root: ConnectableRoom): ConnectableRoom {
  const allRooms = getAllRooms(root);
  return allRooms[Math.floor(Math.random() * allRooms.length)];
}

export function generateDungeon(totalRooms: number): Dungeon {
  const root = createInitialRoom();
  let roomsCount = 1;
  const queue: ConnectableRoom[] = [root];

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
