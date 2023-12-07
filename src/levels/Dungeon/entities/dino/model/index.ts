import { DinoAI, DinoDirection } from './ai';

export type DinoBox = {
  left: number;
  right: number;
  bottom: number;
  top: number;
};

export class DinoModel {
  x: number = 0;
  y: number = 0;
  private width: number = 0;
  private height: number = 0;
  // Base move speed, you can adjust this as needed
  private baseMoveSpeed: number = 0;
  private directions: DinoDirection[] = [];
  private onPositionUpdate: (box: DinoBox) => boolean;
  private onIdle: () => void;
  private ai: DinoAI;

  constructor(
    startX: number,
    startY: number,
    width: number,
    height: number,
    baseMoveSpeed: number,
    onPositionUpdate: (box: DinoBox) => boolean,
    onIdle: () => void,
    playerStartingX: number,
    playerStartingY: number,
    playerWidth: number,
    playerHeight: number,
  ) {
    this.x = startX;
    this.y = startY;
    this.width = width;
    this.height = height;
    this.baseMoveSpeed = baseMoveSpeed;
    this.onPositionUpdate = onPositionUpdate;
    this.onIdle = onIdle;
    // Add keyboard event listeners for both keydown and keyup
    this.ai = new DinoAI(
      this.moveHandler.bind(this),
      {
        x: startX,
        y: startY,
        width: width,
        height: height,
      },
      {
        x: playerStartingX,
        y: playerStartingY,
        width: playerWidth,
        height: playerHeight,
      },
    );
  }

  private moveHandler(dinoDirection: DinoDirection) {
    if (this.directions[this.directions.length - 1] !== dinoDirection) {
      this.directions.push(dinoDirection);
    }
  }

  public update(framesPassed: number) {
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
    // Scale move speed by frames passed
    const moveSpeed = this.baseMoveSpeed * framesPassed;

    let newX = this.x;
    let newY = this.y;
    // Check for each key in the directions set and move accordingly
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

    // Calculate the bounds of the player
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
