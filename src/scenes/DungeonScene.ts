import { Container, Graphics, Sprite, Texture } from 'pixi.js';

import { PlayerBox } from '../entities/Player';
import {
  CircularRoom,
  DebugInfo,
  Dungeon,
  DungeonRenderer,
  findFarthestRoom,
  generateDungeon,
  getRoomAt,
  isWallAt,
  PlayerEntity,
  RectangleRoom,
} from '../levels/Dungeon';
import { DinoEntity } from '../levels/Dungeon/entities/dino';
import { DinoBox } from '../levels/Dungeon/entities/dino/model';
import { IScene, Manager } from '../Manager';
import { MenuScene } from './MenuScene';
import { VictoryScene } from './VictoryScene';

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
  // Trophy-related properties
  private trophy: Sprite | null = null;
  private trophySceneX: number = 0;
  private trophySceneY: number = 0;
  private startTime: number = 0;
  private gameWon: boolean = false;

  constructor() {
    super();
    this.sortableChildren = true;

    // Start the game timer
    this.startTime = Date.now();

    // Create a container for the entire world
    this.worldContainer = new Container();

    // Add the world container to the scene
    this.addChild(this.worldContainer);

    this.generateAndDrawDungeon();

    // Create the player, centered in middle of screen
    // Player tileSize is 1/4 of the dungeon tileSize
    const playerTileSize = this.tileSize / 4;
    this.player = new PlayerEntity(Manager.width / 2, Manager.height / 2, playerTileSize, (box) =>
      this.onPlayerPositionUpdate(box),
    );

    this.dino = new DinoEntity(
      Manager.width / 2,
      Manager.height / 2,
      this.tileSize,
      this.onDinoPositionUpdate.bind(this),
      this.onDinoIdle.bind(this),
      this.player.render.x,
      this.player.render.y,
      this.player.render.width,
      this.player.render.height,
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
    this.dino.model.updatePlayerPosition(left, top, right - left, bottom - top);
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
          this.dino.render.stopMoving();
          return false;
        }
      }
    }

    // Use run animation when chasing player, walk animation for patrol/return
    const aiState = this.dino.getAIState();
    if (aiState === 'chase') {
      this.dino.render.startRunning();
    } else {
      this.dino.render.startWalking();
    }
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

    // Place trophy in the farthest room from the start
    this.placeTrophy();
  }

  private placeTrophy(): void {
    if (!this.dungeon) return;

    const farthestRoom = findFarthestRoom(this.dungeon.root);

    // Calculate trophy position at the center of the farthest room
    let trophyDungeonX: number;
    let trophyDungeonY: number;

    if (farthestRoom.type === 'rectangle') {
      const rectRoom = farthestRoom as RectangleRoom;
      trophyDungeonX = rectRoom.x + rectRoom.width / 2;
      trophyDungeonY = rectRoom.y + rectRoom.height / 2;
    } else {
      // Circular room - use center
      const circRoom = farthestRoom as CircularRoom;
      trophyDungeonX = circRoom.x;
      trophyDungeonY = circRoom.y;
    }

    // Convert to scene coordinates
    this.trophySceneX = this.dungeonXToSceneX(trophyDungeonX);
    this.trophySceneY = this.dungeonYToSceneY(trophyDungeonY);

    // Create trophy sprite
    const texture = Texture.from('trophy');
    this.trophy = new Sprite(texture);
    this.trophy.anchor.set(0.5);

    // Scale trophy to be visible but not too large
    const trophySize = this.tileSize * 0.8;
    this.trophy.scale.set(trophySize / this.trophy.width, trophySize / this.trophy.height);

    // Position trophy
    this.trophy.x = this.trophySceneX;
    this.trophy.y = this.trophySceneY;

    this.worldContainer.addChild(this.trophy);
  }

  private dungeonXToSceneX(dungeonX: number): number {
    return dungeonX * this.tileSize + this.dungeonOffsetX;
  }

  private dungeonYToSceneY(dungeonY: number): number {
    return dungeonY * this.tileSize + this.dungeonOffsetY;
  }

  private checkTrophyCollision(): void {
    if (this.gameWon || !this.trophy) return;

    const playerCenterX = this.player.centerX;
    const playerCenterY = this.player.centerY;

    // Check distance between player center and trophy center
    const dx = playerCenterX - this.trophySceneX;
    const dy = playerCenterY - this.trophySceneY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Collision threshold - player needs to be close to the trophy
    const collisionThreshold = this.tileSize * 0.6;

    if (distance < collisionThreshold) {
      this.gameWon = true;
      const elapsedTime = Date.now() - this.startTime;

      // Navigate to victory scene with callbacks
      Manager.changeScene(
        new VictoryScene(elapsedTime, {
          onPlayAgain: () => Manager.changeScene(new DungeonScene()),
          onMainMenu: () =>
            Manager.changeScene(
              new MenuScene({
                onDungeon: () => Manager.changeScene(new DungeonScene()),
              }),
            ),
        }),
      );
    }
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
    if (this.gameWon) return;

    this.dino.update(framesPassed);
    // Call centerCameraOnPlayer to continuously center the world container on the player
    this.centerCameraOnPlayer();

    this.player.update(framesPassed);

    // Check if player reached the trophy
    this.checkTrophyCollision();
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
      dinoX: this.sceneXtoDungeonX(this.dino.x),
      dinoY: this.sceneYtoDungeonY(this.dino.y),
      dinoState: this.dino.getAIState(),
    });
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
