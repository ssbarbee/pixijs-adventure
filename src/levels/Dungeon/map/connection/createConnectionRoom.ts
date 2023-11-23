import { ConnectionRoom } from '../types';

export function createConnectionRoom(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
): ConnectionRoom {
  return {
    id,
    x,
    y,
    width,
    height,
    type: 'connection',
  };
}
