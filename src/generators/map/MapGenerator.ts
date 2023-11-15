type TileType = 'wall0' | 'grass0';
type Room = { x: number; y: number; width: number; height: number };

export class MapGenerator {
    map: TileType[][];
    rooms: Room[];
    roomCount: number;
    mapWidth: number;
    mapHeight: number;

    constructor(roomCount: number) {
        this.roomCount = roomCount;
        this.mapWidth = 20;  // These could be based on room count and sizes
        this.mapHeight = 20; // to better fit the rooms
        this.map = this.createEmptyMap(this.mapWidth, this.mapHeight);
        this.rooms = [];
    }

    createEmptyMap(width: number, height: number): TileType[][] {
        return Array.from({ length: height }, () =>
            Array.from({ length: width }, () => 'wall0')
        );
    }

    generate(): TileType[][] {
        // Central starting room
        const centralRoom = this.createRoom(true);
        this.rooms.push(centralRoom);
        this.placeRoom(centralRoom);

        // Additional rooms
        for (let i = 0; i < this.roomCount - 1; i++) {
            let newRoom = this.createRoom(false);
            while (this.isOverlapping(newRoom)) {
                newRoom = this.createRoom(false);
            }
            this.rooms.push(newRoom);
            this.placeRoom(newRoom);
        }

        // Connect rooms
        this.connectRooms();

        return this.map;
    }

    createRoom(isCentral: boolean): Room {
        const roomWidth = Math.floor(Math.random() * 6) + 5;
        const roomHeight = Math.floor(Math.random() * 6) + 5;
        const roomX = isCentral ? (this.mapWidth / 2) - (roomWidth / 2) : Math.floor(Math.random() * (this.mapWidth - roomWidth));
        const roomY = isCentral ? (this.mapHeight / 2) - (roomHeight / 2) : Math.floor(Math.random() * (this.mapHeight - roomHeight));
        return { x: roomX, y: roomY, width: roomWidth, height: roomHeight };
    }

    placeRoom(room: Room): void {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                this.map[y][x] = 'grass0';
            }
        }
    }

    isOverlapping(room: Room): boolean {
        for (const other of this.rooms) {
            if (
                room.x < other.x + other.width &&
                room.x + room.width > other.x &&
                room.y < other.y + other.height &&
                room.y + room.height > other.y
            ) {
                return true;
            }
        }
        return false;
    }

    connectRooms(): void {
        const centralRoom = this.rooms[0]; // Assuming the first room is central
        const centralPoint = {
            x: Math.floor(centralRoom.x + centralRoom.width / 2),
            y: Math.floor(centralRoom.y + centralRoom.height / 2)
        };

        this.rooms.slice(1).forEach(room => {
            const roomCenter = {
                x: Math.floor(room.x + room.width / 2),
                y: Math.floor(room.y + room.height / 2)
            };

            // Draw horizontal corridor
            for (let x = Math.min(roomCenter.x, centralPoint.x); x <= Math.max(roomCenter.x, centralPoint.x); x++) {
                this.map[roomCenter.y][x] = 'grass0';
            }

            // Draw vertical corridor
            for (let y = Math.min(roomCenter.y, centralPoint.y); y <= Math.max(roomCenter.y, centralPoint.y); y++) {
                this.map[y][centralPoint.x] = 'grass0';
            }
        });
    }
}