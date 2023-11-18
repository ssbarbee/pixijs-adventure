class Room {
  id: string;
  x: number;
  y: number;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

export class RectangleRoom extends Room {
  width: number;
  height: number;
  children: RectangleRoom[];
  connections: ConnectionRoom[];

  constructor(id: string, x: number, y: number, width: number, height: number) {
    super(id, x, y);
    this.width = width;
    this.height = height;
    this.children = [];
    this.connections = [];
  }
}

export class ConnectionRoom extends Room {
  width: number;
  height: number;

  constructor(id: string, x: number, y: number, width: number, height: number) {
    super(id, x, y);
    this.width = width;
    this.height = height;
  }
}

export class Dungeon {
  root: RectangleRoom;
  totalRooms: number;
  roomsCount: number = 0;

  constructor(totalRooms: number) {
    this.totalRooms = totalRooms;
    this.root = this.createInitialRoom();
    this.generateDungeon();
  }

  createInitialRoom(): RectangleRoom {
    // Start the initial room at a fixed point in the dungeon coordinate system
    const initialX = 0;
    const initialY = 0;

    const width = this.getRandomSize();
    const height = this.getRandomSize();

    this.roomsCount++;
    return new RectangleRoom('0', initialX, initialY, width, height);
  }

  generateDungeon() {
    const queue: RectangleRoom[] = [this.root];

    while (this.roomsCount < this.totalRooms) {
      const currentRoom = queue.length > 0 ? queue.shift()! : this.selectRandomRoom();

      for (let i = 0; i < 4; i++) {
        // Attempt to generate up to 4 connections
        if (Math.random() < 0.5) {
          // 50% chance to create a child
          const newRoom = this.createRoom(this.roomsCount);
          const connection = this.createConnection(currentRoom, newRoom);

          if (connection !== null) {
            // Ensure a connection was successfully created
            currentRoom.children.push(newRoom);
            currentRoom.connections.push(connection);
            queue.push(newRoom);
            this.roomsCount++;
          }

          if (this.roomsCount >= this.totalRooms) break;
        }
      }
    }
  }

  selectRandomRoom(): RectangleRoom {
    // Select a random room from the existing rooms
    // This assumes that `this.root` maintains a list or way to access all existing rooms
    const allRooms = this.getAllRooms();
    return allRooms[Math.floor(Math.random() * allRooms.length)];
  }

  getAllRooms(): RectangleRoom[] {
    const allRooms: RectangleRoom[] = [];
    const queue: RectangleRoom[] = [this.root];

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      allRooms.push(currentRoom);

      for (const child of currentRoom.children) {
        queue.push(child);
      }
    }

    return allRooms;
  }

  createRoom(id: number): RectangleRoom {
    // Random size for the new room
    const width = this.getRandomSize();
    const height = this.getRandomSize();

    // For now, position the new room at (0, 0). It will be repositioned when the connection is created.
    return new RectangleRoom(id.toString(), 0, 0, width, height);
  }

  getRandomConnectionLength(): number {
    return Math.floor(Math.random() * 3) + 1; // Random length between 1 and 3
  }

  getRandomSize(): number {
    return Math.floor(Math.random() * 4) + 3; // Random size between 3 and 6
  }

  createConnection(parent: RectangleRoom, child: RectangleRoom): ConnectionRoom | null {
    const connectionSize = this.getRandomConnectionLength();
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
    while (this.checkOverlap(child) && attempts < 10) {
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

    if (this.checkOverlap(child)) {
      // console.log('Unable to position room without overlap.');
      return null;
    }

    return new ConnectionRoom(`${parent.id}->${child.id}`, x, y, width, height);
  }

  checkOverlap(newRoom: RectangleRoom): boolean {
    return this.checkOverlapRecursive(this.root, newRoom);
  }

  checkOverlapRecursive(currentRoom: RectangleRoom, newRoom: RectangleRoom): boolean {
    if (this.roomsOverlap(currentRoom, newRoom)) {
      return true;
    }

    for (const child of currentRoom.children) {
      if (this.checkOverlapRecursive(child, newRoom)) {
        return true;
      }
    }

    return false;
  }

  roomsOverlap(room1: RectangleRoom, room2: RectangleRoom): boolean {
    // Basic AABB collision detection
    return (
      room1.x < room2.x + room2.width &&
      room1.x + room1.width > room2.x &&
      room1.y < room2.y + room2.height &&
      room1.y + room1.height > room2.y
    );
  }
}
