import { BaseRoomModel, BaseRoomModelProps } from '../../base/model';

export interface ConnectionRoomModelProps extends Omit<BaseRoomModelProps, 'type'> {
  width: number;
  height: number;
}

export class ConnectionRoomModel extends BaseRoomModel {
  readonly width: number;
  readonly height: number;

  constructor(props: ConnectionRoomModelProps) {
    super({
      id: props.id,
      x: props.x,
      y: props.y,
      type: 'connection',
    });
    this.width = props.width;
    this.height = props.height;
  }

  containsPoint(x: number, y: number): boolean {
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
  }

  isWallAt(x: number, y: number): boolean {
    // Connections have no obstacles, so just check bounds
    return !this.containsPoint(x, y);
  }

  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  getBounds(): { left: number; right: number; top: number; bottom: number } {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
  }
}
