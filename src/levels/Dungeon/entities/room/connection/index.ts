import { ConnectionRoomModel } from './model';
import { ConnectionRoomRender } from './render';

export interface ConnectionRoomEntityProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class ConnectionRoomEntity {
  readonly model: ConnectionRoomModel;
  readonly render: ConnectionRoomRender;

  constructor(props: ConnectionRoomEntityProps) {
    this.model = new ConnectionRoomModel({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    });

    this.render = new ConnectionRoomRender({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
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
