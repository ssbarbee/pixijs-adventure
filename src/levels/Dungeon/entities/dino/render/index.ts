import { AnimatedSprite, Graphics, Texture } from 'pixi.js';

type DinoAnimationState = 'idle' | 'walk' | 'run' | 'dead';

export interface DinoRenderProps {
  x: number;
  y: number;
  tileSize: number;
}

export class DinoRender extends AnimatedSprite {
  tileSize: number;
  private dot: Graphics;
  private animationState: DinoAnimationState = 'idle';

  constructor(props: DinoRenderProps) {
    const textures = Array.from({ length: 10 }).map((_, index) => Texture.from(`dinoIdle${index}`));
    super(textures);

    this.tileSize = props.tileSize;
    this.play();
    this.scale.set(this.tileSize / this.width, this.tileSize / 1.44 / this.height);
    this.animationSpeed = 0.3;
    this.x = props.x;
    this.y = props.y;
    this.dot = new Graphics();
    this.addChild(this.dot);
    this.drawDot();
  }

  private drawDot() {
    this.dot.clear();
    this.dot.circle(0, 0, 4).fill(0x00ff00);
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

  public stopRunning() {
    this.stopMoving();
  }
}
