export type RoomType = 'rectangle' | 'circular' | 'connection';

export interface BaseRoomModelProps {
  id: string;
  x: number;
  y: number;
  type: RoomType;
}

export abstract class BaseRoomModel {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly type: RoomType;

  constructor(props: BaseRoomModelProps) {
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.type = props.type;
  }

  abstract containsPoint(x: number, y: number): boolean;

  abstract isWallAt(x: number, y: number): boolean;

  abstract getCenter(): { x: number; y: number };

  abstract getBounds(): { left: number; right: number; top: number; bottom: number };
}
