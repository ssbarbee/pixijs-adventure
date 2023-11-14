import { Sprite, Texture } from 'pixi.js';
import { GRASS1 } from '../constants';

export class Grass1 extends Sprite {
    private tileSize: number = 32;

    constructor(xCoordinate: number, yCoordinate: number, tileSize: number) {
        const texture = Texture.from(GRASS1);
        super(texture);

        this.scale.set(tileSize / this.width, tileSize / this.height);
        this.anchor.set(0.5, 0.5);
        this.x = xCoordinate * tileSize + tileSize / 2;
        this.y = yCoordinate * tileSize + tileSize / 2;
    }
}