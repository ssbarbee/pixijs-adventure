import { AnimatedSprite, Graphics, Texture } from 'pixi.js';

import { Manager } from '../../../../../Manager';

export class DinoRender extends AnimatedSprite {
  tileSize: number = Manager.width / 8;
  private dot: Graphics;
  private isRunning: boolean = false;

  constructor(startingX: number, startingY: number) {
    const textures = Array.from({ length: 10 }).map((_, index) => Texture.from(`dinoIdle${index}`));
    super(textures);
    this.play();

    this.scale.set(this.tileSize / this.width, this.tileSize / 1.44 / this.height);
    this.animationSpeed = 0.3;
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
    this.dot.drawCircle(0, 0, 4); // Draw a circle at the player's center
    this.dot.endFill();
  }

  public override update(framesPassed: number) {
    super.update(framesPassed);
    // this.drawDot();
  }

  public startRunning() {
    if (!this.isRunning) {
      this.stop();
      this.animationSpeed = 0.1;
      this.textures = Array.from({ length: 8 }).map((_, index) => Texture.from(`dinoRun${index}`));
      this.play();
    }
    this.isRunning = true;
  }

  public stopRunning() {
    if (this.isRunning) {
      this.stop();
      this.animationSpeed = 0.3;
      this.textures = Array.from({ length: 10 }).map((_, index) =>
        Texture.from(`dinoIdle${index}`),
      );
      this.play();
    }

    this.isRunning = false;
  }
}
