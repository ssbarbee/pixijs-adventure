export type PlayerBox = {
  left: number;
  right: number;
  bottom: number;
  top: number;
};

export class PlayerModel {
  x: number = 0;
  y: number = 0;
  private width: number = 0;
  private height: number = 0;
  // Base move speed, you can adjust this as needed
  private baseMoveSpeed: number = 0;
  private keysPressed: Set<string> = new Set(); // Holds the keys that are currently pressed
  private onPositionUpdate: (box: PlayerBox) => boolean;

  constructor(
    startX: number,
    startY: number,
    width: number,
    height: number,
    baseMoveSpeed: number,
    onPositionUpdate: (box: PlayerBox) => boolean,
  ) {
    this.x = startX;
    this.y = startY;
    this.width = width;
    this.height = height;
    this.baseMoveSpeed = baseMoveSpeed;
    this.onPositionUpdate = onPositionUpdate;
    // Add keyboard event listeners for both keydown and keyup
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
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
    this.move(framesPassed);
  }

  private move(framesPassed: number) {
    if (this.keysPressed.size === 0) {
      return;
    }

    // Scale move speed by frames passed
    const moveSpeed = this.baseMoveSpeed * framesPassed;

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

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
