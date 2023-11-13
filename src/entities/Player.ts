import { Sprite, Texture } from 'pixi.js';

export class Player extends Sprite {

    constructor(tileSize: number, startingX: number, startingY: number) {
        const texture = Texture.from('clampy');
        super(texture);

        // Set the player scale to fit the tile size
        this.scale.set(tileSize / this.width, tileSize / this.height);

        // Set the anchor to the center
        this.anchor.set(0.5, 0.5);

        // Set the player's initial position
        this.x = startingX * tileSize + tileSize / 2;
        this.y = startingY * tileSize + tileSize / 2;
    }

    // Add methods for player movement and other behaviors here
}