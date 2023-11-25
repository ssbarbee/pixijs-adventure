import { createCircularRoom } from '../circular/createCircularRoom';
import { getRandomCircleRoomSize } from '../circular/getRandomCircleRoomSize';
import { addObstaclesToRoom } from '../Dungeon';
import { createRectangleRoom } from '../rectangle/createRectangleRoom';
import { getRandomRectangleRoomSize } from '../rectangle/getRandomRectangleRoomSize';
import { ConnectableRoom } from '../types';

// Function to randomly decide the room type
function getRandomRoomType(): 'rectangle' | 'circular' {
  return 'rectangle';
  return Math.random() < 0.5 ? 'rectangle' : 'circular';
}

export function createRoom(id: string): ConnectableRoom {
  const roomType = getRandomRoomType();
  let room: ConnectableRoom | null = null;
  if (roomType === 'rectangle') {
    const width = getRandomRectangleRoomSize();
    const height = getRandomRectangleRoomSize();
    room = createRectangleRoom(id, 0, 0, width, height);
  }

  if (roomType === 'circular') {
    const radius = getRandomCircleRoomSize();
    room = createCircularRoom(id, 0, 0, radius);
  }

  if (!room) {
    throw new Error(`createRoom: not supported room type! id: ${id} type: ${roomType}`);
  }

  addObstaclesToRoom(room);

  return room;
}
