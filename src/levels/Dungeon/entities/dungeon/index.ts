import { Container, Graphics } from 'pixi.js';

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
  private readonly _model: DungeonModel;
  private readonly _render: DungeonRender;

  constructor(props: DungeonEntityProps) {
    this._model = new DungeonModel({
      dungeon: props.dungeon,
    });

    this._render = new DungeonRender({
      dungeon: props.dungeon,
      tileSize: props.tileSize,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
    });
  }

  /** The display object to add to a PixiJS container */
  get view(): Container {
    return this._render;
  }

  getRoomAt(x: number, y: number): ConnectableRoom | ConnectionRoom | null {
    return this._model.getRoomAt(x, y);
  }

  isWallAt(x: number, y: number): boolean {
    return this._model.isWallAt(x, y);
  }

  getRoot(): ConnectableRoom {
    return this._model.getRoot();
  }

  getAllRooms(): ConnectableRoom[] {
    return this._model.getAllRooms();
  }

  getAllConnections(): ConnectionRoom[] {
    return this._model.getAllConnections();
  }

  getRoomCenter(room: ConnectableRoom | ConnectionRoom): { x: number; y: number } {
    return this._model.getRoomCenter(room);
  }

  findFarthestRoom(startRoom: ConnectableRoom): ConnectableRoom {
    return this._model.findFarthestRoom(startRoom);
  }

  getSpawnableRoomCenters(): Array<{ x: number; y: number; room: ConnectableRoom }> {
    return this._model.getSpawnableRoomCenters();
  }

  getRoomEntity(id: string): RoomEntity | undefined {
    return this._render.getRoomEntity(id);
  }

  getAllRoomEntities(): RoomEntity[] {
    return this._render.getAllRoomEntities();
  }

  drawVisibility(
    room: ConnectableRoom | ConnectionRoom,
    lightSource: { x: number; y: number },
  ): Graphics {
    return this._render.drawVisibility(room, lightSource);
  }

  get width(): number {
    return this._model.width;
  }

  get height(): number {
    return this._model.height;
  }
}
