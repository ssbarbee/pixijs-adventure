import { Container, Sprite, Texture } from 'pixi.js';
import { IScene } from "../Manager";

export class GameScene extends Container implements IScene {
    private tileSize: number = 32;
    constructor(world: string[][]) {
        super();

        // Call renderWorld to render the world
        this.renderWorld(world);
    }

    public update(_framesPassed: number): void {
        // Implement game logic or sprite movements here
        // For example, you can move the character sprite here
    }

    private renderWorld(world: string[][]) {
        const wallTexture = Texture.from('grass2');
        const floorTexture = Texture.from('grass');
        const clampyTexture = Texture.from('clampy');

        for (let x = 0; x < world.length; x++) {
            for (let y = 0; y < world[0].length; y++) {
                const tile = world[x][y];
                const texture = tile === '#' ? wallTexture : tile === 'P' ? clampyTexture : floorTexture;
                const sprite = new Sprite(texture);
                if(tile === 'P') {
                    sprite.scale.set(32 / sprite.width, 32 / sprite.height);
                } else {
                    sprite.scale.set(1); // You can adjust this scale factor
                }
                sprite.anchor.set(0.5, 0.5); // Adjust anchor point if needed

                // Position the sprite
                sprite.x = y * this.tileSize + this.tileSize / 2;
                sprite.y = x * this.tileSize + this.tileSize / 2;

                this.addChild(sprite);
            }
        }
    }

    // @ts-ignore
    resize(screenWidth: number, screenHeight: number): void {
    }
}