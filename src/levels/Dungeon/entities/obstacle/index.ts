import { ObstacleModel } from './model';
import { ObstacleRender } from './render';

export interface ObstacleEntityProps {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rectangle' | 'square';
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class ObstacleEntity {
  readonly model: ObstacleModel;
  readonly render: ObstacleRender;

  constructor(props: ObstacleEntityProps) {
    this.model = new ObstacleModel({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      type: props.type,
    });

    this.render = new ObstacleRender({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      type: props.type,
      tileSize: props.tileSize,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
    });
  }

  containsPoint(x: number, y: number): boolean {
    return this.model.containsPoint(x, y);
  }
}
