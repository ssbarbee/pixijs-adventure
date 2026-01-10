import { Sprite, Texture } from 'pixi.js';

export interface TrophyRenderProps {
  x: number;
  y: number;
  tileSize: number;
}

export class TrophyRender extends Sprite {
  constructor(props: TrophyRenderProps) {
    const texture = Texture.from('trophy');
    super(texture);

    this.anchor.set(0.5);

    const trophySize = props.tileSize * 0.8;
    this.scale.set(trophySize / this.width, trophySize / this.height);

    this.x = props.x;
    this.y = props.y;
  }
}
