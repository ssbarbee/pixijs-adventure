import { Container, Graphics } from 'pixi.js';

import {
  CircularRoom,
  ConnectableRoom,
  ConnectionRoom,
  Dungeon,
  RectangleRoom,
} from '../../../map/types';
import { CircularRoomEntity } from '../../room/circular';
import { ConnectionRoomEntity } from '../../room/connection';
import { RectangleRoomEntity } from '../../room/rectangle';
import { Circle } from '../../visibility/circle';
import { VisibilityRender } from '../../visibility/main';
import { Rectangle } from '../../visibility/rectangle';

export type RoomEntity = RectangleRoomEntity | CircularRoomEntity | ConnectionRoomEntity;

export interface DungeonRenderProps {
  dungeon: Dungeon;
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class DungeonRender extends Container {
  private readonly tileSize: number;
  private readonly offsetX: number;
  private readonly offsetY: number;
  private readonly visibilityRender: VisibilityRender = new VisibilityRender();
  private readonly roomEntities: Map<string, RoomEntity> = new Map();

  constructor(props: DungeonRenderProps) {
    super();
    this.tileSize = props.tileSize;
    this.offsetX = props.offsetX;
    this.offsetY = props.offsetY;
    this.sortableChildren = true;

    this.createRoomEntities(props.dungeon);
  }

  private createRoomEntities(dungeon: Dungeon): void {
    const queue: ConnectableRoom[] = [dungeon.root];
    const connections: ConnectionRoom[] = [];

    // Process rooms using BFS
    while (queue.length > 0) {
      const room = queue.shift()!;

      if (room.type === 'rectangle') {
        this.createRectangleRoomEntity(room as RectangleRoom);
      } else if (room.type === 'circular') {
        this.createCircularRoomEntity(room as CircularRoom);
      }

      room.children.forEach((child) => queue.push(child));
      room.connections.forEach((connection) => connections.push(connection));
    }

    // Create connection entities
    connections.forEach((connection) => {
      this.createConnectionRoomEntity(connection);
    });
  }

  private createRectangleRoomEntity(room: RectangleRoom): void {
    const entity = new RectangleRoomEntity({
      id: room.id,
      x: room.x,
      y: room.y,
      width: room.width,
      height: room.height,
      obstacles: room.obstacles,
      tileSize: this.tileSize,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
    this.roomEntities.set(room.id, entity);
    this.addChild(entity.view);
  }

  private createCircularRoomEntity(room: CircularRoom): void {
    const entity = new CircularRoomEntity({
      id: room.id,
      x: room.x,
      y: room.y,
      radius: room.radius,
      obstacles: room.obstacles,
      tileSize: this.tileSize,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
    this.roomEntities.set(room.id, entity);
    this.addChild(entity.view);
  }

  private createConnectionRoomEntity(connection: ConnectionRoom): void {
    const entity = new ConnectionRoomEntity({
      id: connection.id,
      x: connection.x,
      y: connection.y,
      width: connection.width,
      height: connection.height,
      tileSize: this.tileSize,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
    this.roomEntities.set(connection.id, entity);
    this.addChild(entity.view);
  }

  getRoomEntity(id: string): RoomEntity | undefined {
    return this.roomEntities.get(id);
  }

  getAllRoomEntities(): RoomEntity[] {
    return Array.from(this.roomEntities.values());
  }

  drawVisibility(
    room: ConnectableRoom | ConnectionRoom,
    lightSource: { x: number; y: number },
  ): Graphics {
    if (room.type === 'rectangle') {
      return this.visibilityRender.draw(
        new Rectangle(
          this.dungeonXToSceneX(room.x),
          this.dungeonYToSceneY(room.y),
          (room as RectangleRoom).width * this.tileSize,
          (room as RectangleRoom).height * this.tileSize,
        ),
        room.obstacles.map(
          (obs) =>
            new Rectangle(
              this.dungeonXToSceneX(obs.x),
              this.dungeonYToSceneY(obs.y),
              obs.width * this.tileSize,
              obs.height * this.tileSize,
            ),
        ),
        {
          x: this.dungeonXToSceneX(lightSource.x),
          y: this.dungeonYToSceneY(lightSource.y),
        },
      );
    }
    if (room.type === 'circular') {
      return this.visibilityRender.draw(
        new Circle(
          this.dungeonXToSceneX(room.x),
          this.dungeonYToSceneY(room.y),
          (room as CircularRoom).radius * this.tileSize,
        ),
        room.obstacles.map(
          (obs) =>
            new Rectangle(
              this.dungeonXToSceneX(obs.x),
              this.dungeonYToSceneY(obs.y),
              obs.width * this.tileSize,
              obs.height * this.tileSize,
            ),
        ),
        {
          x: this.dungeonXToSceneX(lightSource.x),
          y: this.dungeonYToSceneY(lightSource.y),
        },
      );
    }
    if (room.type === 'connection') {
      return this.visibilityRender.draw(
        new Rectangle(
          this.dungeonXToSceneX(room.x),
          this.dungeonYToSceneY(room.y),
          room.width * this.tileSize,
          room.height * this.tileSize,
        ),
        [],
        {
          x: this.dungeonXToSceneX(lightSource.x),
          y: this.dungeonYToSceneY(lightSource.y),
        },
      );
    }
    throw new Error('Unsupported room type');
  }

  private dungeonXToSceneX(dungeonX: number): number {
    return dungeonX * this.tileSize + this.offsetX;
  }

  private dungeonYToSceneY(dungeonY: number): number {
    return dungeonY * this.tileSize + this.offsetY;
  }
}
