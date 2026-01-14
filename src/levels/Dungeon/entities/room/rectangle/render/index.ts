import { Graphics } from 'pixi.js';

import { TILE_COLOR } from '../../../../../../constants';
import { SupportedObstacles } from '../../../../map/types';
import { ObstacleEntity } from '../../../obstacle';
import { BaseRoomRender, BaseRoomRenderProps } from '../../base/render';

export interface RectangleRoomRenderProps extends BaseRoomRenderProps {
  width: number;
  height: number;
  obstacles: SupportedObstacles[];
}

export class RectangleRoomRender extends BaseRoomRender {
  private readonly roomWidth: number;
  private readonly roomHeight: number;
  private readonly obstacleEntities: ObstacleEntity[] = [];

  constructor(props: RectangleRoomRenderProps) {
    super(props);
    this.roomWidth = props.width;
    this.roomHeight = props.height;

    this.drawRoom();
    this.createObstacles(props.obstacles);
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

  private createObstacles(obstacles: SupportedObstacles[]): void {
    for (const obstacle of obstacles) {
      const obstacleEntity = new ObstacleEntity({
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height,
        type: obstacle.type,
        tileSize: this.tileSize,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
      });
      this.obstacleEntities.push(obstacleEntity);
      this.addChild(obstacleEntity.render);
    }
  }

  private drawDebugInfo(): void {
    // Draw red dot at room origin
    this.drawDebugDot(
      this.dungeonXToSceneX(this.dungeonX),
      this.dungeonYToSceneY(this.dungeonY),
    );
    // Draw room ID
    this.drawRoomID();
  }

  getObstacleEntities(): ObstacleEntity[] {
    return this.obstacleEntities;
  }
}
