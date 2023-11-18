import { createRectangleRoom, getRandomNumber, roomsOverlap } from './Dungeon'; // Replace with your actual module path

describe('Dungeon', () => {
  describe('getRandomNumber', () => {
    it('should return a number within the given range', () => {
      const min = 1;
      const max = 10;
      const number = getRandomNumber(min, max);
      expect(number).toBeGreaterThanOrEqual(min);
      expect(number).toBeLessThanOrEqual(max);
    });
  });

  describe('roomsOverlap', () => {
    it('should return true if rooms overlap', () => {
      const room1 = createRectangleRoom('1', 0, 0, 5, 5);
      const room2 = createRectangleRoom('2', 3, 3, 5, 5);
      expect(roomsOverlap(room1, room2)).toBeTruthy();
    });

    it('should return false if rooms do not overlap', () => {
      const room1 = createRectangleRoom('1', 0, 0, 5, 5);
      const room2 = createRectangleRoom('2', 10, 10, 5, 5);
      expect(roomsOverlap(room1, room2)).toBeFalsy();
    });
  });

  describe('createRectangleRoom', () => {
    it('should create a rectangle room with the given parameters', () => {
      const id = 'testRoom';
      const x = 0;
      const y = 0;
      const width = 5;
      const height = 5;
      const room = createRectangleRoom(id, x, y, width, height);

      expect(room).toEqual({
        id,
        x,
        y,
        width,
        height,
        type: 'rectangle',
        children: [],
        connections: [],
      });
    });
  });
});
