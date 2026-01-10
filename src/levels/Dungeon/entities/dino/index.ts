import { DinoBox, DinoModel } from './model';
import { DinoRender } from './render';

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
  render: DinoRender;
  model: DinoModel;

  constructor(props: DinoEntityProps) {
    this.render = new DinoRender({
      x: props.x,
      y: props.y,
      tileSize: props.tileSize,
    });
    this.model = new DinoModel({
      x: this.render.x,
      y: this.render.y,
      width: this.render.width,
      height: this.render.height,
      baseMoveSpeed: this.render.tileSize * 0.02,
      onPositionUpdate: props.onPositionUpdate,
      onIdle: props.onIdle,
      player: props.player,
    });
  }

  public getAIState() {
    return this.model.getAIState();
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
    this.render.x = this.model.x;
    this.render.y = this.model.y;
  }

  public destroy() {
    this.model.destroy();
    this.render.destroy();
  }
}
