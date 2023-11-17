import { Sprite, Texture } from 'pixi.js';

import { GRASS2 } from '../constants';

export class Grass2 extends Sprite {
  private tileSize: number = 32;

  constructor(xCoordinate: number, yCoordinate: number, tileSize: number) {
    const texture = Texture.from(GRASS2);
    super(texture);

    this.scale.set(tileSize / this.width, tileSize / this.height);
    this.anchor.set(0.5, 0.5);
    this.x = xCoordinate * tileSize + tileSize / 2;
    this.y = yCoordinate * tileSize + tileSize / 2;
  }
}
