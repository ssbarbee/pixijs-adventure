import { CircularRoom } from '../types';

export function createCircularRoom(id: string, x: number, y: number, radius: number): CircularRoom {
  return {
    id,
    x,
    y,
    radius,
    type: 'circular',
    children: [],
    connections: [],
    obstacles: [],
  };
}
