import { SupportedObstacles } from '../../../../map/types';
import { BaseRoomModel, BaseRoomModelProps } from '../../base/model';

export interface RectangleRoomModelProps extends Omit<BaseRoomModelProps, 'type'> {
  width: number;
  height: number;
  obstacles: SupportedObstacles[];
}

export class RectangleRoomModel extends BaseRoomModel {
  readonly width: number;
  readonly height: number;
  readonly obstacles: SupportedObstacles[];

  constructor(props: RectangleRoomModelProps) {
    super({
      id: props.id,
      x: props.x,
      y: props.y,
      type: 'rectangle',
    });
    this.width = props.width;
    this.height = props.height;
    this.obstacles = props.obstacles;
  }

  containsPoint(x: number, y: number): boolean {
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
  }

  isWallAt(x: number, y: number): boolean {
    // If point is not in room, it's a wall
    if (!this.containsPoint(x, y)) {
      return true;
    }
    // Check if point is inside any obstacle
    for (const obstacle of this.obstacles) {
      if (
        x >= obstacle.x &&
        x < obstacle.x + obstacle.width &&
        y >= obstacle.y &&
        y < obstacle.y + obstacle.height
      ) {
        return true;
      }
    }
    return false;
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
