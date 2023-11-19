import { Container } from 'pixi.js';

import { Player } from '../entities/Player';
import { DungeonRenderer, generateDungeon } from '../generators/map/Dungeon';
import { IScene, Manager } from '../Manager';

export class DungeonScene extends Container implements IScene {
  private player: Player;
  private tileSize = 16;
  private worldContainer: Container;

  constructor() {
    super();

    // Create a container for the entire world
    this.worldContainer = new Container();

    // Add the world container to the scene
    this.addChild(this.worldContainer);

    this.generateAndDrawDungeon();

    // Create the player
    this.player = new Player(
      this.tileSize,
      Manager.width / 2 + this.tileSize / 2,
      Manager.height / 2 + this.tileSize / 2,
      () => this.onPlayerPositionUpdate(),
    );

    // Add the player to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.player);

    // Call centerCameraOnPlayer to initially center the world container on the player
    this.centerCameraOnPlayer();

    window.addEventListener('keypress', (e) => this.handleKeypress(e));
  }

  private onPlayerPositionUpdate() {
    // Check if the edge position is a wall
    return true;
  }

  private generateAndDrawDungeon(): void {
    // Clear the container of old dungeon elements
    this.worldContainer.removeChildren();

    // Generate and draw the new dungeon
    const dungeon = generateDungeon(10);
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
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
