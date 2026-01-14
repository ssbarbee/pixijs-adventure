import { Container } from 'pixi.js';

import { SupportedObstacles } from '../../../map/types';
import { ObstacleEntity } from '../../obstacle';
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
  private readonly _model: CircularRoomModel;
  private readonly _render: CircularRoomRender;
  private readonly obstacleEntities: ObstacleEntity[] = [];

  constructor(props: CircularRoomEntityProps) {
    this._model = new CircularRoomModel({
      id: props.id,
      x: props.x,
      y: props.y,
      radius: props.radius,
      obstacles: props.obstacles,
    });

    // Create obstacle entities at the Entity coordinator level
    this.obstacleEntities = props.obstacles.map(
      (obstacle) =>
        new ObstacleEntity({
          x: obstacle.x,
          y: obstacle.y,
          width: obstacle.width,
          height: obstacle.height,
          type: obstacle.type,
          tileSize: props.tileSize,
          offsetX: props.offsetX,
          offsetY: props.offsetY,
        }),
    );

    this._render = new CircularRoomRender({
      id: props.id,
      x: props.x,
      y: props.y,
      radius: props.radius,
      obstacleRenders: this.obstacleEntities.map((e) => e.view),
      tileSize: props.tileSize,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
    });
  }

  /** The display object to add to a PixiJS container */
  get view(): Container {
    return this._render;
  }

  containsPoint(x: number, y: number): boolean {
    return this._model.containsPoint(x, y);
  }

  isWallAt(x: number, y: number): boolean {
    return this._model.isWallAt(x, y);
  }

  getCenter(): { x: number; y: number } {
    return this._model.getCenter();
  }
}
