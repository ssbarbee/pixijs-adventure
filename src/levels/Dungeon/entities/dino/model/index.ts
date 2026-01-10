import { DinoAI, DinoDirection } from './ai';

export type DinoBox = {
  left: number;
  right: number;
  bottom: number;
  top: number;
};

export interface DinoModelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  baseMoveSpeed: number;
  onPositionUpdate: (box: DinoBox) => boolean;
  onIdle: () => void;
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class DinoModel {
  x: number = 0;
  y: number = 0;
  private width: number = 0;
  private height: number = 0;
  private baseMoveSpeed: number = 0;
  private directions: DinoDirection[] = [];
  private onPositionUpdate: (box: DinoBox) => boolean;
  private onIdle: () => void;
  private ai: DinoAI;

  constructor(props: DinoModelProps) {
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.baseMoveSpeed = props.baseMoveSpeed;
    this.onPositionUpdate = props.onPositionUpdate;
    this.onIdle = props.onIdle;
    this.ai = new DinoAI(
      this.moveHandler.bind(this),
      {
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
      },
      {
        x: props.player.x,
        y: props.player.y,
        width: props.player.width,
        height: props.player.height,
      },
    );
  }

  public getAIState() {
    return this.ai.getState();
  }

  private moveHandler(dinoDirection: DinoDirection) {
    if (this.directions[this.directions.length - 1] !== dinoDirection) {
      this.directions.push(dinoDirection);
    }
  }

  public update(framesPassed: number) {
    this.ai.update();
    this.move(framesPassed);
  }

  private move(framesPassed: number) {
    if (this.directions.indexOf('idle') !== -1) {
      this.directions = [];
      this.onIdle();
      return;
    }
    if (this.directions.length === 0) {
      this.onIdle();
      return;
    }

    const directions = [...this.directions];
    this.directions = [];
    const speedMultiplier = this.ai.getSpeedMultiplier();
    const moveSpeed = this.baseMoveSpeed * framesPassed * speedMultiplier;

    let newX = this.x;
    let newY = this.y;
    if (
      directions.indexOf('up') !== -1 ||
      directions.indexOf('upRight') !== -1 ||
      directions.indexOf('upLeft') !== -1
    )
      newY -= moveSpeed;
    if (
      directions.indexOf('down') !== -1 ||
      directions.indexOf('downRight') !== -1 ||
      directions.indexOf('downLeft') !== -1
    )
      newY += moveSpeed;
    if (
      directions.indexOf('left') !== -1 ||
      directions.indexOf('upLeft') !== -1 ||
      directions.indexOf('downLeft') !== -1
    )
      newX -= moveSpeed;
    if (
      directions.indexOf('right') !== -1 ||
      directions.indexOf('upRight') !== -1 ||
      directions.indexOf('downRight') !== -1
    )
      newX += moveSpeed;

    const left = newX;
    const right = newX + this.width - 1;
    const top = newY;
    const bottom = newY + this.height - 1;

    if (
      this.onPositionUpdate({
        left,
        right,
        top,
        bottom,
      })
    ) {
      this.x = newX;
      this.y = newY;
      this.ai.updateDinoPosition({
        x: newX,
        y: newY,
        width: this.width,
        height: this.height,
      });
    }
  }

  public updatePlayerPosition(
    playerX: number,
    playerY: number,
    playerWidth: number,
    playerHeight: number,
  ) {
    this.ai.updatePlayerPosition({
      x: playerX,
      y: playerY,
      width: playerWidth,
      height: playerHeight,
    });
  }

  public destroy() {
    this.ai.destroy();
  }
}
