import { Container, Graphics, Text } from 'pixi.js';

import { Manager } from '../../../Manager';
import { ConnectionRoom, Dungeon, RectangleRoom } from './Dungeon';
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
    const queue: RectangleRoom[] = [this.dungeon.root];

    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      this.drawRoom(currentRoom);

      // Draw connections and add children to the queue
      currentRoom.connections.forEach((connection, index) => {
        this.drawConnection(connection);
        queue.push(currentRoom.children[index]);
      });
    }

    this.container.addChild(this.graphics);
  }

  private drawRoom(room: RectangleRoom): void {
    this.graphics.beginFill(0x9966ff); // Purple color for RectangleRoom
    this.graphics.drawRect(
      room.x * roomScaleFactor + this.offsetX,
      room.y * roomScaleFactor + this.offsetY,
      room.width * roomScaleFactor,
      room.height * roomScaleFactor,
    );
    this.graphics.endFill();

    // Draw Room ID
    const idText = new Text(`${room.id}`, { fontSize: roomScaleFactor / 1.5, fill: 0xffffff });
    idText.x = room.x * roomScaleFactor + this.offsetX; // Adjust text position as needed
    idText.y = room.y * roomScaleFactor + this.offsetY;
    this.graphics.addChild(idText);
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

    // Draw Room ID
    const idText = new Text(`${room.id}`, { fontSize: roomScaleFactor / 2, fill: 0xffffff });
    idText.x = room.x * roomScaleFactor + this.offsetX; // Adjust text position as needed
    idText.y = room.y * roomScaleFactor + this.offsetY;
    this.graphics.addChild(idText);
  }
}
