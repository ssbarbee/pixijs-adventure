import { Container, Graphics } from 'pixi.js';

import {
  DebugInfo,
  DungeonEntity,
  generateDungeon,
  PlayerBox,
  PlayerEntity,
  TrophyEntity,
} from '../levels/Dungeon';
import { DinoBox, DinoEntity } from '../levels/Dungeon/entities/dino';
import { IScene, Manager } from '../Manager';
import { MenuScene } from './MenuScene';
import { VictoryScene } from './VictoryScene';

const DINO_SPAWN_CHANCE = 0.3;

export class DungeonScene extends Container implements IScene {
  private player!: PlayerEntity;
  private dinos: DinoEntity[] = [];
  private trophy: TrophyEntity | null = null;
  private tileSize = Manager.width / 16;
  private worldContainer: Container;
  private dungeonEntity: DungeonEntity | null = null;
  private debugInfo!: DebugInfo;
  private dungeonOffsetX: number = 0;
  private dungeonOffsetY: number = 0;
  private vGraphics: Graphics | null = null;
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
    this.player = new PlayerEntity({
      x: Manager.width / 2,
      y: Manager.height / 2,
      tileSize: playerTileSize,
      onPositionUpdate: (box) => this.onPlayerPositionUpdate(box),
    });

    // Add the player to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.player.view);

    // Spawn dinos in eligible rooms
    this.spawnDinos();

    // Call centerCameraOnPlayer to initially center the world container on the player
    this.centerCameraOnPlayer();

    this.debugInfo = new DebugInfo(this);

    window.addEventListener('keypress', (e) => this.handleKeypress(e));
  }

  private spawnDinos(): void {
    if (!this.dungeonEntity) return;

    // Always spawn a dino in the trophy room (farthest room)
    const farthestRoom = this.dungeonEntity.findFarthestRoom(this.dungeonEntity.getRoot());
    const trophyRoomCenter = this.dungeonEntity.getRoomCenter(farthestRoom);

    // Spawn dino slightly offset from trophy so they don't overlap
    const guardSceneX = this.dungeonXToSceneX(trophyRoomCenter.x + 1);
    const guardSceneY = this.dungeonYToSceneY(trophyRoomCenter.y + 1);
    const guardDino = this.createDino(guardSceneX, guardSceneY);
    this.dinos.push(guardDino);
    this.worldContainer.addChild(guardDino.view);

    // Spawn dinos in other rooms with 30% chance (excluding trophy room)
    const spawnableRooms = this.dungeonEntity
      .getSpawnableRoomCenters()
      .filter((room) => room.x !== trophyRoomCenter.x || room.y !== trophyRoomCenter.y);

    for (const { x, y } of spawnableRooms) {
      if (Math.random() < DINO_SPAWN_CHANCE) {
        const sceneX = this.dungeonXToSceneX(x);
        const sceneY = this.dungeonYToSceneY(y);

        const dino = this.createDino(sceneX, sceneY);
        this.dinos.push(dino);
        this.worldContainer.addChild(dino.view);
      }
    }
  }

  private createDino(x: number, y: number): DinoEntity {
    const dino: DinoEntity = new DinoEntity({
      x,
      y,
      tileSize: this.tileSize,
      onPositionUpdate: (box) => this.onDinoPositionUpdate(dino, box),
      onIdle: () => this.onDinoIdle(dino),
      player: {
        x: this.player.x,
        y: this.player.y,
        width: this.player.width,
        height: this.player.height,
      },
    });
    return dino;
  }

  private onPlayerPositionUpdate({ left, right, top, bottom }: PlayerBox) {
    if (!this.dungeonEntity) {
      return false;
    }
    // Check if any corner of the player is on a non-grass tile
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        // Convert screen coordinates (x, y) to dungeon coordinates
        const dungeonX = this.sceneXtoDungeonX(x);
        const dungeonY = this.sceneYtoDungeonY(y);

        // Prevent the move if there's a wall
        if (this.dungeonEntity.isWallAt(dungeonX, dungeonY)) {
          return false;
        }
      }
    }

    // Move was successful - update all dinos with player position
    for (const dino of this.dinos) {
      dino.updatePlayerPosition(left, top, right - left, bottom - top);
    }
    return true;
  }

  private onDinoIdle(dino: DinoEntity) {
    dino.stopRunning();
  }

  private onDinoPositionUpdate(dino: DinoEntity, { left, right, top, bottom }: DinoBox) {
    if (!this.dungeonEntity) {
      return false;
    }
    // Check if any corner of the dino is on a non-grass tile
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        // Convert screen coordinates (x, y) to dungeon coordinates
        const dungeonX = this.sceneXtoDungeonX(x);
        const dungeonY = this.sceneYtoDungeonY(y);

        // Prevent the move if there's a wall
        if (this.dungeonEntity.isWallAt(dungeonX, dungeonY)) {
          dino.stopMoving();
          return false;
        }
      }
    }

    // Use run animation when chasing player, walk animation for patrol/return
    const aiState = dino.getAIState();
    if (aiState === 'chase') {
      dino.startRunning();
    } else {
      dino.startWalking();
    }
    // Move was successful
    return true;
  }

  private generateAndDrawDungeon(): void {
    // Clear the container of old dungeon elements
    this.worldContainer.removeChildren();

    // Generate the dungeon
    const dungeon = generateDungeon(12);
    // 'root' is the starting room
    const startRoom = dungeon.root;
    const startRoomX = startRoom.x * this.tileSize;
    const startRoomY = startRoom.y * this.tileSize;

    this.dungeonOffsetX = Manager.width / 2 - startRoomX;
    this.dungeonOffsetY = Manager.height / 2 - startRoomY;

    // Create the dungeon entity
    this.dungeonEntity = new DungeonEntity({
      dungeon,
      tileSize: this.tileSize,
      offsetX: this.dungeonOffsetX,
      offsetY: this.dungeonOffsetY,
    });
    this.worldContainer.addChild(this.dungeonEntity.view);

    // Place trophy in the farthest room from the start
    this.placeTrophy();
  }

  private placeTrophy(): void {
    if (!this.dungeonEntity) return;

    const farthestRoom = this.dungeonEntity.findFarthestRoom(this.dungeonEntity.getRoot());
    const trophyCenter = this.dungeonEntity.getRoomCenter(farthestRoom);

    // Convert to scene coordinates
    const trophySceneX = this.dungeonXToSceneX(trophyCenter.x);
    const trophySceneY = this.dungeonYToSceneY(trophyCenter.y);

    // Create trophy entity with callback for when collected
    this.trophy = new TrophyEntity({
      x: trophySceneX,
      y: trophySceneY,
      tileSize: this.tileSize,
      onCollected: () => this.onTrophyCollected(),
    });

    this.worldContainer.addChild(this.trophy.view);
  }

  private dungeonXToSceneX(dungeonX: number): number {
    return dungeonX * this.tileSize + this.dungeonOffsetX;
  }

  private dungeonYToSceneY(dungeonY: number): number {
    return dungeonY * this.tileSize + this.dungeonOffsetY;
  }

  private checkTrophyCollision(): void {
    if (this.gameWon || !this.trophy) return;

    this.trophy.checkCollision(this.player.centerX, this.player.centerY);
  }

  private onTrophyCollected(): void {
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

    // Update all dinos
    for (const dino of this.dinos) {
      dino.update(framesPassed);
    }

    // Call centerCameraOnPlayer to continuously center the world container on the player
    this.centerCameraOnPlayer();

    this.player.update(framesPassed);

    // Update trophy
    this.trophy?.update();

    // Check if player reached the trophy
    this.checkTrophyCollision();
    const playerCenterX = this.sceneXtoDungeonX(this.player.centerX);
    const playerCenterY = this.sceneYtoDungeonY(this.player.centerY);
    const room = this.dungeonEntity!.getRoomAt(playerCenterX, playerCenterY);
    if (this.vGraphics) {
      this.worldContainer.removeChild(this.vGraphics);
    }
    if (room) {
      this.vGraphics = this.dungeonEntity!.drawVisibility(room, {
        x: playerCenterX,
        y: playerCenterY,
      });
      // Draw visibility ray-casting
      this.worldContainer.addChild(this.vGraphics);
    }

    // Global debug info (FPS only)
    this.debugInfo.draw();
  }

  private sceneXtoDungeonX(x: number) {
    return (x - this.dungeonOffsetX) / this.tileSize;
  }

  private sceneYtoDungeonY(y: number) {
    return (y - this.dungeonOffsetY) / this.tileSize;
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
