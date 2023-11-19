import { getRandomNumber } from '../utils/getRandomNumber';
import { MAX_RECTANGLE_ROOM_SIZE, MIN_RECTANGLE_ROOM_SIZE } from './constants';

export function getRandomRectangleRoomSize(): number {
  return getRandomNumber(MIN_RECTANGLE_ROOM_SIZE, MAX_RECTANGLE_ROOM_SIZE);
}
