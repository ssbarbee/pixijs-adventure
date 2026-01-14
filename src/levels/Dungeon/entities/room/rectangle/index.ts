import { SupportedObstacles } from '../../../map/types';
import { RectangleRoomModel } from './model';
import { RectangleRoomRender } from './render';

export interface RectangleRoomEntityProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  obstacles: SupportedObstacles[];
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class RectangleRoomEntity {
  readonly model: RectangleRoomModel;
  readonly render: RectangleRoomRender;

  constructor(props: RectangleRoomEntityProps) {
    this.model = new RectangleRoomModel({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      obstacles: props.obstacles,
    });

    this.render = new RectangleRoomRender({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
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
