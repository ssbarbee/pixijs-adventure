import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';

import { INK_COLOR2, TILE_COLOR } from '../../../../../../constants';

export interface BaseRoomRenderProps {
  id: string;
  x: number;
  y: number;
  tileSize: number;
  offsetX: number;
  offsetY: number;
  debug?: boolean;
}

export abstract class BaseRoomRender extends Container {
  protected readonly tileSize: number;
  protected readonly offsetX: number;
  protected readonly offsetY: number;
  protected readonly roomId: string;
  protected readonly dungeonX: number;
  protected readonly dungeonY: number;
  protected readonly debug: boolean;

  constructor(props: BaseRoomRenderProps) {
    super();
    this.tileSize = props.tileSize;
    this.offsetX = props.offsetX;
    this.offsetY = props.offsetY;
    this.roomId = props.id;
    this.dungeonX = props.x;
    this.dungeonY = props.y;
    this.debug = props.debug ?? false;
    this.sortableChildren = true;
  }

  protected dungeonXToSceneX(dungeonX: number): number {
    return dungeonX * this.tileSize + this.offsetX;
  }

  protected dungeonYToSceneY(dungeonY: number): number {
    return dungeonY * this.tileSize + this.offsetY;
  }

  protected createTileSprite(x: number, y: number, size: number, textureSource: string): Sprite {
    const texture = Texture.from(textureSource);
    const sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(size / sprite.width, size / sprite.height);
    return sprite;
  }

  protected drawDebugDot(sceneX: number, sceneY: number, color: number = 0xff0000): void {
    const graphics = new Graphics();
    graphics.circle(sceneX, sceneY, 4).fill(color);
    this.addChild(graphics);
  }

  protected drawRoomID(): void {
    const idText = new Text({
      text: this.roomId,
      style: {
        fontSize: this.tileSize / 4,
        fill: INK_COLOR2,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        fontStyle: 'italic',
      },
    });
    idText.x = this.dungeonXToSceneX(this.dungeonX);
    idText.y = this.dungeonYToSceneY(this.dungeonY);
    this.addChild(idText);
  }

  protected drawDungeonLand(top: number, left: number, width: number, height: number): Graphics {
    const graphics = new Graphics();
    const squareSize = this.tileSize;

    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        const squareX = this.dungeonXToSceneX(x);
        const squareY = this.dungeonYToSceneY(y);
        const tileSprite = this.createTileSprite(squareX, squareY, squareSize, 'dungeonLand');
        graphics.addChild(tileSprite);
      }
    }
    return graphics;
  }

  protected drawDebugGrid(top: number, left: number, width: number, height: number): Graphics {
    const graphics = new Graphics();
    const squareSize = this.tileSize;

    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        const squareX = this.dungeonXToSceneX(x);
        const squareY = this.dungeonYToSceneY(y);

        graphics
          .rect(squareX, squareY, squareSize, squareSize)
          .fill({ color: TILE_COLOR, alpha: 0.1 })
          .stroke({ width: 1, color: 0x000000, alpha: 1 });
      }
    }
    return graphics;
  }
}
