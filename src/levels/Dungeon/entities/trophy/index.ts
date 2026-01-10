import { TrophyModel } from './model';
import { TrophyRender } from './render';

export class TrophyEntity {
  model: TrophyModel;
  render: TrophyRender;

  constructor(x: number, y: number, tileSize: number, onCollected: () => void) {
    this.render = new TrophyRender(x, y, tileSize);

    // Collision threshold is 60% of tile size
    const collisionThreshold = tileSize * 0.6;
    this.model = new TrophyModel(x, y, collisionThreshold, onCollected);
  }

  public get x(): number {
    return this.render.x;
  }

  public get y(): number {
    return this.render.y;
  }

  public checkCollision(playerCenterX: number, playerCenterY: number): boolean {
    return this.model.checkCollision(playerCenterX, playerCenterY);
  }

  public isCollected(): boolean {
    return this.model.isCollected();
  }

  public destroy(): void {
    this.render.destroy();
  }
}
