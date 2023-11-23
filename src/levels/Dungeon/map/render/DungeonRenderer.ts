import { Graphics, Text } from 'pixi.js';

import { INK_COLOR, TILE_COLOR } from '../../../../constants';
import { CircularRoom, ConnectableRoom, ConnectionRoom, Dungeon, RectangleRoom } from '../types';

export class DungeonRenderer {
  private dungeon: Dungeon;
  private graphics: Graphics;
  private offsetX: number;
  private offsetY: number;
  private tileSize: number;

  constructor(dungeon: Dungeon, tileSize: number, offsetX: number, offsetY: number) {
    this.dungeon = dungeon;
    this.graphics = new Graphics();

    // Offset, normally center of the screen, but adjustable
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.tileSize = tileSize;
  }

  draw(): Graphics {
    // Use a queue for breadth-first traversal
    const queue: ConnectableRoom[] = [this.dungeon.root];

    const connections: ConnectionRoom[] = [];
    while (queue.length > 0) {
      const currentRoom = queue.shift()!;
      if (currentRoom.type === 'rectangle') {
        this.drawRectangleRoom(currentRoom as RectangleRoom);
      } else if (currentRoom.type === 'circular') {
        this.drawCircularRoom(currentRoom as CircularRoom);
      }
      currentRoom.children.forEach((child) => queue.push(child));
      currentRoom.connections.forEach((connection) => connections.push(connection));
    }
    // Draw connections and add children to the queue
    connections.forEach((connection) => {
      this.drawConnection(connection);
    });
    return this.graphics;
  }

  private drawRectangleRoom(room: RectangleRoom): void {
    const squareSize = this.tileSize;
    // Save the current line style to restore it later
    const savedLineStyle = this.graphics.lineStyle();

    // Loop through the rectangle's width and height and draw squares
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        // Calculate the coordinates for the current square
        const squareX = x * squareSize + this.offsetX;
        const squareY = y * squareSize + this.offsetY;

        // Draw a square with a dashed border
        this.graphics.lineStyle(1, 0x000000, 1, 0.5, true); // 1px solid black dashed border
        this.graphics.beginFill(TILE_COLOR);
        this.graphics.drawRect(squareX, squareY, squareSize, squareSize);
        this.graphics.endFill();
      }
    }
    // Draw a red dot at the center of the square
    this.drawRedDot(room.x, room.y);
    // Draw Room ID
    this.drawRoomID(room);
    // Reset the line style to its previous values
    this.graphics.lineStyle(savedLineStyle);
  }

  private drawCircularRoom(room: CircularRoom): void {
    // Draw the circle as the "floor" of the room
    this.graphics.beginFill(TILE_COLOR); // Room's floor color
    this.graphics.drawCircle(
      room.x * this.tileSize + this.offsetX,
      room.y * this.tileSize + this.offsetY,
      room.radius * this.tileSize,
    );
    this.graphics.endFill();

    // Create a graphics object for the tiles
    const tilesGraphics = new Graphics();

    // Simplified bounds for the grid, assuming a square area
    const start = -room.radius;
    const end = room.radius;

    // Draw the grid of squares (tiles) within the square approximation
    for (let i = start; i < end; i++) {
      for (let j = start; j < end; j++) {
        tilesGraphics.lineStyle(1, 0x000000, 1, 0.5, true); // Line style for the tile borders
        tilesGraphics.beginFill(TILE_COLOR); // Tile color
        tilesGraphics.drawRect(
          (room.x + i) * this.tileSize + this.offsetX,
          (room.y + j) * this.tileSize + this.offsetY,
          this.tileSize,
          this.tileSize,
        );
        tilesGraphics.endFill();
      }
    }

    // Create a mask for the circle
    const maskGraphics = new Graphics();
    maskGraphics.beginFill(0xffffff);
    maskGraphics.drawCircle(
      room.x * this.tileSize + this.offsetX,
      room.y * this.tileSize + this.offsetY,
      room.radius * this.tileSize,
    );
    maskGraphics.endFill();

    // Apply the mask to the tiles
    tilesGraphics.mask = maskGraphics;

    // Add the mask to the main graphics before the tiles
    this.graphics.addChild(maskGraphics);
    this.graphics.addChild(tilesGraphics);

    // Draw a red dot at the center
    this.drawRedDot(room.x, room.y);
    // Draw Room ID (if needed)
    this.drawRoomID(room);
  }

  private drawConnection(room: ConnectionRoom): void {
    const squareSize = this.tileSize;
    // Save the current line style to restore it later
    const savedLineStyle = this.graphics.lineStyle();

    // Loop through the rectangle's width and height and draw squares
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        // Calculate the coordinates for the current square
        const squareX = x * squareSize + this.offsetX;
        const squareY = y * squareSize + this.offsetY;

        // Draw a square with a dashed border
        this.graphics.lineStyle(1, 0x000000, 1, 0.5, true); // 1px solid black dashed border
        this.graphics.beginFill(TILE_COLOR);
        this.graphics.drawRect(squareX, squareY, squareSize, squareSize);
        this.graphics.endFill();
      }
    }
    // Draw a red dot at the center of the square
    this.drawRedDot(room.x, room.y);
    // Draw Room ID
    // this.drawRoomID(room);
    // Reset the line style to its previous values
    this.graphics.lineStyle(savedLineStyle);
  }

  private drawRedDot(x: number, y: number): void {
    const graphics = new Graphics();
    graphics.beginFill(0xff0000); // Red color
    graphics.drawCircle(
      x * this.tileSize + this.offsetX,
      y * this.tileSize + this.offsetY,
      this.tileSize / 8, // Radius of the dot
    );
    graphics.endFill();
    this.graphics.addChild(graphics);
  }

  private drawRoomID(room: ConnectableRoom | ConnectionRoom): void {
    const idText = new Text(`${room.id}`, {
      fontSize: this.tileSize,
      fill: INK_COLOR,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      fontStyle: 'italic',
    });
    idText.x = room.x * this.tileSize + this.offsetX;
    idText.y = room.y * this.tileSize + this.offsetY;
    this.graphics.addChild(idText);
  }
}
