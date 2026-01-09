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

export interface PatrolPoint {
  x: number;
  y: number;
}

const AGGRO_RADIUS = 150;
const CHASE_SPEED_MULTIPLIER = 1.5;
const PATROL_POINT_THRESHOLD = 15;
const DIRECTION_THRESHOLD = 10;

export class DinoAI {
  private onMove: (direction: DinoDirection) => void;
  private dinoPosition: { x: number; y: number; width: number; height: number };
  private playerPosition: { x: number; y: number; width: number; height: number };

  private state: DinoAIState = 'walk';
  private patrolPoints: PatrolPoint[] = [];
  private currentPatrolIndex: number = 0;

  constructor(
    move: (direction: DinoDirection) => void,
    dinoPosition: { x: number; y: number; width: number; height: number },
    playerPosition: { x: number; y: number; width: number; height: number },
    patrolPoints: PatrolPoint[],
  ) {
    this.onMove = move;
    this.dinoPosition = dinoPosition;
    this.playerPosition = playerPosition;
    this.patrolPoints = patrolPoints;
  }

  public getState(): DinoAIState {
    return this.state;
  }

  public getSpeedMultiplier(): number {
    return this.state === 'chase' ? CHASE_SPEED_MULTIPLIER : 1.0;
  }

  public update() {
    // Check aggro radius to determine state
    if (this.isPlayerInAggroRadius()) {
      this.state = 'chase';
      this.updateChase();
    } else {
      this.state = 'walk';
      this.updateWalk();
    }
  }

  private updateWalk() {
    // Move toward current patrol point
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    if (!targetPoint) {
      this.onMove('idle');
      return;
    }

    const direction = this.getDirectionTowardsPoint(targetPoint.x, targetPoint.y);
    this.onMove(direction);

    // Check if reached patrol point
    if (this.isNearPoint(targetPoint.x, targetPoint.y, PATROL_POINT_THRESHOLD)) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    }
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

  private isNearPoint(targetX: number, targetY: number, threshold: number): boolean {
    const dinoCenterX = this.dinoPosition.x + this.dinoPosition.width / 2;
    const dinoCenterY = this.dinoPosition.y + this.dinoPosition.height / 2;
    const dx = targetX - dinoCenterX;
    const dy = targetY - dinoCenterY;
    return Math.abs(dx) < threshold && Math.abs(dy) < threshold;
  }

  private getDirectionTowardsPoint(targetX: number, targetY: number): DinoDirection {
    const dinoCenterX = this.dinoPosition.x + this.dinoPosition.width / 2;
    const dinoCenterY = this.dinoPosition.y + this.dinoPosition.height / 2;
    const xDiff = targetX - dinoCenterX;
    const yDiff = targetY - dinoCenterY;

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
