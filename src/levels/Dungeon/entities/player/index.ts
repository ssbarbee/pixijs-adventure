import { PlayerBox, PlayerModel } from './model';
import { PlayerRender } from './render';

export class PlayerEntity {
  model: PlayerModel;
  render: PlayerRender;

  constructor(startingX: number, startingY: number, onPositionUpdate: (box: PlayerBox) => boolean) {
    this.render = new PlayerRender(startingX, startingY);
    this.model = new PlayerModel(
      this.render.x,
      this.render.y,
      this.render.width,
      this.render.height,
      this.render.tileSize * 0.2,
      onPositionUpdate,
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
    this.render.update();
    this.render.x = this.model.x;
    this.render.y = this.model.y;
  }

  public destroy() {
    this.model.destroy();
    this.render.destroy();
  }
}
