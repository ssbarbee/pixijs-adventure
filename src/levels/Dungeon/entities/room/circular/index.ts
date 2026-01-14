import { SupportedObstacles } from '../../../map/types';
import { CircularRoomModel } from './model';
import { CircularRoomRender } from './render';

export interface CircularRoomEntityProps {
  id: string;
  x: number;
  y: number;
  radius: number;
  obstacles: SupportedObstacles[];
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class CircularRoomEntity {
  readonly model: CircularRoomModel;
  readonly render: CircularRoomRender;

  constructor(props: CircularRoomEntityProps) {
    this.model = new CircularRoomModel({
      id: props.id,
      x: props.x,
      y: props.y,
      radius: props.radius,
      obstacles: props.obstacles,
    });

    this.render = new CircularRoomRender({
      id: props.id,
      x: props.x,
      y: props.y,
      radius: props.radius,
      obstacles: props.obstacles,
      tileSize: props.tileSize,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
    });
  }

  containsPoint(x: number, y: number): boolean {
    return this.model.containsPoint(x, y);
  }

  isWallAt(x: number, y: number): boolean {
    return this.model.isWallAt(x, y);
  }

  getCenter(): { x: number; y: number } {
    return this.model.getCenter();
  }
}
