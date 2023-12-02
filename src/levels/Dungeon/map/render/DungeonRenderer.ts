import { Graphics, Sprite, Text, Texture } from 'pixi.js';

import { INK_COLOR2, TILE_COLOR, TILE2_COLOR } from '../../../../constants';
import { Circle } from '../../entities/visibility/circle';
import { VisibilityRender } from '../../entities/visibility/main';
import { Rectangle } from '../../entities/visibility/rectangle';
import { CircularRoom, ConnectableRoom, ConnectionRoom, Dungeon, RectangleRoom } from '../types';

export class DungeonRenderer {
  private dungeon: Dungeon;
  private graphics: Graphics;
  private offsetX: number;
  private offsetY: number;
  private tileSize: number;
  private visibilityRender: VisibilityRender = new VisibilityRender();

  constructor(dungeon: Dungeon, tileSize: number, offsetX: number, offsetY: number) {
    this.dungeon = dungeon;
    this.graphics = new Graphics();
    this.graphics.sortableChildren = true;

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

  drawVisibility(
    room: ConnectableRoom | ConnectionRoom,
    lightSource: {
      x: number;
      y: number;
    },
  ): Graphics {
    if (room.type === 'rectangle') {
      return this.visibilityRender.draw(
        new Rectangle(
          this.dungeonXToSceneX(room.x),
          this.dungeonYToSceneY(room.y),
          (room as RectangleRoom).width * this.tileSize,
          (room as RectangleRoom).height * this.tileSize,
        ),
        room.obstacles.map((obs) => {
          return new Rectangle(
            this.dungeonXToSceneX(obs.x),
            this.dungeonYToSceneY(obs.y),
            obs.width * this.tileSize,
            obs.height * this.tileSize,
          );
        }),
        {
          x: this.dungeonXToSceneX(lightSource.x),
          y: this.dungeonYToSceneY(lightSource.y),
        },
      );
    }
    if (room.type === 'circular') {
      return this.visibilityRender.draw(
        new Circle(
          this.dungeonXToSceneX(room.x),
          this.dungeonYToSceneY(room.y),
          (room as CircularRoom).radius * this.tileSize,
        ),
        room.obstacles.map((obs) => {
          return new Rectangle(
            this.dungeonXToSceneX(obs.x),
            this.dungeonYToSceneY(obs.y),
            obs.width * this.tileSize,
            obs.height * this.tileSize,
          );
        }),
        {
          x: this.dungeonXToSceneX(lightSource.x),
          y: this.dungeonYToSceneY(lightSource.y),
        },
      );
    }
    if (room.type === 'connection') {
      return this.visibilityRender.draw(
        new Rectangle(
          this.dungeonXToSceneX(room.x),
          this.dungeonYToSceneY(room.y),
          room.width * this.tileSize,
          room.height * this.tileSize,
        ),
        [],
        {
          x: this.dungeonXToSceneX(lightSource.x),
          y: this.dungeonYToSceneY(lightSource.y),
        },
      );
    }
    throw new Error('not supported room type');
  }

  private createTileSprite(x: number, y: number, tileSize: number, textureSource: string): Sprite {
    const texture = Texture.from(textureSource);
    const sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(tileSize / sprite.width, tileSize / sprite.height);
    return sprite;
  }

  private drawRectangleRoom(room: RectangleRoom): void {
    // Draw the rectangle as the "floor" of the room
    this.drawRectangleRoomFloor(room);
    // Draw dungeon land
    const dungeonLandGraphics = this.drawDungeonLand({
      top: room.y,
      left: room.x,
      width: room.width,
      height: room.height,
    });
    this.graphics.addChild(dungeonLandGraphics);
    // Draw room grid
    // const gridGraphics = this.drawRoomGrid({
    //   top: room.y,
    //   left: room.x,
    //   width: room.width,
    //   height: room.height,
    // });
    // this.graphics.addChild(gridGraphics);
    // Draw obstacles within the room
    this.drawObstacles(room);

    // Draw debug information
    // Draw a red dot at the center of the square
    this.drawRedDot(this.dungeonXToSceneX(room.x), this.dungeonYToSceneY(room.y));
    // Draw Room ID
    this.drawRoomID(room);
  }

  private drawRectangleRoomFloor(room: RectangleRoom | ConnectionRoom) {
    const graphics = new Graphics();
    // Room's floor color
    graphics.beginFill(TILE_COLOR, 0.1);
    graphics.drawRect(
      this.dungeonXToSceneX(room.x),
      this.dungeonYToSceneY(room.y),
      room.width * this.tileSize,
      room.height * this.tileSize,
    );
    graphics.endFill();

    this.graphics.addChild(graphics);
  }

  private drawRoomGrid({
    top,
    left,
    width,
    height,
  }: {
    top: number;
    left: number;
    width: number;
    height: number;
  }): Graphics {
    const graphics = new Graphics();
    const squareSize = this.tileSize;
    // Loop through the rectangle's width and height and draw squares
    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        // Calculate the coordinates for the current square
        const squareX = this.dungeonXToSceneX(x);
        const squareY = this.dungeonYToSceneY(y);

        // Draw a square with a dashed border
        graphics.lineStyle(1, 0x000000, 1, 0.5, true); // 1px solid black dashed border
        graphics.beginFill(TILE_COLOR, 0.1);
        graphics.drawRect(squareX, squareY, squareSize, squareSize);
        graphics.endFill();
      }
    }
    return graphics;
  }

  private drawDungeonLand({
    top,
    left,
    width,
    height,
  }: {
    top: number;
    left: number;
    width: number;
    height: number;
  }): Graphics {
    const graphics = new Graphics();
    const squareSize = this.tileSize;
    // Loop through the rectangle's width and height and draw squares
    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        // Calculate the coordinates for the current square
        const squareX = this.dungeonXToSceneX(x);
        const squareY = this.dungeonYToSceneY(y);

        const tileSprite = this.createTileSprite(squareX, squareY, squareSize, 'dungeonLand');
        graphics.addChild(tileSprite);
      }
    }
    return graphics;
  }

  private drawCircularRoom(room: CircularRoom): void {
    // // // Draw the circle as the "floor" of the room
    // this.graphics.beginFill(TILE_COLOR, 0.1); // Room's floor color
    // this.graphics.drawCircle(
    //   this.dungeonXToSceneX(room.x),
    //   this.dungeonYToSceneY(room.y),
    //   room.radius * this.tileSize,
    // );
    // this.graphics.endFill();

    // Draw dungeon land graphics
    const dungeonLandGraphics = this.drawDungeonLand({
      top: room.y - room.radius,
      left: room.x - room.radius,
      width: room.radius * 2,
      height: room.radius * 2,
    });
    this.graphics.addChild(dungeonLandGraphics);
    // Draw room grid
    // const gridGraphics = this.drawRoomGrid({
    //   top: room.y - room.radius,
    //   left: room.x - room.radius,
    //   width: room.radius * 2,
    //   height: room.radius * 2,
    // });

    // Create a mask for the circle
    const maskGraphics = new Graphics();
    maskGraphics.beginFill(0xffffff);
    maskGraphics.drawCircle(
      this.dungeonXToSceneX(room.x),
      this.dungeonYToSceneY(room.y),
      room.radius * this.tileSize,
    );
    maskGraphics.endFill();

    // Apply the mask to the tiles
    dungeonLandGraphics.mask = maskGraphics;

    // Add the mask to the main graphics before the tiles
    this.graphics.addChild(maskGraphics);
    this.graphics.addChild(dungeonLandGraphics);
    // Draw obstacles within the room
    this.drawObstacles(room);
    // Draw a red dot at the center
    this.drawRedDot(this.dungeonXToSceneX(room.x), this.dungeonYToSceneY(room.y));
    // Draw Room ID (if needed)
    this.drawRoomID(room);
  }

  private drawConnection(room: ConnectionRoom): void {
    // Draw the rectangle as the "floor" of the room
    this.drawRectangleRoomFloor(room);
    // Draw dungeon land graphics
    const dungeonLandGraphics = this.drawDungeonLand({
      top: room.y,
      left: room.x,
      width: room.width,
      height: room.height,
    });
    this.graphics.addChild(dungeonLandGraphics);
    // Draw room grid
    // const gridGraphics = this.drawRoomGrid({
    //   top: room.y,
    //   left: room.x,
    //   width: room.width,
    //   height: room.height,
    // });
    // this.graphics.addChild(gridGraphics);
    // Draw a red dot at the center of the square
    this.drawRedDot(this.dungeonXToSceneX(room.x), this.dungeonYToSceneY(room.y));
    // Draw Room ID
    // this.drawRoomID(room);
  }

  private drawRedDot(sceneX: number, sceneY: number): void {
    const graphics = new Graphics();
    // Red color
    graphics.beginFill(0xff0000);
    graphics.drawCircle(sceneX, sceneY, 4);
    graphics.endFill();
    this.graphics.addChild(graphics);
  }

  private drawRoomID(room: ConnectableRoom | ConnectionRoom): void {
    const idText = new Text(`${room.id}`, {
      fontSize: this.tileSize / 4,
      fill: INK_COLOR2,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      fontStyle: 'italic',
    });
    idText.x = this.dungeonXToSceneX(room.x);
    idText.y = this.dungeonYToSceneY(room.y);
    this.graphics.addChild(idText);
  }

  private drawObstacles(room: ConnectableRoom): void {
    const obstacles = room.obstacles;
    obstacles.forEach((obstacle) => {
      const obstacleX = this.dungeonXToSceneX(obstacle.x);
      const obstacleY = this.dungeonYToSceneY(obstacle.y);
      const obstacleWidth = obstacle.width * this.tileSize;
      const obstacleHeight = obstacle.height * this.tileSize;
      const obstacleGraphics = new Graphics();
      obstacleGraphics.beginFill(TILE2_COLOR);
      obstacleGraphics.lineStyle(1, 0x000000, 1, 0.5, true);
      obstacleGraphics.drawRect(obstacleX, obstacleY, obstacleWidth, obstacleHeight);
      obstacleGraphics.endFill();
      this.graphics.addChild(obstacleGraphics);
      this.drawRedDot(obstacleX, obstacleY);
    });
  }

  private dungeonXToSceneX(dungeonX: number): number {
    return dungeonX * this.tileSize + this.offsetX;
  }

  private dungeonYToSceneY(dungeonY: number): number {
    return dungeonY * this.tileSize + this.offsetY;
  }
}
