import { ConnectableRoom, ConnectionRoom, Dungeon, RectangleRoom } from '../../../map/types';
import { getRoomAt } from '../../../map/utils/getRoomAt';
import { isWallAt } from '../../../map/utils/isWallAt';

export interface DungeonModelProps {
  dungeon: Dungeon;
}

export class DungeonModel {
  readonly dungeon: Dungeon;
  readonly width: number;
  readonly height: number;

  constructor(props: DungeonModelProps) {
    this.dungeon = props.dungeon;
    this.width = props.dungeon.width;
    this.height = props.dungeon.height;
  }

  getRoomAt(x: number, y: number): ConnectableRoom | ConnectionRoom | null {
    return getRoomAt(x, y, this.dungeon);
  }

  isWallAt(x: number, y: number): boolean {
    return isWallAt(x, y, this.dungeon);
  }

  getRoot(): ConnectableRoom {
    return this.dungeon.root;
  }

  getAllRooms(): ConnectableRoom[] {
    const rooms: ConnectableRoom[] = [];
    const queue: ConnectableRoom[] = [this.dungeon.root];

    while (queue.length > 0) {
      const room = queue.shift()!;
      rooms.push(room);
      room.children.forEach((child) => queue.push(child));
    }

    return rooms;
  }

  getAllConnections(): ConnectionRoom[] {
    const connections: ConnectionRoom[] = [];
    const queue: ConnectableRoom[] = [this.dungeon.root];

    while (queue.length > 0) {
      const room = queue.shift()!;
      connections.push(...room.connections);
      room.children.forEach((child) => queue.push(child));
    }

    return connections;
  }

  getRoomCenter(room: ConnectableRoom | ConnectionRoom): { x: number; y: number } {
    if (room.type === 'rectangle') {
      const rectRoom = room as RectangleRoom;
      return {
        x: rectRoom.x + rectRoom.width / 2,
        y: rectRoom.y + rectRoom.height / 2,
      };
    }
    if (room.type === 'circular') {
      return { x: room.x, y: room.y };
    }
    if (room.type === 'connection') {
      const connRoom = room;
      return {
        x: connRoom.x + connRoom.width / 2,
        y: connRoom.y + connRoom.height / 2,
      };
    }
    throw new Error(`Unknown room type`);
  }

  findFarthestRoom(startRoom: ConnectableRoom): ConnectableRoom {
    let farthestRoom = startRoom;
    let maxDistance = 0;
    const startCenter = this.getRoomCenter(startRoom);

    for (const room of this.getAllRooms()) {
      const center = this.getRoomCenter(room);
      const distance = Math.sqrt(
        Math.pow(center.x - startCenter.x, 2) + Math.pow(center.y - startCenter.y, 2),
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        farthestRoom = room;
      }
    }

    return farthestRoom;
  }

  getSpawnableRoomCenters(): Array<{ x: number; y: number; room: ConnectableRoom }> {
    return this.getAllRooms().map((room) => ({
      ...this.getRoomCenter(room),
      room,
    }));
  }
}
