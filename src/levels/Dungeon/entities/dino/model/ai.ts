export type DinoDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'upRight'
  | 'upLeft'
  | 'downRight'
  | 'downLeft'
  | 'idle';

export class DinoAI {
  private intervalId: number | null = null;
  private onMove: (direction: DinoDirection) => void;
  private dinoPosition: { x: number; y: number; width: number; height: number };
  private playerPosition: { x: number; y: number; width: number; height: number };

  constructor(
    move: (direction: DinoDirection) => void,
    dinoPosition: { x: number; y: number; width: number; height: number },
    playerPosition: { x: number; y: number; width: number; height: number },
  ) {
    this.onMove = move;
    this.dinoPosition = dinoPosition;
    this.playerPosition = playerPosition;
    this.start();
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => {
        this.move();
      }, 1);
    }
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private getDirectionTowardsPlayer(): DinoDirection {
    // Check if player is completely inside Dino
    if (this.isPlayerCompletelyInsideDino()) {
      return 'idle'; // Assuming 'idle' is a valid direction for no movement
    }

    const xDiff = this.playerPosition.x - this.dinoPosition.x;
    const yDiff = this.playerPosition.y - this.dinoPosition.y;
    const threshold = 10; // Adjust this value as needed

    if (Math.abs(xDiff) < threshold && Math.abs(yDiff) < threshold) {
      return 'idle'; // Return 'idle' if within the threshold to avoid jittering
    }

    if (xDiff > threshold && yDiff > threshold) {
      return 'downRight';
    }
    if (xDiff > threshold && yDiff < -threshold) {
      return 'upRight';
    }
    if (xDiff < -threshold && yDiff > threshold) {
      return 'downLeft';
    }
    if (xDiff < -threshold && yDiff < -threshold) {
      return 'upLeft';
    }
    if (xDiff > threshold) {
      return 'right';
    }
    if (xDiff < -threshold) {
      return 'left';
    }
    if (yDiff > threshold) {
      return 'down';
    }
    if (yDiff < -threshold) {
      return 'up';
    }

    // Default case if Dino and player are within threshold but not overlapping
    return 'idle';
  }

  private move() {
    const newDirection = this.getDirectionTowardsPlayer();
    this.onMove(newDirection);
  }

  public destroy() {
    this.stop();
  }

  public updatePlayerPosition(newPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    this.playerPosition = newPosition;
  }

  public updateDinoPosition(newPosition: { x: number; y: number; width: number; height: number }) {
    this.dinoPosition = newPosition;
  }

  private isPlayerCompletelyInsideDino(): boolean {
    const dinoRight = this.dinoPosition.x + this.dinoPosition.width;
    const dinoBottom = this.dinoPosition.y + this.dinoPosition.height;
    const playerRight = this.playerPosition.x + this.playerPosition.width;
    const playerBottom = this.playerPosition.y + this.playerPosition.height;

    return (
      this.playerPosition.x > this.dinoPosition.x &&
      this.playerPosition.y > this.dinoPosition.y &&
      playerRight < dinoRight &&
      playerBottom < dinoBottom
    );
  }
}
