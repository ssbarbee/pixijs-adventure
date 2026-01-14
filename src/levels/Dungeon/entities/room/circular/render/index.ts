import { Graphics } from 'pixi.js';

import { SupportedObstacles } from '../../../../map/types';
import { ObstacleEntity } from '../../../obstacle';
import { BaseRoomRender, BaseRoomRenderProps } from '../../base/render';

export interface CircularRoomRenderProps extends BaseRoomRenderProps {
  radius: number;
  obstacles: SupportedObstacles[];
}

export class CircularRoomRender extends BaseRoomRender {
  private readonly radius: number;
  private readonly obstacleEntities: ObstacleEntity[] = [];

  constructor(props: CircularRoomRenderProps) {
    super(props);
    this.radius = props.radius;

    this.drawRoom();
    this.createObstacles(props.obstacles);
    this.drawDebugInfo();
  }

  private drawRoom(): void {
    // Draw dungeon land tiles in a square that covers the circle
    const dungeonLandGraphics = this.drawDungeonLand(
      this.dungeonY - this.radius,
      this.dungeonX - this.radius,
      this.radius * 2,
      this.radius * 2,
    );

    // Create circular mask
    const maskGraphics = new Graphics();
    maskGraphics
      .circle(
        this.dungeonXToSceneX(this.dungeonX),
        this.dungeonYToSceneY(this.dungeonY),
        this.radius * this.tileSize,
      )
      .fill(0xffffff);

    // Apply mask to tiles
    dungeonLandGraphics.mask = maskGraphics;

    // Add mask first, then tiles
    this.addChild(maskGraphics);
    this.addChild(dungeonLandGraphics);
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
    // Draw red dot at room center
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
