/* eslint-disable @typescript-eslint/no-use-before-define */
// Constants for better readability and maintainability
import { createConnectionRoom } from './connection/createConnectionRoom';
import { getRandomConnectionLength } from './connection/getRandomConnectionLength';
import {
  CircularRoom,
  ConnectableRoom,
  ConnectionRoom,
  Direction,
  Dungeon,
  RectangleRoom,
} from './types';
import { addToGrid } from './utils/addToGrid';
import { checkOverlap } from './utils/checkOverlap';
import { createEmptyGrid } from './utils/createEmptyGrid';
import { createRoom } from './utils/createRoom';
import { determineGridSize } from './utils/determineGridSize';
import { findMaxCoordinates } from './utils/findMaxCoordinates';
import { findMinCoordinates } from './utils/findMinCoordinates';
import { getRandomNumber } from './utils/getRandomNumber';
import { selectRandomRoom } from './utils/selectRandomRoom';
import { setPositionAndDimensions } from './utils/setPositionAndDimensions';

export const MAX_ATTEMPTS = 10;
export const DIRECTION_COUNT = 4;

export function adjustChildPosition(parent: ConnectableRoom, child: ConnectableRoom): void {
  if (parent.type === 'rectangle') {
    child.x += getRandomNumber(-2, 2) * (parent as RectangleRoom).width;
    child.y += getRandomNumber(-2, 2) * (parent as RectangleRoom).height;
    return;
  }
  if (parent.type === 'circular') {
    child.x += getRandomNumber(-2, 2) * (parent as CircularRoom).radius * 2;
    child.y += getRandomNumber(-2, 2) * (parent as CircularRoom).radius * 2;
    return;
  }
  throw new Error(`type of room not supported! type: ${parent.type as string}`);
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
  const root = createRoom('0');
  roomsCount++;
  const queue: ConnectableRoom[] = [root];
  const allRoomsAndConnections: (ConnectableRoom | ConnectionRoom)[] = [root];

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

          allRoomsAndConnections.push(newRoom);
          allRoomsAndConnections.push(connection);
        }

        if (roomsCount >= totalRooms) break;
      }
    }
  }

  const { minX, minY } = findMinCoordinates(allRoomsAndConnections);
  adjustCoordinates(allRoomsAndConnections, -minX, -minY);

  const { maxX, maxY } = findMaxCoordinates(allRoomsAndConnections);
  const dungeonWidth = maxX - minX;
  const dungeonHeight = maxY - minY;

  // Determine an ideal grid size based on dungeon dimensions (adjust as needed)
  const gridSize = determineGridSize(dungeonWidth, dungeonHeight);

  const grid = createEmptyGrid(dungeonWidth, dungeonHeight, gridSize);
  allRoomsAndConnections.forEach((item) => addToGrid(item, grid, gridSize));

  return {
    root,
    grid,
    width: dungeonWidth,
    height: dungeonHeight,
    gridSize,
  };
}

function adjustCoordinates(
  items: (ConnectableRoom | ConnectionRoom)[],
  offsetX: number,
  offsetY: number,
): void {
  items.forEach((item) => {
    item.x += offsetX;
    item.y += offsetY;
  });
}
