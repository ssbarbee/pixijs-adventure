import { Graphics, Sprite, Texture } from 'pixi.js';

export type PlayerBox = {
  left: number;
  right: number;
  bottom: number;
  top: number;
};

export class Player extends Sprite {
  private tileSize: number;
  private keysPressed: Set<string> = new Set(); // Holds the keys that are currently pressed
  private onPositionUpdate: (box: PlayerBox) => boolean;
  private dot: Graphics;

  constructor(
    tileSize: number,
    startingX: number,
    startingY: number,
    onPositionUpdate: (box: PlayerBox) => boolean,
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
    // Recognize both WASD and Arrow keys
    // Convert to lower case for uniformity
    const key = event.key.toLowerCase();
    if (['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'].includes(key)) {
      // Add the key to the state when it's pressed
      this.keysPressed.add(key);
      // Prevent default to avoid scrolling the window
      event.preventDefault();
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    // Remove the key from the state when it's released
    this.keysPressed.delete(event.key.toLowerCase());
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
      const baseMoveSpeed = this.tileSize * 0.2; // Base move speed, you can adjust this as needed
      const moveSpeed = baseMoveSpeed * framesPassed; // Scale move speed by frames passed

      let newX = this.x;
      let newY = this.y;
      // Check for each key in the keysPressed set and move accordingly
      if (this.keysPressed.has('w') || this.keysPressed.has('arrowup')) newY -= moveSpeed;
      if (this.keysPressed.has('s') || this.keysPressed.has('arrowdown')) newY += moveSpeed;
      if (this.keysPressed.has('a') || this.keysPressed.has('arrowleft')) newX -= moveSpeed;
      if (this.keysPressed.has('d') || this.keysPressed.has('arrowright')) newX += moveSpeed;

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
  }

  public override destroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    super.destroy();
  }
}
