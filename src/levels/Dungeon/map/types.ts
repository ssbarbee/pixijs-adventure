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

export interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Enum for directions
export enum Direction {
  Right,
  Bottom,
  Left,
  Top,
}

export interface Dungeon {
  root: ConnectableRoom;
  grid: (ConnectableRoom | ConnectionRoom)[][][];
  gridSize: number;
  width: number;
  height: number;
}
