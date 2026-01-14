import { SupportedObstacles } from '../../../../map/types';
import { BaseRoomModel, BaseRoomModelProps } from '../../base/model';

export interface CircularRoomModelProps extends Omit<BaseRoomModelProps, 'type'> {
  radius: number;
  obstacles: SupportedObstacles[];
}

export class CircularRoomModel extends BaseRoomModel {
  readonly radius: number;
  readonly obstacles: SupportedObstacles[];

  constructor(props: CircularRoomModelProps) {
    super({
      id: props.id,
      x: props.x,
      y: props.y,
      type: 'circular',
    });
    this.radius = props.radius;
    this.obstacles = props.obstacles;
  }

  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= this.radius * this.radius;
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
      x: this.x,
      y: this.y,
    };
  }

  getBounds(): { left: number; right: number; top: number; bottom: number } {
    return {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius,
    };
  }
}
