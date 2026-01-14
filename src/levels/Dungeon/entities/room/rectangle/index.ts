import { Container } from 'pixi.js';

import { SupportedObstacles } from '../../../map/types';
import { ObstacleEntity } from '../../obstacle';
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
  private readonly _model: RectangleRoomModel;
  private readonly _render: RectangleRoomRender;
  private readonly obstacleEntities: ObstacleEntity[] = [];

  constructor(props: RectangleRoomEntityProps) {
    this._model = new RectangleRoomModel({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
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

    this._render = new RectangleRoomRender({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
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
