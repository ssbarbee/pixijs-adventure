import { Dungeon } from '../../../map/types';
import { getRoomAt } from '../../../map/utils/getRoomAt';

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

export type DinoAIState = 'patrol' | 'chase' | 'return';

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

  private state: DinoAIState = 'patrol';
  private patrolPoints: PatrolPoint[] = [];
  private currentPatrolIndex: number = 0;
  private spawnRoomId: string | null = null;
  private dungeon: Dungeon | null = null;

  constructor(
    move: (direction: DinoDirection) => void,
    dinoPosition: { x: number; y: number; width: number; height: number },
    playerPosition: { x: number; y: number; width: number; height: number },
    patrolPoints: PatrolPoint[],
    spawnRoomId: string | null,
  ) {
    this.onMove = move;
    this.dinoPosition = dinoPosition;
    this.playerPosition = playerPosition;
    this.patrolPoints = patrolPoints;
    this.spawnRoomId = spawnRoomId;
  }

  public setDungeon(dungeon: Dungeon) {
    this.dungeon = dungeon;
  }

  public getState(): DinoAIState {
    return this.state;
  }

  public getSpeedMultiplier(): number {
    return this.state === 'chase' ? CHASE_SPEED_MULTIPLIER : 1.0;
  }

  public update() {
    switch (this.state) {
      case 'patrol':
        this.updatePatrol();
        break;
      case 'chase':
        this.updateChase();
        break;
      case 'return':
        this.updateReturn();
        break;
    }
  }

  private updatePatrol() {
    // Check if player is in aggro radius
    if (this.isPlayerInAggroRadius()) {
      this.state = 'chase';
      this.updateChase();
      return;
    }

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
    // Check if player left the spawn room
    if (this.hasPlayerLeftSpawnRoom()) {
      this.state = 'return';
      this.updateReturn();
      return;
    }

    // Chase the player (existing behavior)
    const direction = this.getDirectionTowardsPlayer();
    this.onMove(direction);
  }

  private updateReturn() {
    // Find nearest patrol point and move toward it
    const nearestPatrolIndex = this.getNearestPatrolPointIndex();
    const targetPoint = this.patrolPoints[nearestPatrolIndex];

    if (!targetPoint) {
      this.state = 'patrol';
      return;
    }

    const direction = this.getDirectionTowardsPoint(targetPoint.x, targetPoint.y);
    this.onMove(direction);

    // Check if reached patrol point
    if (this.isNearPoint(targetPoint.x, targetPoint.y, PATROL_POINT_THRESHOLD)) {
      this.currentPatrolIndex = nearestPatrolIndex;
      this.state = 'patrol';
    }
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

  private hasPlayerLeftSpawnRoom(): boolean {
    if (!this.dungeon || !this.spawnRoomId) {
      return false;
    }

    const playerCenterX = this.playerPosition.x + this.playerPosition.width / 2;
    const playerCenterY = this.playerPosition.y + this.playerPosition.height / 2;
    const playerRoom = getRoomAt(playerCenterX, playerCenterY, this.dungeon);

    if (!playerRoom) {
      return true; // Player is not in any room, consider as "left"
    }

    return playerRoom.id !== this.spawnRoomId;
  }

  private getNearestPatrolPointIndex(): number {
    if (this.patrolPoints.length === 0) {
      return 0;
    }

    let nearestIndex = 0;
    let nearestDistanceSquared = Infinity;
    const dinoCenterX = this.dinoPosition.x + this.dinoPosition.width / 2;
    const dinoCenterY = this.dinoPosition.y + this.dinoPosition.height / 2;

    for (let i = 0; i < this.patrolPoints.length; i++) {
      const point = this.patrolPoints[i];
      const dx = point.x - dinoCenterX;
      const dy = point.y - dinoCenterY;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < nearestDistanceSquared) {
        nearestDistanceSquared = distanceSquared;
        nearestIndex = i;
      }
    }

    return nearestIndex;
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
    if (this.isPlayerCompletelyInsideDino()) {
      return 'idle';
    }

    const xDiff = this.playerPosition.x - this.dinoPosition.x;
    const yDiff = this.playerPosition.y - this.dinoPosition.y;

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

  private isPlayerCompletelyInsideDino(): boolean {
    const dinoRight = this.dinoPosition.x + this.dinoPosition.width;
    const dinoBottom = this.dinoPosition.y + this.dinoPosition.height;
    const playerRight = this.playerPosition.x + this.playerPosition.width;
    const playerBottom = this.playerPosition.y + this.playerPosition.height;

    return (
      this.playerPosition.x > this.dinoPosition.x &&
      this.playerPosition.y > this.dinoPosition.y &&
      playerRight < dinoRight &&
      playerBottom < dinoBottom
    );
  }
}
