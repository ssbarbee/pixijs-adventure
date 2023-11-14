import { Sprite, Texture } from 'pixi.js';
import { WALL0, WATER0 } from '../constants';

export class Wall0 extends Sprite {
    constructor(xCoordinate: number, yCoordinate: number, tileSize: number) {
        const texture = Texture.from(WALL0);
        super(texture);

        this.scale.set(tileSize / this.width, tileSize / this.height);
        this.anchor.set(0.5, 0.5);
        this.x = xCoordinate * tileSize + tileSize / 2;
        this.y = yCoordinate * tileSize + tileSize / 2;
    }
}