import { CircularRoom, ConnectableRoom, Direction, RectangleRoom } from '../types';
import { getRandomNumber } from './getRandomNumber';

const CONNECTION_ROOM_OFFSET = 0.1;

export function setPositionAndDimensionsCircularRectangleRooms(
  direction: Direction,
  parent: CircularRoom,
  child: RectangleRoom,
  connectionSize: number,
): { x: number; y: number; width: number; height: number } {
  let x, y, width, height;

  switch (direction) {
    case Direction.Right:
      x = parent.x + parent.radius - CONNECTION_ROOM_OFFSET; // Connection starts at the edge of the circle
      y = parent.y - 0.5; // Vertically centered on the parent
      width = connectionSize;
      height = 1;
      child.x = x + width;
      child.y = y - getRandomNumber(1, Math.floor(child.height / 2));
      break;
    case Direction.Bottom:
      x = parent.x - 0.5; // Horizontally centered on the parent
      y = parent.y + parent.radius - CONNECTION_ROOM_OFFSET; // Connection starts at the edge of the circle
      width = 1;
      height = connectionSize;
      child.x = x - getRandomNumber(1, Math.floor(child.width / 2));
      child.y = y + height; // The child's y starts after the connection
      break;
    case Direction.Left:
      x = parent.x - parent.radius - connectionSize + CONNECTION_ROOM_OFFSET; // Connection starts at the left edge of the circle
      y = parent.y - 0.5; // Vertically centered on the parent
      width = connectionSize;
      height = 1;
      child.x = x - child.width; // The child's x ends at the connection's start
      child.y = y - getRandomNumber(1, Math.floor(child.height / 2)); // Center the child vertically
      break;
    case Direction.Top:
      x = parent.x - 0.5; // Horizontally centered on the parent
      y = parent.y - parent.radius - connectionSize + CONNECTION_ROOM_OFFSET; // Connection starts at the top edge of the circle
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
      child.x = x + width + child.radius - CONNECTION_ROOM_OFFSET;
      child.y = y + height / 2;
      break;
    case Direction.Bottom:
      x = parent.x + (parent.width - getRandomNumber(1, parent.width - 1));
      y = parent.y + parent.height;
      width = 1;
      height = connectionSize;
      child.x = x + width / 2;
      child.y = y + height + child.radius - CONNECTION_ROOM_OFFSET;
      break;
    case Direction.Left:
      x = parent.x - connectionSize;
      y = parent.y + (parent.height - getRandomNumber(1, parent.height - 1));
      width = connectionSize;
      height = 1;
      child.x = x - child.radius + CONNECTION_ROOM_OFFSET;
      child.y = y + height / 2;
      break;
    case Direction.Top:
      x = parent.x + (parent.width - getRandomNumber(1, parent.width - 1));
      y = parent.y - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x + width / 2;
      child.y = y - child.radius + CONNECTION_ROOM_OFFSET;
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
      x = parent.x + parent.radius - CONNECTION_ROOM_OFFSET;
      y = parent.y - 0.5;
      width = connectionSize;
      height = 1;
      child.x = x + width + child.radius - CONNECTION_ROOM_OFFSET;
      child.y = parent.y;
      break;
    case Direction.Bottom:
      x = parent.x - 0.5;
      y = parent.y + parent.radius - CONNECTION_ROOM_OFFSET;
      width = 1;
      height = connectionSize;
      child.x = parent.x;
      child.y = y + height + child.radius - CONNECTION_ROOM_OFFSET;
      break;
    case Direction.Left:
      x = parent.x - parent.radius - connectionSize + CONNECTION_ROOM_OFFSET;
      y = parent.y - 0.5;
      width = connectionSize;
      height = 1;
      child.x = x - child.radius + CONNECTION_ROOM_OFFSET;
      child.y = parent.y;
      break;
    case Direction.Top:
      x = parent.x - 0.5;
      y = parent.y - parent.radius - connectionSize + CONNECTION_ROOM_OFFSET;
      width = 1;
      height = connectionSize;
      child.x = parent.x;
      child.y = y - child.radius + CONNECTION_ROOM_OFFSET;
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
