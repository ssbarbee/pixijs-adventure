import { DinoAI } from './ai';

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
  private keysPressed: Set<string> = new Set(); // Holds the keys that are currently pressed
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
  ) {
    this.x = startX;
    this.y = startY;
    this.width = width;
    this.height = height;
    this.baseMoveSpeed = baseMoveSpeed;
    this.onPositionUpdate = onPositionUpdate;
    this.onIdle = onIdle;
    // Add keyboard event listeners for both keydown and keyup
    this.ai = new DinoAI(this.handleKeyUp.bind(this), this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: { key: string }) {
    // Recognize both WASD
    // Convert to lower case for uniformity
    const key = event.key.toLowerCase();
    if (['w', 's', 'a', 'd'].includes(key)) {
      // Add the key to the state when it's pressed
      this.keysPressed.add(key);
    }
  }

  private handleKeyUp(event: { key: string }) {
    // Remove the key from the state when it's released
    this.keysPressed.delete(event.key.toLowerCase());
  }

  public update(framesPassed: number) {
    this.move(framesPassed);
  }

  private move(framesPassed: number) {
    if (this.keysPressed.size === 0) {
      this.onIdle();
      return;
    }

    // Scale move speed by frames passed
    const moveSpeed = this.baseMoveSpeed * framesPassed;

    let newX = this.x;
    let newY = this.y;
    // Check for each key in the keysPressed set and move accordingly
    if (this.keysPressed.has('w')) newY -= moveSpeed;
    if (this.keysPressed.has('s')) newY += moveSpeed;
    if (this.keysPressed.has('a')) newX -= moveSpeed;
    if (this.keysPressed.has('d')) newX += moveSpeed;

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
    }
  }

  public destroy() {
    this.ai.destroy();
  }
}
