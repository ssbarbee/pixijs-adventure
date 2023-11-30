export class DinoAI {
  private intervalId: number | null = null;
  private onKeyUp: (event: { key: string }) => void;
  private onKeyDown: (event: { key: string }) => void;
  private currentDirection: 'up' | 'down' | 'left' | 'right' = 'up';

  constructor(
    onKeyUp: (event: { key: string }) => void,
    onKeyDown: (event: { key: string }) => void,
  ) {
    this.onKeyDown = onKeyDown;
    this.onKeyUp = onKeyUp;
    this.start();
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => {
        this.move();
      }, 1000);
    }
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private getRandomDirection(): 'up' | 'down' | 'left' | 'right' {
    const possibleDirections: Array<'up' | 'down' | 'left' | 'right'> = [];

    // Only add directions that are not opposite to the current direction
    if (this.currentDirection !== 'down') possibleDirections.push('up');
    if (this.currentDirection !== 'up') possibleDirections.push('down');
    if (this.currentDirection !== 'right') possibleDirections.push('left');
    if (this.currentDirection !== 'left') possibleDirections.push('right');

    const randomIndex = Math.floor(Math.random() * possibleDirections.length);
    return possibleDirections[randomIndex];
  }

  private move() {
    const newDirection = this.getRandomDirection();

    // Emit key events based on the selected direction
    if (newDirection === 'up') {
      this.emitKeyUp('w');
      this.emitKeyDown('s');
    } else if (newDirection === 'down') {
      this.emitKeyUp('s');
      this.emitKeyDown('w');
    } else if (newDirection === 'left') {
      this.emitKeyUp('a');
      this.emitKeyDown('d');
    } else if (newDirection === 'right') {
      this.emitKeyUp('d');
      this.emitKeyDown('a');
    }

    this.currentDirection = newDirection;
  }

  private emitKeyUp(key: string) {
    this.onKeyUp({ key });
  }

  private emitKeyDown(key: string) {
    this.onKeyDown({ key });
  }

  public destroy() {
    this.stop();
  }
}
