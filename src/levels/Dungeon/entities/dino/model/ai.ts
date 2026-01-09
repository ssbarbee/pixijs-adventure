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

export type DinoAIState = 'walk' | 'chase';

const AGGRO_RADIUS = 150;
const CHASE_SPEED_MULTIPLIER = 1.5;
const DIRECTION_THRESHOLD = 10;
const WALK_DISTANCE = 100; // How far to walk before turning around
const STUCK_THRESHOLD = 2; // How many frames of no movement before considered stuck

export class DinoAI {
  private onMove: (direction: DinoDirection) => void;
  private dinoPosition: { x: number; y: number; width: number; height: number };
  private playerPosition: { x: number; y: number; width: number; height: number };

  private state: DinoAIState = 'walk';
  private previousState: DinoAIState = 'walk';

  // Walk patrol state
  private walkHomeX: number = 0;
  private walkHomeY: number = 0;
  private walkDirection: 'left' | 'right' = 'right';
  private lastX: number = 0;
  private lastY: number = 0;
  private stuckFrames: number = 0;

  constructor(
    move: (direction: DinoDirection) => void,
    dinoPosition: { x: number; y: number; width: number; height: number },
    playerPosition: { x: number; y: number; width: number; height: number },
  ) {
    this.onMove = move;
    this.dinoPosition = dinoPosition;
    this.playerPosition = playerPosition;
    // Initialize walk home to starting position
    this.walkHomeX = dinoPosition.x;
    this.walkHomeY = dinoPosition.y;
    this.lastX = dinoPosition.x;
    this.lastY = dinoPosition.y;
  }

  public getState(): DinoAIState {
    return this.state;
  }

  public getSpeedMultiplier(): number {
    return this.state === 'chase' ? CHASE_SPEED_MULTIPLIER : 1.0;
  }

  public update() {
    this.previousState = this.state;

    // Check aggro radius to determine state
    if (this.isPlayerInAggroRadius()) {
      this.state = 'chase';
      this.updateChase();
    } else {
      // Transitioning from chase to walk - establish new home position
      if (this.previousState === 'chase') {
        this.walkHomeX = this.dinoPosition.x;
        this.walkHomeY = this.dinoPosition.y;
        this.stuckFrames = 0;
      }
      this.state = 'walk';
      this.updateWalk();
    }

    // Track position for stuck detection
    this.lastX = this.dinoPosition.x;
    this.lastY = this.dinoPosition.y;
  }

  private updateWalk() {
    // Check if we're stuck (position hasn't changed)
    const moved =
      Math.abs(this.dinoPosition.x - this.lastX) > 0.1 ||
      Math.abs(this.dinoPosition.y - this.lastY) > 0.1;

    if (!moved) {
      this.stuckFrames++;
    } else {
      this.stuckFrames = 0;
    }

    // If stuck, reverse direction and reset home
    if (this.stuckFrames > STUCK_THRESHOLD) {
      this.walkDirection = this.walkDirection === 'left' ? 'right' : 'left';
      this.walkHomeX = this.dinoPosition.x;
      this.walkHomeY = this.dinoPosition.y;
      this.stuckFrames = 0;
    }

    // Calculate how far we've walked from home
    const distanceFromHome = Math.abs(this.dinoPosition.x - this.walkHomeX);

    // If we've walked far enough, turn around
    if (distanceFromHome >= WALK_DISTANCE) {
      this.walkDirection = this.walkDirection === 'left' ? 'right' : 'left';
      this.walkHomeX = this.dinoPosition.x;
      this.walkHomeY = this.dinoPosition.y;
    }

    // Move in current walk direction
    this.onMove(this.walkDirection);
  }

  private updateChase() {
    const direction = this.getDirectionTowardsPlayer();
    this.onMove(direction);
  }

  private isPlayerInAggroRadius(): boolean {
    const dinoCenterX = this.dinoPosition.x + this.dinoPosition.width / 2;
    const dinoCenterY = this.dinoPosition.y + this.dinoPosition.height / 2;
    const playerCenterX = this.playerPosition.x + this.playerPosition.width / 2;
    const playerCenterY = this.playerPosition.y + this.playerPosition.height / 2;

    const dx = playerCenterX - dinoCenterX;
    const dy = playerCenterY - dinoCenterY;
    const distanceSquared = dx * dx + dy * dy;

    return distanceSquared <= AGGRO_RADIUS * AGGRO_RADIUS;
  }

  private getDirectionTowardsPlayer(): DinoDirection {
    const dinoCenterX = this.dinoPosition.x + this.dinoPosition.width / 2;
    const dinoCenterY = this.dinoPosition.y + this.dinoPosition.height / 2;
    const playerCenterX = this.playerPosition.x + this.playerPosition.width / 2;
    const playerCenterY = this.playerPosition.y + this.playerPosition.height / 2;

    const xDiff = playerCenterX - dinoCenterX;
    const yDiff = playerCenterY - dinoCenterY;

    if (Math.abs(xDiff) < DIRECTION_THRESHOLD && Math.abs(yDiff) < DIRECTION_THRESHOLD) {
      return 'idle';
    }

    if (xDiff > DIRECTION_THRESHOLD && yDiff > DIRECTION_THRESHOLD) {
      return 'downRight';
    }
    if (xDiff > DIRECTION_THRESHOLD && yDiff < -DIRECTION_THRESHOLD) {
      return 'upRight';
    }
    if (xDiff < -DIRECTION_THRESHOLD && yDiff > DIRECTION_THRESHOLD) {
      return 'downLeft';
    }
    if (xDiff < -DIRECTION_THRESHOLD && yDiff < -DIRECTION_THRESHOLD) {
      return 'upLeft';
    }
    if (xDiff > DIRECTION_THRESHOLD) {
      return 'right';
    }
    if (xDiff < -DIRECTION_THRESHOLD) {
      return 'left';
    }
    if (yDiff > DIRECTION_THRESHOLD) {
      return 'down';
    }
    if (yDiff < -DIRECTION_THRESHOLD) {
      return 'up';
    }

    return 'idle';
  }

  public destroy() {}

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
}
