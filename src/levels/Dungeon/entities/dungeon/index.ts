import { Graphics } from 'pixi.js';

import { ConnectableRoom, ConnectionRoom, Dungeon } from '../../map/types';
import { DungeonModel } from './model';
import { DungeonRender, RoomEntity } from './render';

export interface DungeonEntityProps {
  dungeon: Dungeon;
  tileSize: number;
  offsetX: number;
  offsetY: number;
}

export class DungeonEntity {
  readonly model: DungeonModel;
  readonly render: DungeonRender;

  constructor(props: DungeonEntityProps) {
    this.model = new DungeonModel({
      dungeon: props.dungeon,
    });

    this.render = new DungeonRender({
      dungeon: props.dungeon,
      tileSize: props.tileSize,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
    });
  }

  getRoomAt(x: number, y: number): ConnectableRoom | ConnectionRoom | null {
    return this.model.getRoomAt(x, y);
  }

  isWallAt(x: number, y: number): boolean {
    return this.model.isWallAt(x, y);
  }

  getRoot(): ConnectableRoom {
    return this.model.getRoot();
  }

  getAllRooms(): ConnectableRoom[] {
    return this.model.getAllRooms();
  }

  getAllConnections(): ConnectionRoom[] {
    return this.model.getAllConnections();
  }

  getRoomCenter(room: ConnectableRoom | ConnectionRoom): { x: number; y: number } {
    return this.model.getRoomCenter(room);
  }

  findFarthestRoom(startRoom: ConnectableRoom): ConnectableRoom {
    return this.model.findFarthestRoom(startRoom);
  }

  getSpawnableRoomCenters(): Array<{ x: number; y: number; room: ConnectableRoom }> {
    return this.model.getSpawnableRoomCenters();
  }

  getRoomEntity(id: string): RoomEntity | undefined {
    return this.render.getRoomEntity(id);
  }

  getAllRoomEntities(): RoomEntity[] {
    return this.render.getAllRoomEntities();
  }

  drawVisibility(
    room: ConnectableRoom | ConnectionRoom,
    lightSource: { x: number; y: number },
  ): Graphics {
    return this.render.drawVisibility(room, lightSource);
  }

  get width(): number {
    return this.model.width;
  }

  get height(): number {
    return this.model.height;
  }
}
