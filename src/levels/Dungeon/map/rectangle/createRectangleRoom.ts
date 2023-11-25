import { RectangleRoom } from '../types';

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
    obstacles: [],
  };
}
