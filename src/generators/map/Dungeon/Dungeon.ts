/* eslint-disable @typescript-eslint/no-use-before-define */
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
export const WALL_THICKNESS = 0.1; // Adjust as per your requirement

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

export function setPositionAndDimensionsCircularRectangleRooms(
  direction: Direction,
  parent: CircularRoom,
  child: RectangleRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  let x, y, width, height;

  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.radius - WALL_THICKNESS; // Connection starts at the edge of the circle
      y = parent.y - 0.5; // Vertically centered on the parent
      width = connectionSize;
      height = 1;
      child.x = x + width;
      child.y = y - getRandomNumber(1, Math.floor(child.height / 2));
      break;
    case Direction.Bottom:
      x = parent.x - 0.5; // Horizontally centered on the parent
      y = parent.y + parent.radius - WALL_THICKNESS; // Connection starts at the edge of the circle
      width = 1;
      height = connectionSize;
      child.x = x - getRandomNumber(1, Math.floor(child.width / 2));
      child.y = y + height; // The child's y starts after the connection
      break;
    case Direction.Left:
      x = parent.x - parent.radius - connectionSize + WALL_THICKNESS; // Connection starts at the left edge of the circle
      y = parent.y - 0.5; // Vertically centered on the parent
      width = connectionSize;
      height = 1;
      child.x = x - child.width; // The child's x ends at the connection's start
      child.y = y - getRandomNumber(1, Math.floor(child.height / 2)); // Center the child vertically
      break;
    case Direction.Top:
      x = parent.x - 0.5; // Horizontally centered on the parent
      y = parent.y - parent.radius - connectionSize + WALL_THICKNESS; // Connection starts at the top edge of the circle
      width = 1;
      height = connectionSize;
      child.x = x - getRandomNumber(1, Math.floor(child.width / 2));
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

  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.width;
      y = parent.y + (parent.height - getRandomNumber(1, parent.height - 1));
      width = connectionSize;
      height = 1;
      child.x = x + width + child.radius - WALL_THICKNESS;
      child.y = y + height / 2;
      break;
    case Direction.Bottom:
      x = parent.x + (parent.width - getRandomNumber(1, parent.width - 1));
      y = parent.y + parent.height;
      width = 1;
      height = connectionSize;
      child.x = x + width / 2;
      child.y = y + height + child.radius - WALL_THICKNESS;
      break;
    case Direction.Left:
      x = parent.x - connectionSize;
      y = parent.y + (parent.height - getRandomNumber(1, parent.height - 1));
      width = connectionSize;
      height = 1;
      child.x = x - child.radius + WALL_THICKNESS;
      child.y = y + height / 2;
      break;
    case Direction.Top:
      x = parent.x + (parent.width - getRandomNumber(1, parent.width - 1));
      y = parent.y - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x + width / 2;
      child.y = y - child.radius + WALL_THICKNESS;
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
      x = parent.x + parent.radius - WALL_THICKNESS;
      y = parent.y - 0.5;
      width = connectionSize;
      height = 1;
      child.x = x + width + child.radius - WALL_THICKNESS;
      child.y = parent.y;
      break;
    case Direction.Bottom:
      x = parent.x - 0.5;
      y = parent.y + parent.radius - WALL_THICKNESS;
      width = 1;
      height = connectionSize;
      child.x = parent.x;
      child.y = y + height + child.radius - WALL_THICKNESS;
      break;
    case Direction.Left:
      x = parent.x - parent.radius - connectionSize + WALL_THICKNESS;
      y = parent.y - 0.5;
      width = connectionSize;
      height = 1;
      child.x = x - child.radius + WALL_THICKNESS;
      child.y = parent.y;
      break;
    case Direction.Top:
      x = parent.x - 0.5;
      y = parent.y - parent.radius - connectionSize + WALL_THICKNESS;
      width = 1;
      height = connectionSize;
      child.x = parent.x;
      child.y = y - child.radius + WALL_THICKNESS;
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
      y = parent.y + (parent.height - getRandomNumber(1, parent.height - 1));
      width = connectionSize;
      height = 1;
      child.x = x + width;
      child.y = y - getRandomNumber(1, Math.floor(child.height / 2));
      break;
    case Direction.Bottom:
      x = parent.x + (parent.width - getRandomNumber(1, parent.width - 1));
      y = parent.y + parent.height;
      width = 1;
      height = connectionSize;
      child.x = x - getRandomNumber(1, Math.floor(child.width / 2));
      child.y = y + height;
      break;
    case Direction.Left:
      x = parent.x - connectionSize;
      y = parent.y + (parent.height - getRandomNumber(1, parent.height - 1));
      width = connectionSize;
      height = 1;
      child.x = x - child.width;
      child.y = y - getRandomNumber(1, Math.floor(child.height / 2));
      break;
    case Direction.Top:
      x = parent.x + (parent.width - getRandomNumber(1, parent.width - 1));
      y = parent.y - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x - getRandomNumber(1, Math.floor(child.width / 2));
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

// export function generateDungeon(totalRooms: number): Dungeon {
//   let roomsCount = 0;
//   const root = createRoom(roomsCount.toString());
//   roomsCount++;
//   const queue: ConnectableRoom[] = [root];
//
//   while (roomsCount < totalRooms) {
//     const currentRoom = queue.length > 0 ? queue.shift()! : selectRandomRoom(root);
//
//     for (let i = 0; i < 4; i++) {
//       if (Math.random() < 0.5) {
//         const newRoom = createRoom(roomsCount.toString());
//         const connection = createConnection(root, currentRoom, newRoom);
//
//         if (connection) {
//           currentRoom.children.push(newRoom);
//           currentRoom.connections.push(connection);
//           queue.push(newRoom);
//           roomsCount++;
//         }
//
//         if (roomsCount >= totalRooms) break;
//       }
//     }
//   }
//
//   return { root };
// }
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

function findMaxCoordinates(items: (ConnectableRoom | ConnectionRoom)[]): {
  maxX: number;
  maxY: number;
} {
  let maxX = -Infinity;
  let maxY = -Infinity;

  items.forEach((item) => {
    const bounds = getItemBounds(item);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

  return { maxX, maxY };
}

function determineGridSize(dungeonWidth: number, dungeonHeight: number): number {
  // Example: Use a fraction of the dungeon's width or height, or a fixed value
  // Adjust this logic based on your game's requirements
  return Math.max(1, Math.min(dungeonWidth, dungeonHeight) / 10);
}

function findMinCoordinates(items: (ConnectableRoom | ConnectionRoom)[]): {
  minX: number;
  minY: number;
} {
  let minX = Infinity;
  let minY = Infinity;

  items.forEach((item) => {
    const bounds = getItemBounds(item);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
  });

  return { minX, minY };
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
// Helper function to check if a point is inside a rectangle
interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

function isPointInsideRectangle(rect: IRectangle, x: number, y: number): boolean {
  return x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
}

// Helper function to check if a point is inside a circle
function isPointInsideCircle(circle: CircularRoom, x: number, y: number): boolean {
  const dx = x - circle.x;
  const dy = y - circle.y;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared < circle.radius * circle.radius;
}

// Main function to check if the player's square is hitting a wall
export function isWallAt(x: number, y: number, dungeon: Dungeon): boolean {
  const { gridSize, grid } = dungeon;
  const roomOrConnection = getRoomAt(x, y, grid, gridSize);
  if (!roomOrConnection) {
    // If no room or connection is found at the position, it's likely a wall or empty space
    return true;
  }

  // Additional logic here if needed, to determine if the point is on the wall of the room
  // This part depends on how you define the walls in your rooms and connections

  return false; // Modify as needed based on your game's logic
}

// Grid-based spatial partitioning system
function createEmptyGrid(
  dungeonWidth: number,
  dungeonHeight: number,
  gridSize: number,
): (ConnectableRoom | ConnectionRoom)[][][] {
  const gridWidth = Math.ceil(dungeonWidth / gridSize);
  const gridHeight = Math.ceil(dungeonHeight / gridSize);
  const grid: (ConnectableRoom | ConnectionRoom)[][][] = new Array<
    (ConnectableRoom | ConnectionRoom)[][]
  >(gridWidth);

  for (let x = 0; x < gridWidth; x++) {
    grid[x] = new Array<(ConnectableRoom | ConnectionRoom)[]>(gridHeight);
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = [];
    }
  }

  return grid;
}

function getItemBounds(item: ConnectableRoom | ConnectionRoom): IRectangle {
  if (item.type === 'rectangle') {
    // For rectangular rooms, return the position and dimensions as is
    return {
      x: item.x,
      y: item.y,
      width: (item as RectangleRoom).width,
      height: (item as RectangleRoom).height,
    };
  } else if (item.type === 'circular') {
    // For circular rooms, calculate the bounding box
    return {
      x: item.x - (item as CircularRoom).radius,
      y: item.y - (item as CircularRoom).radius,
      width: (item as CircularRoom).radius * 2,
      height: (item as CircularRoom).radius * 2,
    };
  } else if (item.type === 'connection') {
    // For connections, assume they are rectangular
    return {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    };
  }

  throw new Error('Unknown item type');
}

function addToGrid(
  item: ConnectableRoom | ConnectionRoom,
  grid: (ConnectableRoom | ConnectionRoom)[][][],
  gridSize: number,
): void {
  const bounds = getItemBounds(item);
  const startX = Math.floor(bounds.x / gridSize);
  const endX = Math.floor((bounds.x + bounds.width) / gridSize);
  const startY = Math.floor(bounds.y / gridSize);
  const endY = Math.floor((bounds.y + bounds.height) / gridSize);

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (grid[x] && grid[x][y]) {
        grid[x][y].push(item);
      }
    }
  }
}

function isPointInsideItem(x: number, y: number, item: ConnectableRoom | ConnectionRoom): boolean {
  if (item.type === 'rectangle' || item.type === 'connection') {
    // Rectangular room or connection
    return isPointInsideRectangle(item as RectangleRoom, x, y);
  } else if (item.type === 'circular') {
    // Circular room
    return isPointInsideCircle(item as CircularRoom, x, y);
  }
  return false;
}

function getRoomAt(
  x: number,
  y: number,
  grid: (ConnectableRoom | ConnectionRoom)[][][],
  gridSize: number,
): ConnectableRoom | ConnectionRoom | null {
  const gridX = Math.floor(x / gridSize);
  const gridY = Math.floor(y / gridSize);

  if (grid[gridX] && grid[gridX][gridY]) {
    const items = grid[gridX][gridY];
    for (const item of items) {
      if (isPointInsideItem(x, y, item)) {
        return item;
      }
    }
  }

  return null;
}
