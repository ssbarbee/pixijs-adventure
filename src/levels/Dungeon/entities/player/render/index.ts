import { Graphics, Sprite, Texture } from 'pixi.js';

export interface PlayerRenderProps {
  x: number;
  y: number;
  tileSize: number;
}

export class PlayerRender extends Sprite {
  tileSize: number;
  private dot: Graphics;

  constructor(props: PlayerRenderProps) {
    const texture = Texture.from('player');
    super(texture);

    this.tileSize = props.tileSize;
    this.scale.set(this.tileSize / this.width, this.tileSize / this.height);
    this.x = props.x;
    this.y = props.y;
    this.dot = new Graphics();
    this.addChild(this.dot);
    this.drawDot();
  }

  private drawDot() {
    this.dot.clear();
    this.dot.circle(0, 0, 2).fill(0x00ff00);
  }

  public update() {
    // this.drawDot();
  }
}
