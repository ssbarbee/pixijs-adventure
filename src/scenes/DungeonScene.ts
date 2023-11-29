import { Container, Graphics } from 'pixi.js';

import { PlayerBox } from '../entities/Player';
import {
  DebugInfo,
  Dungeon,
  DungeonRenderer,
  generateDungeon,
  getRoomAt,
  isWallAt,
  PlayerEntity,
  RectangleRoom,
} from '../levels/Dungeon';
import { DinoEntity } from '../levels/Dungeon/entities/dino';
import { DinoBox } from '../levels/Dungeon/entities/dino/model';
import { IScene, Manager } from '../Manager';

export class DungeonScene extends Container implements IScene {
  private player: PlayerEntity;
  private dino: DinoEntity;
  private tileSize = Manager.width / 16;
  private worldContainer: Container;
  private dungeon: Dungeon | null = null;
  private debugInfo: DebugInfo;
  private dungeonOffsetX: number = 0;
  private dungeonOffsetY: number = 0;
  private dungeonRenderer: DungeonRenderer | null = null;
  private vGraphics: Graphics | null = null;

  constructor() {
    super();
    this.sortableChildren = true;

    // Create a container for the entire world
    this.worldContainer = new Container();

    // Add the world container to the scene
    this.addChild(this.worldContainer);

    this.generateAndDrawDungeon();
    // Create the player, centered in middle of screen
    this.player = new PlayerEntity(Manager.width / 2, Manager.height / 2, (box) =>
      this.onPlayerPositionUpdate(box),
    );
    this.dino = new DinoEntity(
      Manager.width / 2,
      Manager.height / 2,
      this.onDinoPositionUpdate.bind(this),
      this.onDinoIdle.bind(this),
    );

    // Add the player to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.player.render);

    // Add the dino to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.dino.render);

    // Call centerCameraOnPlayer to initially center the world container on the player
    this.centerCameraOnPlayer();

    this.debugInfo = new DebugInfo(this);

    window.addEventListener('keypress', (e) => this.handleKeypress(e));
  }

  private onPlayerPositionUpdate({ left, right, top, bottom }: PlayerBox) {
    if (!this.dungeon) {
      return false;
    }
    // Check if any corner of the player is on a non-grass tile
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        // Convert screen coordinates (x, y) to dungeon coordinates
        const dungeonX = this.sceneXtoDungeonX(x);
        const dungeonY = this.sceneYtoDungeonY(y);

        // Prevent the move if there's a wall
        if (isWallAt(dungeonX, dungeonY, this.dungeon)) {
          return false;
        }
      }
    }

    // Move was successful
    return true;
  }

  private onDinoIdle() {
    this.dino.render.stopRunning();
  }

  private onDinoPositionUpdate({ left, right, top, bottom }: DinoBox) {
    if (!this.dungeon) {
      return false;
    }
    // Check if any corner of the player is on a non-grass tile
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        // Convert screen coordinates (x, y) to dungeon coordinates
        const dungeonX = this.sceneXtoDungeonX(x);
        const dungeonY = this.sceneYtoDungeonY(y);

        // Prevent the move if there's a wall
        if (isWallAt(dungeonX, dungeonY, this.dungeon)) {
          this.dino.render.stopRunning();
          return false;
        }
      }
    }

    this.dino.render.startRunning();
    // Move was successful
    return true;
  }

  private generateAndDrawDungeon(): void {
    // Clear the container of old dungeon elements
    this.worldContainer.removeChildren();

    // Generate and draw the new dungeon
    this.dungeon = generateDungeon(12);
    // 'root' is the starting room
    const startRoom = this.dungeon.root;
    const startRoomX = startRoom.x * this.tileSize;
    const startRoomY = startRoom.y * this.tileSize;

    this.dungeonOffsetX = Manager.width / 2 - startRoomX;
    this.dungeonOffsetY = Manager.height / 2 - startRoomY;

    this.dungeonRenderer = new DungeonRenderer(
      this.dungeon,
      this.tileSize,
      this.dungeonOffsetX,
      this.dungeonOffsetY,
    );
    const dungeonGraphics = this.dungeonRenderer.draw();
    this.worldContainer.addChild(dungeonGraphics);
  }

  private centerCameraOnPlayer() {
    // Assuming you have access to the screen's width and height
    const screenWidth = Manager.width;
    const screenHeight = Manager.height;

    // Center the world container on the player's position
    this.worldContainer.x = -this.player.x + screenWidth / 2;
    this.worldContainer.y = -this.player.y + screenHeight / 2;
  }

  private handleKeypress(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.generateAndDrawDungeon();
    }
  }

  public update(framesPassed: number): void {
    this.dino.update(framesPassed);
    // Call centerCameraOnPlayer to continuously center the world container on the player
    this.centerCameraOnPlayer();

    this.player.update(framesPassed);
    const playerCenterX = this.sceneXtoDungeonX(this.player.centerX);
    const playerCenterY = this.sceneYtoDungeonY(this.player.centerY);
    const room = getRoomAt(playerCenterX, playerCenterY, this.dungeon!);
    if (this.vGraphics) {
      this.worldContainer.removeChild(this.vGraphics);
    }
    this.vGraphics = this.dungeonRenderer!.drawVisibility(room as RectangleRoom, {
      x: playerCenterX,
      y: playerCenterY,
    });
    // Draw visibility ray-casting
    this.worldContainer.addChild(this.vGraphics);
    // Debug info
    this.drawDebugInfo();
  }

  private sceneXtoDungeonX(x: number) {
    return (x - this.dungeonOffsetX) / this.tileSize;
  }

  private sceneYtoDungeonY(y: number) {
    return (y - this.dungeonOffsetY) / this.tileSize;
  }

  private drawDebugInfo(): void {
    this.debugInfo.draw({
      playerX: this.sceneXtoDungeonX(this.player.x),
      playerY: this.sceneYtoDungeonY(this.player.y),
    });
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
