import { Container } from 'pixi.js';

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
  private readonly _model: ConnectionRoomModel;
  private readonly _render: ConnectionRoomRender;

  constructor(props: ConnectionRoomEntityProps) {
    this._model = new ConnectionRoomModel({
      id: props.id,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    });

    this._render = new ConnectionRoomRender({
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
