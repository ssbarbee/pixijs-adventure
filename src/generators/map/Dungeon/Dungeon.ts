// Constants for better readability and maintainability
import { createCircularRoom } from './circular/createCircularRoom';
import { getRandomCircleRoomSize } from './circular/getRandomCircleRoomSize';
import { createConnectionRoom } from './connection/createConnectionRoom';
import { getRandomConnectionLength } from './connection/getRandomConnectionLength';
import { createRectangleRoom } from './rectangle/createRectangleRoom';
import { getRandomRectangleRoomSize } from './rectangle/getRandomRectangleRoomSize';
import { CircularRoom, ConnectableRoom, ConnectionRoom, Dungeon, RectangleRoom } from './types';
import { checkOverlap } from './utils/checkOverlap';
import { getRandomNumber } from './utils/getRandomNumber';
import { selectRandomRoom } from './utils/selectRandomRoom';

export const MAX_ATTEMPTS = 10;
export const DIRECTION_COUNT = 4;

// Enum for directions
export enum Direction {
  Right,
  Bottom,
  Left,
  Top,
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
    return;
  }
  if (parent.type === 'circular') {
    child.x += (Math.random() - 0.5) * (parent as CircularRoom).radius * 2;
    child.y += (Math.random() - 0.5) * (parent as CircularRoom).radius * 2;
    return;
  }
  throw new Error(`type of room not supported! type: ${parent.type as string}`);
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
  root: ConnectableRoom,
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

export function generateDungeon(totalRooms: number): Dungeon {
  let roomsCount = 0;
  const root = createRoom(roomsCount.toString());
  roomsCount++;
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
