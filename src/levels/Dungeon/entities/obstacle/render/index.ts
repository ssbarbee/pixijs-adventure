import { Container, Graphics, Sprite, Texture } from 'pixi.js';

import { TILE2_COLOR } from '../../../../../constants';
import { getRandomString } from '../../../../../utils/getRandomString';

export interface ObstacleRenderProps {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rectangle' | 'square';
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class ObstacleRender extends Container {
  private readonly tileSize: number;
  private readonly offsetX: number;
  private readonly offsetY: number;

  constructor(props: ObstacleRenderProps) {
    super();

    this.tileSize = props.tileSize;
    this.offsetX = props.offsetX;
    this.offsetY = props.offsetY;

    this.drawObstacle(props);
  }

  private drawObstacle(props: ObstacleRenderProps): void {
    const sceneX = this.dungeonXToSceneX(props.x);
    const sceneY = this.dungeonYToSceneY(props.y);

    if (props.type === 'square') {
      const textureKey =
        props.width > 1 ? 'dungeonDecor12' : getRandomString(['dungeonBricks9', 'dungeonBricks10']);
      const tileSprite = this.createTileSprite(
        sceneX,
        sceneY,
        props.width * this.tileSize,
        textureKey,
      );
      this.addChild(tileSprite);
    } else {
      const obstacleWidth = props.width * this.tileSize;
      const obstacleHeight = props.height * this.tileSize;
      const obstacleGraphics = new Graphics();
      obstacleGraphics
        .rect(sceneX, sceneY, obstacleWidth, obstacleHeight)
        .fill(TILE2_COLOR)
        .stroke({ width: 1, color: 0x000000, alpha: 1 });
      this.addChild(obstacleGraphics);
    }

    // Debug: draw red dot at origin
    this.drawDebugDot(sceneX, sceneY);
  }

  private createTileSprite(x: number, y: number, size: number, textureSource: string): Sprite {
    const texture = Texture.from(textureSource);
    const sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(size / sprite.width, size / sprite.height);
    return sprite;
  }

  private drawDebugDot(sceneX: number, sceneY: number): void {
    const graphics = new Graphics();
    graphics.circle(sceneX, sceneY, 4).fill(0xff0000);
    this.addChild(graphics);
  }

  private dungeonXToSceneX(dungeonX: number): number {
    return dungeonX * this.tileSize + this.offsetX;
  }

  private dungeonYToSceneY(dungeonY: number): number {
    return dungeonY * this.tileSize + this.offsetY;
  }
}
