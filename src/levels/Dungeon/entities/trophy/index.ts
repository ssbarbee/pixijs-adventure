import { Container } from 'pixi.js';

import { TrophyModel } from './model';
import { TrophyRender } from './render';

export interface TrophyEntityProps {
  x: number;
  y: number;
  tileSize: number;
  onCollected: () => void;
}

export class TrophyEntity {
  private readonly _model: TrophyModel;
  private readonly _render: TrophyRender;

  constructor(props: TrophyEntityProps) {
    this._render = new TrophyRender({
      x: props.x,
      y: props.y,
      tileSize: props.tileSize,
    });

    const collisionThreshold = props.tileSize * 0.6;
    this._model = new TrophyModel({
      x: props.x,
      y: props.y,
      collisionThreshold,
      onCollected: props.onCollected,
    });
  }

  /** The display object to add to a PixiJS container */
  public get view(): Container {
    return this._render;
  }

  public get x(): number {
    return this._render.x;
  }

  public get y(): number {
    return this._render.y;
  }

  public checkCollision(playerCenterX: number, playerCenterY: number): boolean {
    return this._model.checkCollision(playerCenterX, playerCenterY);
  }

  public isCollected(): boolean {
    return this._model.isCollected();
  }

  public update(): void {
    this._render.update(this._model.isCollected());
  }

  public destroy(): void {
    this._render.destroy();
  }
}
