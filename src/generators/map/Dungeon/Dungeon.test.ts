import {
  checkOverlapRecursive,
  createConnectionRoom,
  createRectangleRoom,
  Direction,
  getRandomConnectionLength,
  getRandomNumber,
  getRandomRectangleRoomSize,
  MAX_CONNECTION_LENGTH,
  MAX_RECTANGLE_ROOM_SIZE,
  MIN_CONNECTION_LENGTH,
  MIN_RECTANGLE_ROOM_SIZE,
  RectangleRoom,
  roomsOverlap,
  setPositionAndDimensions,
} from './Dungeon';

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

  describe('getRandomRoomSize', () => {
    it('should return a room size within the predefined range', () => {
      const size = getRandomRectangleRoomSize();
      expect(size).toBeGreaterThanOrEqual(MIN_RECTANGLE_ROOM_SIZE);
      expect(size).toBeLessThanOrEqual(MAX_RECTANGLE_ROOM_SIZE);
    });
  });

  describe('getRandomConnectionLength', () => {
    it('should return a connection length within the predefined range', () => {
      const length = getRandomConnectionLength();
      expect(length).toBeGreaterThanOrEqual(MIN_CONNECTION_LENGTH);
      expect(length).toBeLessThanOrEqual(MAX_CONNECTION_LENGTH);
    });
  });

  describe('checkOverlapRecursive', () => {
    it('should detect overlap between rooms recursively', () => {
      const parentRoom = createRectangleRoom('parent', 0, 0, 10, 10);
      const childRoom = createRectangleRoom('child', 5, 5, 10, 10);
      parentRoom.children.push(childRoom);

      const newRoom = createRectangleRoom('new', 8, 8, 5, 5);
      expect(checkOverlapRecursive(parentRoom, newRoom)).toBeTruthy();
    });

    it('should not detect overlap if rooms do not overlap', () => {
      const parentRoom = createRectangleRoom('parent', 0, 0, 10, 10);
      const childRoom = createRectangleRoom('child', 15, 15, 10, 10);
      parentRoom.children.push(childRoom);

      const newRoom = createRectangleRoom('new', 30, 30, 5, 5);
      expect(checkOverlapRecursive(parentRoom, newRoom)).toBeFalsy();
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

  describe('createConnectionRoom', () => {
    it('should create a connection room with the given parameters', () => {
      const id = 'connection1';
      const room = createConnectionRoom(id, 1, 1, 2, 3);
      expect(room).toEqual({
        id,
        x: 1,
        y: 1,
        width: 2,
        height: 3,
        type: 'connection',
      });
    });
  });

  describe('setPositionAndDimensions', () => {
    let originalRandom: () => number;

    beforeEach(() => {
      originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5); // Always returns 0.5
    });

    afterEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Math.random = originalRandom;
    });

    const parent = createRectangleRoom('parent', 10, 10, 5, 5);
    const child = createRectangleRoom('child', 0, 0, 3, 3);
    const connectionSize = 3;

    it.each([
      [Direction.Right, { x: 15, y: 12, width: connectionSize, height: 1 }],
      [Direction.Bottom, { x: 12, y: 15, width: 1, height: connectionSize }],
      [Direction.Left, { x: 7, y: 12, width: connectionSize, height: 1 }],
      [Direction.Top, { x: 12, y: 7, width: 1, height: connectionSize }],
    ])('should set correct position and dimensions for direction %s', (direction, expected) => {
      const result = setPositionAndDimensions(direction, parent, child, connectionSize);
      expect(result).toEqual(expected);
    });
  });

  describe('roomsOverlap', () => {
    test('should return true for overlapping rooms', () => {
      const room1: RectangleRoom = {
        id: '1',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };
      const room2: RectangleRoom = {
        id: '2',
        x: 5,
        y: 5,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };

      expect(roomsOverlap(room1, room2)).toBe(true);
    });

    test('should return false for non-overlapping rooms', () => {
      const room1: RectangleRoom = {
        id: '1',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };
      const room2: RectangleRoom = {
        id: '2',
        x: 20,
        y: 20,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };

      expect(roomsOverlap(room1, room2)).toBe(false);
    });

    test('should return false for rooms touching but not overlapping horizontally', () => {
      const room1: RectangleRoom = {
        id: '1',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };
      const room2: RectangleRoom = {
        id: '2',
        x: 10,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };

      expect(roomsOverlap(room1, room2)).toBe(false);
    });

    test('should return false for rooms touching but not overlapping vertically', () => {
      const room1: RectangleRoom = {
        id: '1',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };
      const room2: RectangleRoom = {
        id: '2',
        x: 0,
        y: 10,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };

      expect(roomsOverlap(room1, room2)).toBe(false);
    });

    test('should return true for a room completely inside another room', () => {
      const room1: RectangleRoom = {
        id: '1',
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        type: 'rectangle',
        children: [],
        connections: [],
      };
      const room2: RectangleRoom = {
        id: '2',
        x: 5,
        y: 5,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };

      expect(roomsOverlap(room1, room2)).toBe(true);
    });

    test('should return true for a room that is the same size and position as another room', () => {
      const room1: RectangleRoom = {
        id: '1',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };
      const room2: RectangleRoom = {
        id: '2',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        type: 'rectangle',
        children: [],
        connections: [],
      };

      expect(roomsOverlap(room1, room2)).toBe(true);
    });
  });
});
