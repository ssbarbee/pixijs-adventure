import { AnimatedSprite, Graphics, Texture } from 'pixi.js';

import { Manager } from '../../../../../Manager';

type DinoAnimationState = 'idle' | 'walk' | 'run' | 'dead';

export class DinoRender extends AnimatedSprite {
  tileSize: number = Manager.width / 16;
  private dot: Graphics;
  private animationState: DinoAnimationState = 'idle';

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

  public startWalking() {
    if (this.animationState !== 'walk') {
      this.stop();
      this.animationSpeed = 0.2;
      this.textures = Array.from({ length: 12 }).map((_, index) =>
        Texture.from(`dinoWalk${index}`),
      );
      this.play();
      this.animationState = 'walk';
    }
  }

  public startRunning() {
    if (this.animationState !== 'run') {
      this.stop();
      this.animationSpeed = 0.3;
      this.textures = Array.from({ length: 8 }).map((_, index) => Texture.from(`dinoRun${index}`));
      this.play();
      this.animationState = 'run';
    }
  }

  public stopMoving() {
    if (this.animationState !== 'idle' && this.animationState !== 'dead') {
      this.stop();
      this.animationSpeed = 0.3;
      this.textures = Array.from({ length: 10 }).map((_, index) =>
        Texture.from(`dinoIdle${index}`),
      );
      this.play();
      this.animationState = 'idle';
    }
  }

  public playDead() {
    if (this.animationState !== 'dead') {
      this.stop();
      this.animationSpeed = 0.15;
      this.loop = false;
      this.textures = Array.from({ length: 8 }).map((_, index) => Texture.from(`dinoDead${index}`));
      this.play();
      this.animationState = 'dead';
    }
  }

  // Keep for backwards compatibility
  public stopRunning() {
    this.stopMoving();
  }
}
