import { getRandomNumber } from '../utils/getRandomNumber';
import { MAX_CIRCLE_ROOM_SIZE, MIN_CIRCLE_ROOM_SIZE } from './constants';

export function getRandomCircleRoomSize(): number {
  return getRandomNumber(MIN_CIRCLE_ROOM_SIZE, MAX_CIRCLE_ROOM_SIZE);
}
