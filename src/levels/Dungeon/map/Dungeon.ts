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
  IRectangle,
  RectangleObstacle,
  RectangleRoom,
  SquareObstacle,
  SupportedObstacles,
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
  const allRooms: ConnectableRoom[] = [root];
  const allConnections: ConnectionRoom[] = [];

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
          allRooms.push(newRoom);
          allConnections.push(connection);
        }

        if (roomsCount >= totalRooms) break;
      }
    }
  }

  const allRoomsAndConnections = [...allRooms, ...allConnections];

  allRooms.forEach(addObstaclesToRoom);

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

    if (item.type !== 'connection') {
      item.obstacles.forEach((obstacle) => {
        obstacle.x += offsetX;
        obstacle.y += offsetY;
      });
    }
  });
}

export function createRectangleObstacleInRectangleRoom(room: RectangleRoom): RectangleObstacle {
  const horizontal = Math.random() < 0.5;

  // Set width and height based on orientation
  const width = horizontal ? getRandomNumber(room.width / 8, room.width / 3) : 0.2;
  const height = horizontal ? 0.2 : getRandomNumber(room.height / 8, room.height / 3);

  // Adjust the x and y position to ensure the obstacle is within the room's bounds
  const x = getRandomNumber(room.x, Math.floor(room.width + room.x - width));
  const y = getRandomNumber(room.y, Math.floor(room.height + room.y - height));

  return {
    x,
    y,
    width,
    height,
    type: 'rectangle',
  };
}

export function createSquareObstacleInRectangleRoom(room: RectangleRoom): SquareObstacle {
  const size = getRandomNumber(room.height / 8, room.height / 3);

  // Adjust the x and y position to ensure the obstacle is within the room's bounds
  const x = getRandomNumber(room.x, Math.floor(room.width + room.x - size));
  const y = getRandomNumber(room.y, Math.floor(room.height + room.y - size));

  return {
    x,
    y,
    width: size,
    height: size,
    type: 'square',
  };
}

export function addObstaclesToRoom(room: ConnectableRoom): void {
  const obstacleCount = getRandomNumber(0, 4); // 0 to 4 obstacles
  room.obstacles = [];

  for (let i = 0; i < obstacleCount; i++) {
    let attempts = 0;
    let obstaclePlaced = false;

    while (attempts < 10 && !obstaclePlaced) {
      const obstacleType = Math.random() < 0.5 ? 'rectangle' : 'square';
      let obstacle: SupportedObstacles | null = null;
      if (obstacleType === 'rectangle') {
        if (room.type === 'rectangle') {
          obstacle = createRectangleObstacleInRectangleRoom(room as RectangleRoom);
        }
        if (room.type === 'circular') {
          obstacle = createRectangleObstacleInCircularRoom(room as CircularRoom);
        }
      }
      if (obstacleType === 'square') {
        if (room.type === 'rectangle') {
          obstacle = createSquareObstacleInRectangleRoom(room as RectangleRoom);
        }
        if (room.type === 'circular') {
          obstacle = createSquareObstacleInCircularRoom(room as CircularRoom);
        }
      }
      if (obstacle) {
        if (!checkObstacleOverlap(room.obstacles, obstacle)) {
          room.obstacles.push(obstacle);
          obstaclePlaced = true;
        }
      }
      attempts++;
    }

    if (!obstaclePlaced) {
      // Could not place an obstacle after 10 attempts
      break;
    }
  }
}

function checkObstacleOverlap(
  obstacles: SupportedObstacles[],
  newObstacle: SupportedObstacles,
): boolean {
  for (const obstacle of obstacles) {
    if (obstaclesOverlap(obstacle, newObstacle)) {
      return true;
    }
  }
  return false;
}

function obstaclesOverlap(obstacle1: SupportedObstacles, obstacle2: SupportedObstacles): boolean {
  if (obstacle1.type === 'rectangle' && obstacle2.type === 'rectangle') {
    return rectangleRectangleOverlap(obstacle1, obstacle2);
  }
  if (obstacle1.type === 'rectangle' && obstacle2.type === 'square') {
    return rectangleRectangleOverlap(obstacle1, obstacle2);
  }
  if (obstacle1.type === 'square' && obstacle2.type === 'rectangle') {
    return rectangleRectangleOverlap(obstacle1, obstacle2);
  }
  if (obstacle1.type === 'square' && obstacle2.type === 'square') {
    return rectangleRectangleOverlap(obstacle1, obstacle2);
  }
  throw new Error('unknown obstacles');
}

function rectangleRectangleOverlap(rect1: IRectangle, rect2: IRectangle): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function createRectangleObstacleInCircularRoom(room: CircularRoom): RectangleObstacle {
  const horizontal = Math.random() < 0.5;
  const safeRadius = room.radius * 0.5; // Reduced radius for safe placement

  let width, height, x, y;

  if (horizontal) {
    height = 0.2;
    width = getRandomNumber((safeRadius * 2) / 8, (safeRadius * 2) / 3);

    x = getRandomNumber(room.x - safeRadius + width / 2, room.x + safeRadius - width / 2);
    y = getRandomNumber(room.y - safeRadius + height / 2, room.y + safeRadius - height / 2);
  } else {
    width = 0.2;
    height = getRandomNumber((safeRadius * 2) / 8, (safeRadius * 2) / 3);

    x = getRandomNumber(room.x - safeRadius + width / 2, room.x + safeRadius - width / 2);
    y = getRandomNumber(room.y - safeRadius + height / 2, room.y + safeRadius - height / 2);
  }

  // Adjust x and y to convert from center-based to top-left-based coordinates
  x -= width / 2;
  y -= height / 2;

  return {
    x,
    y,
    width,
    height,
    type: 'rectangle',
  };
}

export function createSquareObstacleInCircularRoom(room: CircularRoom): SquareObstacle {
  const safeRadius = room.radius * 0.5; // Reduced radius for safe placement

  let x, y;

  const size = getRandomNumber((safeRadius * 2) / 8, (safeRadius * 2) / 3);

  x = getRandomNumber(room.x - safeRadius + size / 2, room.x + safeRadius - size / 2);
  y = getRandomNumber(room.y - safeRadius + size / 2, room.y + safeRadius - size / 2);

  // Adjust x and y to convert from center-based to top-left-based coordinates
  x -= size / 2;
  y -= size / 2;

  return {
    x,
    y,
    width: size,
    height: size,
    type: 'square',
  };
}
