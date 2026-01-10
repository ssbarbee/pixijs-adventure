export type PlayerBox = {
  left: number;
  right: number;
  bottom: number;
  top: number;
};

export interface PlayerModelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  baseMoveSpeed: number;
  onPositionUpdate: (box: PlayerBox) => boolean;
}

export class PlayerModel {
  x: number = 0;
  y: number = 0;
  private width: number = 0;
  private height: number = 0;
  private baseMoveSpeed: number = 0;
  private keysPressed: Set<string> = new Set();
  private onPositionUpdate: (box: PlayerBox) => boolean;

  constructor(props: PlayerModelProps) {
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.baseMoveSpeed = props.baseMoveSpeed;
    this.onPositionUpdate = props.onPositionUpdate;
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'].includes(key)) {
      this.keysPressed.add(key);
      event.preventDefault();
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keysPressed.delete(event.key.toLowerCase());
  }

  public update(framesPassed: number) {
    this.move(framesPassed);
  }

  private move(framesPassed: number) {
    if (this.keysPressed.size === 0) {
      return;
    }

    const moveSpeed = this.baseMoveSpeed * framesPassed;

    let newX = this.x;
    let newY = this.y;
    if (this.keysPressed.has('w') || this.keysPressed.has('arrowup')) newY -= moveSpeed;
    if (this.keysPressed.has('s') || this.keysPressed.has('arrowdown')) newY += moveSpeed;
    if (this.keysPressed.has('a') || this.keysPressed.has('arrowleft')) newX -= moveSpeed;
    if (this.keysPressed.has('d') || this.keysPressed.has('arrowright')) newX += moveSpeed;

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
