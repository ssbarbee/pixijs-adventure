import { Graphics, Sprite, Texture } from 'pixi.js';

import { Manager } from '../../../../../Manager';

export class PlayerRender extends Sprite {
  tileSize: number = Manager.width / 64;
  private dot: Graphics;

  constructor(startingX: number, startingY: number) {
    const texture = Texture.from('player');
    super(texture);

    this.scale.set(this.tileSize / this.width, this.tileSize / this.height);
    this.x = startingX;
    this.y = startingY;
    // Initialize the dot
    this.dot = new Graphics();
    this.addChild(this.dot); // Add the dot as a child of the player sprite
    this.drawDot();
  }

  private drawDot() {
    this.dot.clear();
    this.dot.beginFill(0x00ff00); // Green color
    this.dot.drawCircle(0, 0, 2); // Draw a circle at the player's center
    this.dot.endFill();
  }

  public update() {
    // this.drawDot();
  }
}
