import { Container, Sprite, Texture } from 'pixi.js';
import { IScene, Manager } from '../Manager';
import { Player } from '../entities/Player';

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

        // Create the player
        this.player = new Player(this.tileSize, playerStartingX, playerStartingY);

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
        // Assuming you have access to the screen's width and height
        const screenWidth = Manager.width;
        const screenHeight = Manager.height;

        // Center the world container on the player's position
        this.worldContainer.x = -this.player.x + screenWidth / 2;
        this.worldContainer.y = -this.player.y + screenHeight / 2;
    }

    // @ts-ignore
    resize(screenWidth: number, screenHeight: number): void {
        // You can implement resizing logic here if needed
        this.centerCameraOnPlayer();
    }
}
