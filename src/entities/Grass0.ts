import { Sprite, Texture } from 'pixi.js';
import { GRASS0 } from '../constants';

export class Grass0 extends Sprite {
    private tileSize: number = 32;

    constructor(xCoordinate: number, yCoordinate: number) {
        const texture = Texture.from(GRASS0);
        super(texture);

        this.scale.set(this.tileSize / this.width, this.tileSize / this.height);
        this.anchor.set(0.5, 0.5);
        this.x = xCoordinate * this.tileSize + this.tileSize / 2;
        this.y = yCoordinate * this.tileSize + this.tileSize / 2;
    }
}