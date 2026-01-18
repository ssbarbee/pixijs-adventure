import { Container, Graphics } from 'pixi.js';

import { TILE_COLOR } from '../../../../../../constants';
import { BaseRoomRender, BaseRoomRenderProps } from '../../base/render';

export interface RectangleRoomRenderProps extends BaseRoomRenderProps {
  width: number;
  height: number;
  obstacleRenders: Container[];
}

export class RectangleRoomRender extends BaseRoomRender {
  private readonly roomWidth: number;
  private readonly roomHeight: number;

  constructor(props: RectangleRoomRenderProps) {
    super(props);
    this.roomWidth = props.width;
    this.roomHeight = props.height;

    this.drawRoom();
    this.addObstacleRenders(props.obstacleRenders);
    this.drawDebugInfo();
  }

  private drawRoom(): void {
    // Draw floor overlay
    this.drawFloorOverlay();

    // Draw dungeon land tiles
    const dungeonLandGraphics = this.drawDungeonLand(
      this.dungeonY,
      this.dungeonX,
      this.roomWidth,
      this.roomHeight,
    );
    this.addChild(dungeonLandGraphics);

    // Draw debug grid if enabled
    if (this.debug) {
      const gridGraphics = this.drawDebugGrid(
        this.dungeonY,
        this.dungeonX,
        this.roomWidth,
        this.roomHeight,
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
        this.roomWidth * this.tileSize,
        this.roomHeight * this.tileSize,
      )
      .fill({ color: TILE_COLOR, alpha: 0.1 });
    this.addChild(graphics);
  }

  private addObstacleRenders(obstacleRenders: Container[]): void {
    for (const render of obstacleRenders) {
      this.addChild(render);
    }
  }

  private drawDebugInfo(): void {
    // Draw red dot at room origin
    this.drawDebugDot(this.dungeonXToSceneX(this.dungeonX), this.dungeonYToSceneY(this.dungeonY));
    // Draw room ID
    this.drawRoomID();
  }
}
