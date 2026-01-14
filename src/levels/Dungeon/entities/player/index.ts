import { Container } from 'pixi.js';

import type { PlayerBox } from './model';
import { PlayerModel } from './model';
import { PlayerRender } from './render';

export type { PlayerBox };

export interface PlayerEntityProps {
  x: number;
  y: number;
  tileSize: number;
  onPositionUpdate: (box: PlayerBox) => boolean;
}

export class PlayerEntity {
  private readonly _model: PlayerModel;
  private readonly _render: PlayerRender;

  constructor(props: PlayerEntityProps) {
    this._render = new PlayerRender({
      x: props.x,
      y: props.y,
      tileSize: props.tileSize,
    });
    this._model = new PlayerModel({
      x: this._render.x,
      y: this._render.y,
      width: this._render.width,
      height: this._render.height,
      baseMoveSpeed: this._render.tileSize * 0.2,
      onPositionUpdate: props.onPositionUpdate,
    });
  }

  /** The display object to add to a PixiJS container */
  public get view(): Container {
    return this._render;
  }

  public get x() {
    return this._render.x;
  }

  public get y() {
    return this._render.y;
  }

  public get width() {
    return this._render.width;
  }

  public get height() {
    return this._render.height;
  }

  public get centerX() {
    return this.x + this._render.tileSize / 2;
  }

  public get centerY() {
    return this.y + this._render.tileSize / 2;
  }

  public update(framesPassed: number) {
    this._model.update(framesPassed);
    this._render.update();
    this._render.x = this._model.x;
    this._render.y = this._model.y;
  }

  public destroy() {
    this._model.destroy();
    this._render.destroy();
  }
}
