import { Graphics } from 'pixi.js';

import { TILE_COLOR } from '../../../../../../constants';
import { BaseRoomRender, BaseRoomRenderProps } from '../../base/render';

export interface ConnectionRoomRenderProps extends BaseRoomRenderProps {
  width: number;
  height: number;
}

export class ConnectionRoomRender extends BaseRoomRender {
  private readonly corridorWidth: number;
  private readonly corridorHeight: number;

  constructor(props: ConnectionRoomRenderProps) {
    super(props);
    this.corridorWidth = props.width;
    this.corridorHeight = props.height;

    this.drawRoom();
    this.drawDebugInfo();
  }

  private drawRoom(): void {
    // Draw floor overlay
    this.drawFloorOverlay();

    // Draw dungeon land tiles
    const dungeonLandGraphics = this.drawDungeonLand(
      this.dungeonY,
      this.dungeonX,
      this.corridorWidth,
      this.corridorHeight,
    );
    this.addChild(dungeonLandGraphics);

    // Draw debug grid if enabled
    if (this.debug) {
      const gridGraphics = this.drawDebugGrid(
        this.dungeonY,
        this.dungeonX,
        this.corridorWidth,
        this.corridorHeight,
      );
      this.addChild(gridGraphics);
    }
  }

  private drawFloorOverlay(): void {
    const graphics = new Graphics();
    graphics
      .rect(
        this.dungeonXToSceneX(this.dungeonX),
        this.dungeonYToSceneY(this.dungeonY),
        this.corridorWidth * this.tileSize,
        this.corridorHeight * this.tileSize,
      )
      .fill({ color: TILE_COLOR, alpha: 0.1 });
    this.addChild(graphics);
  }

  private drawDebugInfo(): void {
    // Draw red dot at connection origin
    this.drawDebugDot(this.dungeonXToSceneX(this.dungeonX), this.dungeonYToSceneY(this.dungeonY));
  }
}
