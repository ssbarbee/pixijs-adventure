import { Sprite, Texture } from 'pixi.js';

export class TrophyRender extends Sprite {
  constructor(x: number, y: number, tileSize: number) {
    const texture = Texture.from('trophy');
    super(texture);

    this.anchor.set(0.5);

    // Scale trophy to be visible but not too large
    const trophySize = tileSize * 0.8;
    this.scale.set(trophySize / this.width, trophySize / this.height);

    this.x = x;
    this.y = y;
  }
}
