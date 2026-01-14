import { Container } from 'pixi.js';

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
  private readonly _model: ObstacleModel;
  private readonly _render: ObstacleRender;

  constructor(props: ObstacleEntityProps) {
    this._model = new ObstacleModel({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      type: props.type,
    });

    this._render = new ObstacleRender({
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

  /** The display object to add to a PixiJS container */
  get view(): Container {
    return this._render;
  }

  containsPoint(x: number, y: number): boolean {
    return this._model.containsPoint(x, y);
  }
}
