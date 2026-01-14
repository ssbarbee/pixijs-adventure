import { Container } from 'pixi.js';

import { DinoBox, DinoModel } from './model';
import { DinoRender } from './render';

export type { DinoBox };

export interface DinoEntityProps {
  x: number;
  y: number;
  tileSize: number;
  onPositionUpdate: (box: DinoBox) => boolean;
  onIdle: () => void;
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class DinoEntity {
  private readonly _render: DinoRender;
  private readonly _model: DinoModel;

  constructor(props: DinoEntityProps) {
    this._render = new DinoRender({
      x: props.x,
      y: props.y,
      tileSize: props.tileSize,
    });
    this._model = new DinoModel({
      x: this._render.x,
      y: this._render.y,
      width: this._render.width,
      height: this._render.height,
      baseMoveSpeed: this._render.tileSize * 0.02,
      onPositionUpdate: props.onPositionUpdate,
      onIdle: props.onIdle,
      player: props.player,
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

  public get centerX() {
    return this.x + this._render.tileSize / 2;
  }

  public get centerY() {
    return this.y + this._render.tileSize / 2;
  }

  public getAIState() {
    return this._model.getAIState();
  }

  public updatePlayerPosition(x: number, y: number, width: number, height: number): void {
    this._model.updatePlayerPosition(x, y, width, height);
  }

  public startRunning(): void {
    this._render.startRunning();
  }

  public stopRunning(): void {
    this._render.stopRunning();
  }

  public startWalking(): void {
    this._render.startWalking();
  }

  public stopMoving(): void {
    this._render.stopMoving();
  }

  public update(framesPassed: number) {
    this._model.update(framesPassed);
    this._render.x = this._model.x;
    this._render.y = this._model.y;
    this._render.updateDebugInfo(this.getAIState());
  }

  public destroy() {
    this._model.destroy();
    this._render.destroy();
  }
}
