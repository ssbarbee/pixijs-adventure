import { Container, Graphics } from 'pixi.js';

import { BaseRoomRender, BaseRoomRenderProps } from '../../base/render';

export interface CircularRoomRenderProps extends BaseRoomRenderProps {
  radius: number;
  obstacleRenders: Container[];
}

export class CircularRoomRender extends BaseRoomRender {
  private readonly radius: number;

  constructor(props: CircularRoomRenderProps) {
    super(props);
    this.radius = props.radius;

    this.drawRoom();
    this.addObstacleRenders(props.obstacleRenders);
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

    // Draw debug grid if enabled
    if (this.debug) {
      const gridGraphics = this.drawDebugGrid(
        this.dungeonY - this.radius,
        this.dungeonX - this.radius,
        this.radius * 2,
        this.radius * 2,
      );
      gridGraphics.mask = maskGraphics;
      this.addChild(gridGraphics);
    }
  }

  private addObstacleRenders(obstacleRenders: Container[]): void {
    for (const render of obstacleRenders) {
      this.addChild(render);
    }
  }

  private drawDebugInfo(): void {
    // Draw red dot at room center
    this.drawDebugDot(this.dungeonXToSceneX(this.dungeonX), this.dungeonYToSceneY(this.dungeonY));
    // Draw room ID
    this.drawRoomID();
  }
}
