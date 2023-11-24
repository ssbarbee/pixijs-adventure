import { createCircularRoom } from '../circular/createCircularRoom';
import { getRandomCircleRoomSize } from '../circular/getRandomCircleRoomSize';
import { createRectangleRoom } from '../rectangle/createRectangleRoom';
import { getRandomRectangleRoomSize } from '../rectangle/getRandomRectangleRoomSize';
import { ConnectableRoom } from '../types';

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
