import { Sprite, Texture } from 'pixi.js';

import { EntityDebugInfo } from '../../EntityDebugInfo';

export interface TrophyRenderProps {
  x: number;
  y: number;
  tileSize: number;
}

export class TrophyRender extends Sprite {
  private debugInfo: EntityDebugInfo;
  private tileSize: number;

  constructor(props: TrophyRenderProps) {
    const texture = Texture.from('trophy');
    super(texture);

    this.tileSize = props.tileSize;
    this.anchor.set(0.5);

    const trophySize = props.tileSize * 0.8;
    this.scale.set(trophySize / this.width, trophySize / this.height);

    this.x = props.x;
    this.y = props.y;

    this.debugInfo = new EntityDebugInfo({
      container: this,
      offsetX: trophySize / 2 + 5,
      offsetY: -trophySize / 2,
      parentScaleX: this.scale.x,
      parentScaleY: this.scale.y,
    });

    // Initial update
    this.update(false);
  }

  public update(collected: boolean) {
    this.debugInfo.update({
      x: this.x,
      y: this.y,
      status: collected ? 'collected' : 'active',
    });
  }
}
