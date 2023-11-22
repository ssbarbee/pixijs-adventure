import { Container, Text } from 'pixi.js';

import { Player, PlayerBox } from '../entities/Player';
import { Dungeon, DungeonRenderer, generateDungeon } from '../generators/map/Dungeon';
import { isWallAt } from '../generators/map/Dungeon/Dungeon';
import { IScene, Manager } from '../Manager';

export class DungeonScene extends Container implements IScene {
  private player: Player;
  private tileSize = 64;
  private worldContainer: Container;
  private dungeon: Dungeon | null = null;
  private debugText: Text | null = null;

  constructor() {
    super();

    // Create a container for the entire world
    this.worldContainer = new Container();

    // Add the world container to the scene
    this.addChild(this.worldContainer);

    this.generateAndDrawDungeon();

    // Create the player
    this.player = new Player(this.tileSize, Manager.width / 2, Manager.height / 2, (box) =>
      this.onPlayerPositionUpdate(box),
    );

    // Add the player to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.player);

    // Call centerCameraOnPlayer to initially center the world container on the player
    this.centerCameraOnPlayer();

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
        if (isWallAt(this.dungeon.root, dungeonX, dungeonY)) {
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
    const dungeon = generateDungeon(2);
    this.dungeon = dungeon;
    const dungeonRenderer = new DungeonRenderer(dungeon, this.tileSize);
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
    return (x - Manager.width / 2) / this.tileSize;
  }
  private normalizeYtoDungeonY(y: number) {
    return (y - Manager.height / 2) / this.tileSize;
  }
  private drawDebugInfo(): void {
    const debugInfo = `Player: x:${this.normalizeXtoDungeonX(
      this.player.x,
    )}, y:${this.normalizeYtoDungeonY(this.player.y)}`;

    if (this.debugText) {
      // Update the existing text
      this.debugText.text = debugInfo;
    } else {
      // Create a new text object and store it
      this.debugText = new Text(debugInfo, {
        fontSize: this.tileSize / 4,
        fill: 0x274c7f,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        fontStyle: 'italic',
      });
      this.debugText.x = 0;
      this.debugText.y = 0;
      this.addChild(this.debugText);
    }
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
