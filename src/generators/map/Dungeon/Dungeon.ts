interface BaseRoom {
  id: string;
  x: number;
  y: number;
  type: 'rectangle' | 'connection';
}

export interface RectangleRoom extends BaseRoom {
  type: 'rectangle';
  width: number;
  height: number;
  children: RectangleRoom[];
  connections: ConnectionRoom[];
}

export interface ConnectionRoom extends BaseRoom {
  type: 'connection';
  width: number;
  height: number;
}

export interface Dungeon {
  root: RectangleRoom;
}

function getRandomSize(): number {
  return Math.floor(Math.random() * 4) + 3; // Random size between 3 and 6
}

function getRandomConnectionLength(): number {
  return Math.floor(Math.random() * 3) + 1; // Random length between 1 and 3
}

function roomsOverlap(room1: RectangleRoom, room2: RectangleRoom): boolean {
  // Basic AABB collision detection
  return (
    room1.x < room2.x + room2.width &&
    room1.x + room1.width > room2.x &&
    room1.y < room2.y + room2.height &&
    room1.y + room1.height > room2.y
  );
}

function checkOverlapRecursive(currentRoom: RectangleRoom, newRoom: RectangleRoom): boolean {
  if (roomsOverlap(currentRoom, newRoom)) {
    return true;
  }

  for (const child of currentRoom.children) {
    if (checkOverlapRecursive(child, newRoom)) {
      return true;
    }
  }

  return false;
}

function checkOverlap(root: RectangleRoom, newRoom: RectangleRoom): boolean {
  return checkOverlapRecursive(root, newRoom);
}

function createRectangleRoom(
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
  };
}

function createConnectionRoom(
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

function createRoom(id: string): RectangleRoom {
  const width = getRandomSize();
  const height = getRandomSize();
  return createRectangleRoom(id, 0, 0, width, height);
}

function createConnection(
  root: RectangleRoom,
  parent: RectangleRoom,
  child: RectangleRoom,
): ConnectionRoom | null {
  const connectionSize = getRandomConnectionLength();
  let x = 0,
    y = 0,
    width = 0,
    height = 0;

  // Randomly decide the wall (direction) for the connection
  const direction = Math.floor(Math.random() * 4); // 0: right, 1: bottom, 2: left, 3: top

  switch (direction) {
    case 0: // Right
      x = parent.x + parent.width;
      y = parent.y + Math.random() * (parent.height - 1);
      width = connectionSize;
      height = 1;
      child.x = x + width;
      child.y = y;
      break;
    case 1: // Bottom
      x = parent.x + Math.random() * (parent.width - 1);
      y = parent.y + parent.height;
      width = 1;
      height = connectionSize;
      child.x = x;
      child.y = y + height;
      break;
    case 2: // Left
      x = parent.x - connectionSize;
      y = parent.y + Math.random() * (parent.height - 1);
      width = connectionSize;
      height = 1;
      child.x = x - child.width;
      child.y = y;
      break;
    case 3: // Top
      x = parent.x + Math.random() * (parent.width - 1);
      y = parent.y - connectionSize;
      width = 1;
      height = connectionSize;
      child.x = x;
      child.y = y - child.height;
      break;
  }

  let attempts = 0;
  while (checkOverlap(root, child) && attempts < 10) {
    // Randomly adjust the child's position
    child.x += (Math.random() - 0.5) * parent.width;
    child.y += (Math.random() - 0.5) * parent.height;

    // Recalculate the connection position based on the new child position
    switch (direction) {
      case 0: // Right
        x = parent.x + parent.width;
        y = parent.y + Math.random() * (parent.height - 1);
        width = connectionSize;
        height = 1;
        child.x = x + width;
        child.y = y;
        break;
      case 1: // Bottom
        x = parent.x + Math.random() * (parent.width - 1);
        y = parent.y + parent.height;
        width = 1;
        height = connectionSize;
        child.x = x;
        child.y = y + height;
        break;
      case 2: // Left
        x = parent.x - connectionSize;
        y = parent.y + Math.random() * (parent.height - 1);
        width = connectionSize;
        height = 1;
        child.x = x - child.width;
        child.y = y;
        break;
      case 3: // Top
        x = parent.x + Math.random() * (parent.width - 1);
        y = parent.y - connectionSize;
        width = 1;
        height = connectionSize;
        child.x = x;
        child.y = y - child.height;
        break;
    }

    attempts++;
  }

  if (checkOverlap(root, child)) {
    // console.log('Unable to position room without overlap.');
    return null;
  }

  return createConnectionRoom(`${parent.id}->${child.id}`, x, y, width, height);
}

function createInitialRoom(): RectangleRoom {
  const initialX = 0;
  const initialY = 0;
  const width = getRandomSize();
  const height = getRandomSize();
  return createRectangleRoom('0', initialX, initialY, width, height);
}

export function generateDungeon(totalRooms: number): Dungeon {
  const root = createInitialRoom();
  let roomsCount = 1;
  const queue: RectangleRoom[] = [root];

  while (roomsCount < totalRooms) {
    const currentRoom = queue.length > 0 ? queue.shift()! : selectRandomRoom(root);

    for (let i = 0; i < 4; i++) {
      if (Math.random() < 0.5) {
        const newRoom = createRoom(roomsCount.toString());
        const connection = createConnection(root, currentRoom, newRoom);

        if (connection) {
          currentRoom.children.push(newRoom);
          currentRoom.connections.push(connection);
          queue.push(newRoom);
          roomsCount++;
        }

        if (roomsCount >= totalRooms) break;
      }
    }
  }

  return { root };
}

function getAllRooms(root: RectangleRoom): RectangleRoom[] {
  const allRooms: RectangleRoom[] = [];
  const queue: RectangleRoom[] = [root];

  while (queue.length > 0) {
    const currentRoom = queue.shift()!;
    allRooms.push(currentRoom);
    currentRoom.children.forEach((child) => queue.push(child));
  }

  return allRooms;
}

function selectRandomRoom(root: RectangleRoom): RectangleRoom {
  const allRooms = getAllRooms(root);
  return allRooms[Math.floor(Math.random() * allRooms.length)];
}
