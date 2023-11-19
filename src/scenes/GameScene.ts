import { Container, Graphics } from 'pixi.js';

import { Player } from '../entities/Player';
import { generateTerrainSprite } from '../entities/terrainFactory';
import { IScene, Manager } from '../Manager';
import { isGrass } from '../utils/isGrass';

export class GameScene extends Container implements IScene {
  private tileSize: number = 32;
  private worldContainer: Container;
  private player: Player;
  private world: string[][];
  private minimap: Container;
  private minimapScale: number = 0.05; // Adjust this value as needed
  private playerDot: Graphics = new Graphics();

  constructor(world: string[][], playerStartingX: number, playerStartingY: number) {
    super();
    this.world = world;

    // Create a container for the entire world
    this.worldContainer = new Container();

    // Add the world container to the scene
    this.addChild(this.worldContainer);

    // Render the world
    this.renderWorld(world);

    // Create the player
    this.player = new Player(this.tileSize, playerStartingX, playerStartingY, (newX, newY) =>
      this.onPlayerPositionUpdate(newX, newY),
    );

    // Add the player to the GameScene container (worldContainer)
    this.worldContainer.addChild(this.player);

    // Call centerCameraOnPlayer to initially center the world container on the player
    this.centerCameraOnPlayer();

    // Create and render the minimap
    this.minimap = new Container();
    this.renderMinimap(world);
    this.positionMinimap();
    this.addChild(this.minimap);
    // Create the player dot for the minimap
    this.createPlayerDot();
  }

  public update(framesPassed: number): void {
    // Call centerCameraOnPlayer to continuously center the world container on the player
    this.centerCameraOnPlayer();
    // Implement game logic or sprite movements here
    // For example, you can move the player sprite here
    this.player.update(framesPassed);
    // Update the player dot position on the minimap
    this.updatePlayerDotPosition();
  }

  private updatePlayerDotPosition() {
    // Calculate the player's position in minimap scale
    const dotX = this.player.x * this.minimapScale;
    const dotY = this.player.y * this.minimapScale;

    // Update the position of the dot
    this.playerDot.x = dotX;
    this.playerDot.y = dotY;
  }

  private createPlayerDot() {
    this.playerDot = new Graphics();
    this.playerDot.beginFill(0xffff00); // Yellow color
    this.playerDot.drawCircle(0, 0, 3); // Adjust the size as needed
    this.playerDot.endFill();
    this.minimap.addChild(this.playerDot);
  }

  private renderWorld(world: string[][]) {
    for (let x = 0; x < world.length; x++) {
      for (let y = 0; y < world[0].length; y++) {
        const tile = world[x][y];
        const sprite = generateTerrainSprite(x, y, this.tileSize, tile);
        // Add the sprite to the world container
        this.worldContainer.addChild(sprite);
      }
    }
  }

  private onPlayerPositionUpdate(newX: number, newY: number) {
    // Check if the edge position is a wall
    const isGrassTile =
      this.world[newX] && this.world[newX][newY] && isGrass(this.world[newX][newY]);
    return Boolean(isGrassTile);
  }

  private centerCameraOnPlayer() {
    // Assuming you have access to the screen's width and height
    const screenWidth = Manager.width;
    const screenHeight = Manager.height;

    // Center the world container on the player's position
    this.worldContainer.x = -this.player.x + screenWidth / 2;
    this.worldContainer.y = -this.player.y + screenHeight / 2;
  }

  private renderMinimap(world: string[][]) {
    for (let x = 0; x < world.length; x++) {
      for (let y = 0; y < world[0].length; y++) {
        const tile = world[x][y];
        const sprite = generateTerrainSprite(x, y, this.tileSize * this.minimapScale, tile);

        // Scale down the sprite for the minimap
        // sprite.scale.set(this.minimapScale);
        this.minimap.addChild(sprite);
      }
    }
  }

  private positionMinimap() {
    // Position the minimap at the bottom left
    // Adjust these values based on your game's UI
    this.minimap.x = 10; // Margin from left
    this.minimap.y = Manager.height - this.minimap.height - 10; // Margin from bottom
  }

  resize(): void {
    // You can implement resizing logic here if needed
    this.centerCameraOnPlayer();
  }
}
