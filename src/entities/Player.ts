import { Graphics, Sprite, Texture } from 'pixi.js';

export class Player extends Sprite {
  private tileSize: number;
  private keysPressed: Set<string> = new Set(); // Holds the keys that are currently pressed
  private onPositionUpdate: (x: number, y: number) => boolean;
  private dot: Graphics;

  constructor(
    tileSize: number,
    startingX: number,
    startingY: number,
    onPositionUpdate: (x: number, y: number) => boolean,
  ) {
    const texture = Texture.from('player');
    super(texture);

    this.tileSize = tileSize;
    this.scale.set(this.tileSize / this.width, this.tileSize / this.height);
    this.x = startingX;
    this.y = startingY;
    this.onPositionUpdate = onPositionUpdate;
    // Add keyboard event listeners for both keydown and keyup
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    // Initialize the dot
    this.dot = new Graphics();
    this.addChild(this.dot); // Add the dot as a child of the player sprite
    this.drawDot();
  }

  private drawDot() {
    this.dot.clear();
    this.dot.beginFill(0x00ff00); // Green color
    this.dot.drawCircle(0, 0, 2); // Draw a circle at the player's center
    this.dot.endFill();
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.keysPressed.add(event.key); // Add the key to the state when it's pressed
    event.preventDefault(); // Prevent default to avoid scrolling the window
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keysPressed.delete(event.key); // Remove the key from the state when it's released
  }

  public update(framesPassed: number) {
    if (this.keysPressed.size === 0) {
      return;
    }

    this.move(framesPassed);
    this.drawDot();
  }

  private move(framesPassed: number) {
    if (this.keysPressed.size !== 0) {
      // Use framesPassed to account for frame rate
      const baseMoveSpeed = this.tileSize / 4; // Base move speed, you can adjust this as needed
      const moveSpeed = baseMoveSpeed * framesPassed; // Scale move speed by frames passed

      let newX = this.x;
      let newY = this.y;
      // Check for each key in the keysPressed set and move accordingly
      if (this.keysPressed.has('ArrowUp')) newY -= moveSpeed;
      if (this.keysPressed.has('ArrowDown')) newY += moveSpeed;
      if (this.keysPressed.has('ArrowLeft')) newX -= moveSpeed;
      if (this.keysPressed.has('ArrowRight')) newX += moveSpeed;

      if (this.onPositionUpdate(newX, newY)) {
        this.x = newX;
        this.y = newY;
      }
    }
  }

  public override destroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    super.destroy();
  }
}
