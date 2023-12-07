import { DinoBox, DinoModel } from './model';
import { DinoRender } from './render';

export class DinoEntity {
  render: DinoRender;
  model: DinoModel;

  constructor(
    startingX: number,
    startingY: number,
    onPositionUpdate: (box: DinoBox) => boolean,
    onIdle: () => void,
    playerStartingX: number,
    playerStartingY: number,
    playerStartingWidth: number,
    playerStartingHeight: number,
  ) {
    this.render = new DinoRender(startingX, startingY);
    this.model = new DinoModel(
      this.render.x,
      this.render.y,
      this.render.width,
      this.render.height,
      this.render.tileSize * 0.02,
      onPositionUpdate,
      onIdle,
      playerStartingX,
      playerStartingY,
      playerStartingWidth,
      playerStartingHeight,
    );
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
    this.render.update(framesPassed);
    this.render.x = this.model.x;
    this.render.y = this.model.y;
  }

  public destroy() {
    this.model.destroy();
    this.render.destroy();
  }
}
