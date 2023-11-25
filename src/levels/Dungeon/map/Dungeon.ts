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

export function createRectangleObstacleInRectangleRoom(room: RectangleRoom): RectangleObstacle {
  const horizontal = Math.random() < 0.5;

  // Ensure the width and height of the obstacle are within the room's dimensions
  const maxWidth = horizontal ? room.width : getRandomNumber(0.05, 0.3) * room.width;
  const maxHeight = horizontal ? getRandomNumber(0.05, 0.3) * room.height : room.height;

  // Randomly determine the dimensions of the obstacle within the constraints
  const width = getRandomNumber(0.05 * room.width, maxWidth);
  const height = getRandomNumber(0.05 * room.height, maxHeight);

  // Adjust the x and y position to ensure the obstacle is within the room's bounds
  const x = room.x + getRandomNumber(0, room.width - width);
  const y = room.y + getRandomNumber(0, room.height - height);

  return {
    x,
    y,
    width,
    height,
    type: 'rectangle',
  };
}

export function createSquareObstacleInRectangleRoom(room: RectangleRoom): SquareObstacle {
  const maxSize = Math.min(room.width, room.height, 2);
  const size = getRandomNumber(0.5, maxSize);

  const x = room.x + getRandomNumber(0, room.width - size);
  const y = room.y + getRandomNumber(0, room.height - size);

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
  // Logic to ensure the rectangle is within the circle
  // Adjust as needed
  const horizontal = Math.random() < 0.5;
  const maxSize = room.radius * Math.sqrt(2); // Maximum size fitting in the circle
  const width = horizontal ? getRandomNumber(0.05, maxSize) : room.radius * 2;
  const height = horizontal ? room.radius * 2 : getRandomNumber(0.05, maxSize);

  return {
    x: getRandomNumber(room.x - room.radius, room.x + room.radius - width),
    y: getRandomNumber(room.y - room.radius, room.y + room.radius - height),
    width,
    height,
    type: 'rectangle',
  };
}

export function createSquareObstacleInCircularRoom(room: CircularRoom): SquareObstacle {
  // Logic to ensure the square is within the circle
  // Adjust as needed
  const maxSize = room.radius * Math.sqrt(2); // Maximum size fitting in the circle
  const size = getRandomNumber(0.5, maxSize);

  return {
    x: getRandomNumber(room.x - room.radius, room.x + room.radius - size),
    y: getRandomNumber(room.y - room.radius, room.y + room.radius - size),
    width: size,
    height: size,
    type: 'square',
  };
}
