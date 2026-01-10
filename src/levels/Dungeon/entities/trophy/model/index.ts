export class TrophyModel {
  readonly x: number;
  readonly y: number;
  private collisionThreshold: number;
  private onCollected: () => void;
  private collected: boolean = false;

  constructor(x: number, y: number, collisionThreshold: number, onCollected: () => void) {
    this.x = x;
    this.y = y;
    this.collisionThreshold = collisionThreshold;
    this.onCollected = onCollected;
  }

  public checkCollision(playerCenterX: number, playerCenterY: number): boolean {
    if (this.collected) return false;

    const dx = playerCenterX - this.x;
    const dy = playerCenterY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.collisionThreshold) {
      this.collected = true;
      this.onCollected();
      return true;
    }

    return false;
  }

  public isCollected(): boolean {
    return this.collected;
  }
}
