import { getRandomNumber } from '../utils/getRandomNumber';
import { MAX_CONNECTION_LENGTH, MIN_CONNECTION_LENGTH } from './constants';

export function getRandomConnectionLength(): number {
  return getRandomNumber(MIN_CONNECTION_LENGTH, MAX_CONNECTION_LENGTH);
}
