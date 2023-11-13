import { Container, Sprite, Texture } from 'pixi.js';
import { IScene, Manager } from '../Manager';

export class GameScene extends Container implements IScene {
    private tileSize: number = 32;
    private worldContainer: Container;
    private player: Sprite;

    constructor(world: string[][], playerStartingX: number, playerStartingY: number) {
        super();

        // Create a container for the entire world
        this.worldContainer = new Container();

        // Add the world container to the scene
        this.addChild(this.worldContainer);

        // Render the world
        this.renderWorld(world);

        // Create player sprite
        const clampyTexture = Texture.from('clampy');
        this.player = new Sprite(clampyTexture);
        this.player.scale.set(this.tileSize / this.player.width, this.tileSize / this.player.height); // Scale the player to fit the tile
        this.player.anchor.set(0.5, 0.5);

        // Set the player's position to the starting position
        this.player.x = playerStartingX * this.tileSize + this.tileSize / 2;
        this.player.y = playerStartingY * this.tileSize + this.tileSize / 2;

        // Add the player to the GameScene container (worldContainer)
        this.worldContainer.addChild(this.player);

        // Call centerCameraOnPlayer to initially center the world container on the player
        this.centerCameraOnPlayer();
    }

    public update(_framesPassed: number): void {
        // Call centerCameraOnPlayer to continuously center the world container on the player
        this.centerCameraOnPlayer();

        // Implement game logic or sprite movements here
        // For example, you can move the player sprite here
    }

    private renderWorld(world: string[][]) {
        const wallTexture = Texture.from('grass2');
        const floorTexture = Texture.from('grass');

        for (let x = 0; x < world.length; x++) {
            for (let y = 0; y < world[0].length; y++) {
                const tile = world[x][y];
                const texture = tile === '#' ? wallTexture : floorTexture;
                const sprite = new Sprite(texture);
                sprite.scale.set(1); // You can adjust this scale factor
                sprite.anchor.set(0.5, 0.5); // Adjust anchor point if needed

                // Position the sprite within the world container
                sprite.x = y * this.tileSize + this.tileSize / 2;
                sprite.y = x * this.tileSize + this.tileSize / 2;

                // Add the sprite to the world container
                this.worldContainer.addChild(sprite);
            }
        }
    }

    private centerCameraOnPlayer() {
        // Center the world container on the player's position
        this.worldContainer.x = this.player.x - this.worldContainer.width / 2;
        this.worldContainer.y = this.player.y - this.worldContainer.height / 2;
    }

    // @ts-ignore
    resize(screenWidth: number, screenHeight: number): void {
        // You can implement resizing logic here if needed
    }
}
