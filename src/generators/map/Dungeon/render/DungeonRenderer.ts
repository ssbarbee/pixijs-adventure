import { Container, Graphics, Text } from 'pixi.js';

import { Manager } from '../../../../Manager';
import { CircularRoom, ConnectableRoom, ConnectionRoom, Dungeon, RectangleRoom } from '../types';
const roomScaleFactor = 15;

export class DungeonRenderer {
  private dungeon: Dungeon;
  private graphics: Graphics;
  private container: Container;
  private offsetX: number;
  private offsetY: number;

  constructor(dungeon: Dungeon, container: Container) {
    this.dungeon = dungeon;
    this.graphics = new Graphics();
    this.container = container;
    this.offsetX = Manager.width / 2; // Center of the screen
    this.offsetY = Manager.height / 2;
  }

  draw(): void {
    // Use a queue for breadth-first traversal
    const queue: ConnectableRoom[] = [this.dungeon.root];

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      if (currentRoom.type === 'rectangle') {
        this.drawRectangleRoom(currentRoom as RectangleRoom);
      } else if (currentRoom.type === 'circular') {
        this.drawCircularRoom(currentRoom as CircularRoom);
      }
      // Draw connections and add children to the queue
      currentRoom.connections.forEach((connection, index) => {
        this.drawConnection(connection);
        queue.push(currentRoom.children[index]);
      });
    }

    this.container.addChild(this.graphics);
  }

  private drawRectangleRoom(room: RectangleRoom): void {
    this.graphics.beginFill(0x9966ff); // Purple color for RectangleRoom
    this.graphics.drawRect(
      room.x * roomScaleFactor + this.offsetX,
      room.y * roomScaleFactor + this.offsetY,
      room.width * roomScaleFactor,
      room.height * roomScaleFactor,
    );
    this.graphics.endFill();

    // Draw a red dot at the x,y point
    this.drawRedDot(room.x, room.y);
    // Draw Room ID
    this.drawRoomID(room);
  }

  private drawCircularRoom(room: CircularRoom): void {
    this.graphics.beginFill(0x0099ff);
    this.graphics.drawCircle(
      room.x * roomScaleFactor + this.offsetX,
      room.y * roomScaleFactor + this.offsetY,
      room.radius * roomScaleFactor,
    );
    this.graphics.endFill();

    // Draw a red dot at the x,y point
    this.drawRedDot(room.x, room.y);
    // Draw Room ID
    this.drawRoomID(room);
  }

  private drawConnection(room: ConnectionRoom): void {
    this.graphics.beginFill(0xff9933); // Orange color for ConnectionRoom
    this.graphics.drawRect(
      room.x * roomScaleFactor + this.offsetX,
      room.y * roomScaleFactor + this.offsetY,
      room.width * roomScaleFactor,
      room.height * roomScaleFactor,
    );
    this.graphics.endFill();

    // Draw a red dot at the x,y point
    this.drawRedDot(room.x, room.y);
    // Draw Room ID
    this.drawRoomID(room);
  }

  private drawRedDot(x: number, y: number): void {
    this.graphics.beginFill(0xff0000); // Red color
    this.graphics.drawCircle(
      x * roomScaleFactor + this.offsetX,
      y * roomScaleFactor + this.offsetY,
      2, // Radius of the dot
    );
    this.graphics.endFill();
  }

  private drawRoomID(room: ConnectableRoom | ConnectionRoom): void {
    const idText = new Text(`${room.id}`, { fontSize: roomScaleFactor / 1.5, fill: 0xffffff });
    idText.x = room.x * roomScaleFactor + this.offsetX;
    idText.y = room.y * roomScaleFactor + this.offsetY;
    this.graphics.addChild(idText);
  }
}
