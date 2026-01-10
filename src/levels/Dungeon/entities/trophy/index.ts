import { TrophyModel } from './model';
import { TrophyRender } from './render';

export interface TrophyEntityProps {
  x: number;
  y: number;
  tileSize: number;
  onCollected: () => void;
}

export class TrophyEntity {
  model: TrophyModel;
  render: TrophyRender;

  constructor(props: TrophyEntityProps) {
    this.render = new TrophyRender({
      x: props.x,
      y: props.y,
      tileSize: props.tileSize,
    });

    const collisionThreshold = props.tileSize * 0.6;
    this.model = new TrophyModel({
      x: props.x,
      y: props.y,
      collisionThreshold,
      onCollected: props.onCollected,
    });
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

  public update(): void {
    this.render.update(this.model.isCollected());
  }

  public destroy(): void {
    this.render.destroy();
  }
}
