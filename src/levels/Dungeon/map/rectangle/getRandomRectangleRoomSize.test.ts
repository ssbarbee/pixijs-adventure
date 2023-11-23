import { MAX_RECTANGLE_ROOM_SIZE, MIN_RECTANGLE_ROOM_SIZE } from './constants';
import { getRandomRectangleRoomSize } from './getRandomRectangleRoomSize';

describe('getRandomRectangleRoomSize', () => {
  it('should return a room size within the predefined range', () => {
    const size = getRandomRectangleRoomSize();
    expect(size).toBeGreaterThanOrEqual(MIN_RECTANGLE_ROOM_SIZE);
    expect(size).toBeLessThanOrEqual(MAX_RECTANGLE_ROOM_SIZE);
  });
});
