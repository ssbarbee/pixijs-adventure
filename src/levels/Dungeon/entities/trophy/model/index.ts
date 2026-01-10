export interface TrophyModelProps {
  x: number;
  y: number;
  collisionThreshold: number;
  onCollected: () => void;
}

export class TrophyModel {
  readonly x: number;
  readonly y: number;
  private collisionThreshold: number;
  private onCollected: () => void;
  private collected: boolean = false;

  constructor(props: TrophyModelProps) {
    this.x = props.x;
    this.y = props.y;
    this.collisionThreshold = props.collisionThreshold;
    this.onCollected = props.onCollected;
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
