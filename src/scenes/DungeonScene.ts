import { Container } from 'pixi.js';

import { Player, PlayerBox } from '../entities/Player';
import { Dungeon, DungeonRenderer, generateDungeon } from '../generators/map/Dungeon';
import { isWallAt } from '../generators/map/Dungeon/Dungeon';
import { DebugInfo } from '../generators/map/Dungeon/render/DebugInfo';
import { IScene, Manager } from '../Manager';

export class DungeonScene extends Container implements IScene {
  private player: Player;
  private tileSize = Manager.width / 32;
  private playerTileSize = this.tileSize / 2;
  private worldContainer: Container;
  private dungeon: Dungeon | null = null;
  private debugInfo: DebugInfo;
  private dungeonOffsetX: number = 0;
  private dungeonOffsetY: number = 0;

  constructor() {
    super();
    this.sortableChildren = true;

    // Create a container for the entire world
    this.worldContainer = new Container();

    // Add the world container to the scene
    this.addChild(this.worldContainer);

    this.generateAndDrawDungeon();
    // Create the player, centered in middle of screen
    this.player = new Player(this.playerTileSize, Manager.width / 2, Manager.height / 2, (box) =>
      this.onPlayerPositionUpdate(box),
    );

    // Add the player to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.player);

    // Call centerCameraOnPlayer to initially center the world container on the player
    this.centerCameraOnPlayer();

    this.debugInfo = new DebugInfo(this, this.tileSize);

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
        const dungeonX = this.normalizeXtoDungeonX(x);
        const dungeonY = this.normalizeYtoDungeonY(y);

        // Prevent the move if there's a wall
        if (isWallAt(dungeonX, dungeonY, this.dungeon)) {
          return false;
        }
      }
    }

    // Move was successful
    return true;
  }

  private generateAndDrawDungeon(): void {
    // Clear the container of old dungeon elements
    this.worldContainer.removeChildren();

    // Generate and draw the new dungeon
    this.dungeon = generateDungeon(10);
    // 'root' is the starting room
    const startRoom = this.dungeon.root;
    const startRoomX = startRoom.x * this.tileSize;
    const startRoomY = startRoom.y * this.tileSize;

    this.dungeonOffsetX = Manager.width / 2 - startRoomX;
    this.dungeonOffsetY = Manager.height / 2 - startRoomY;

    const dungeonRenderer = new DungeonRenderer(
      this.dungeon,
      this.tileSize,
      this.dungeonOffsetX,
      this.dungeonOffsetY,
    );
    const dungeonGraphics = dungeonRenderer.draw();
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
    // Call centerCameraOnPlayer to continuously center the world container on the player
    this.centerCameraOnPlayer();
    // Implement game logic or sprite movements here
    // For example, you can move the player sprite here
    this.player.update(framesPassed);
    // Debug info
    this.drawDebugInfo();
  }

  private normalizeXtoDungeonX(x: number) {
    return (x - this.dungeonOffsetX) / this.tileSize;
  }

  private normalizeYtoDungeonY(y: number) {
    return (y - this.dungeonOffsetY) / this.tileSize;
  }

  private drawDebugInfo(): void {
    this.debugInfo.draw({
      playerX: this.normalizeXtoDungeonX(this.player.x),
      playerY: this.normalizeYtoDungeonY(this.player.y),
    });
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
