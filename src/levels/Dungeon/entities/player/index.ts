import { PlayerBox, PlayerModel } from './model';
import { PlayerRender } from './render';

export interface PlayerEntityProps {
  x: number;
  y: number;
  tileSize: number;
  onPositionUpdate: (box: PlayerBox) => boolean;
}

export class PlayerEntity {
  model: PlayerModel;
  render: PlayerRender;

  constructor(props: PlayerEntityProps) {
    this.render = new PlayerRender({
      x: props.x,
      y: props.y,
      tileSize: props.tileSize,
    });
    this.model = new PlayerModel({
      x: this.render.x,
      y: this.render.y,
      width: this.render.width,
      height: this.render.height,
      baseMoveSpeed: this.render.tileSize * 0.2,
      onPositionUpdate: props.onPositionUpdate,
    });
  }

  public get x() {
    return this.render.x;
  }

  public get y() {
    return this.render.y;
  }

  public get centerX() {
    return this.x + this.render.tileSize / 2;
  }

  public get centerY() {
    return this.y + this.render.tileSize / 2;
  }

  public update(framesPassed: number) {
    this.model.update(framesPassed);
    this.render.update();
    this.render.x = this.model.x;
    this.render.y = this.model.y;
  }

  public destroy() {
    this.model.destroy();
    this.render.destroy();
  }
}
