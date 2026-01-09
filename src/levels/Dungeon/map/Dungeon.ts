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
    // Use BFS queue when available, fallback to random room selection if queue is exhausted
    // (can happen if rooms fail to connect due to overlap constraints)
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
  const margin = 1; // Keep obstacles 1 unit away from room edges

  // Set width and height based on orientation, but ensure they fit within the room
  const maxWidth = Math.max(1, room.width - margin * 2);
  const maxHeight = Math.max(1, room.height - margin * 2);

  const width = horizontal
    ? Math.min(getRandomNumber(1, Math.floor(room.width / 3)), maxWidth)
    : 0.2;
  const height = horizontal
    ? 0.2
    : Math.min(getRandomNumber(1, Math.floor(room.height / 3)), maxHeight);

  // Calculate valid position range ensuring obstacle stays within room bounds
  const minX = room.x + margin;
  const maxX = Math.max(minX, room.x + room.width - width - margin);
  const minY = room.y + margin;
  const maxY = Math.max(minY, room.y + room.height - height - margin);

  const x = getRandomNumber(Math.floor(minX), Math.floor(maxX));
  const y = getRandomNumber(Math.floor(minY), Math.floor(maxY));

  return {
    x,
    y,
    width,
    height,
    type: 'rectangle',
  };
}

export function createSquareObstacleInRectangleRoom(room: RectangleRoom): SquareObstacle {
  const margin = 1; // Keep obstacles 1 unit away from room edges

  // Ensure size fits within room with margins
  const maxSize = Math.max(1, Math.min(room.width, room.height) - margin * 2);
  const size = Math.min(
    getRandomNumber(1, Math.floor(Math.min(room.width, room.height) / 3)),
    maxSize,
  );

  // Calculate valid position range ensuring obstacle stays within room bounds
  const minX = room.x + margin;
  const maxX = Math.max(minX, room.x + room.width - size - margin);
  const minY = room.y + margin;
  const maxY = Math.max(minY, room.y + room.height - size - margin);

  const x = getRandomNumber(Math.floor(minX), Math.floor(maxX));
  const y = getRandomNumber(Math.floor(minY), Math.floor(maxY));

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
  const safeRadius = Math.max(1, room.radius * 0.4); // Reduced radius for safe placement, minimum 1

  // Calculate max dimensions that fit within safe area
  const maxDimension = Math.max(1, Math.floor(safeRadius));

  const width = horizontal ? getRandomNumber(1, maxDimension) : 0.2;
  const height = horizontal ? 0.2 : getRandomNumber(1, maxDimension);

  // Calculate valid position range ensuring obstacle stays within safe radius
  // Use room center as the anchor point for positioning
  const halfRange = Math.max(0, safeRadius - (horizontal ? width : height) / 2);
  const minX = Math.floor(room.x - halfRange);
  const maxX = Math.floor(room.x + halfRange - width);
  const minY = Math.floor(room.y - halfRange);
  const maxY = Math.floor(room.y + halfRange - height);

  // getRandomNumber now handles min > max cases gracefully
  const x = getRandomNumber(minX, maxX);
  const y = getRandomNumber(minY, maxY);

  return {
    x,
    y,
    width,
    height,
    type: 'rectangle',
  };
}

export function createSquareObstacleInCircularRoom(room: CircularRoom): SquareObstacle {
  const safeRadius = Math.max(1, room.radius * 0.4); // Reduced radius for safe placement, minimum 1

  // Ensure size fits within safe area
  const maxSize = Math.max(1, Math.floor(safeRadius));
  const size = getRandomNumber(1, maxSize);

  // Calculate valid position range ensuring obstacle stays within safe radius
  const halfRange = Math.max(0, safeRadius - size / 2);
  const minX = Math.floor(room.x - halfRange);
  const maxX = Math.floor(room.x + halfRange - size);
  const minY = Math.floor(room.y - halfRange);
  const maxY = Math.floor(room.y + halfRange - size);

  // getRandomNumber now handles min > max cases gracefully
  const x = getRandomNumber(minX, maxX);
  const y = getRandomNumber(minY, maxY);

  return {
    x,
    y,
    width: size,
    height: size,
    type: 'square',
  };
}
