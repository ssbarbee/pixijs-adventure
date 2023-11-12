import { Map } from 'rot-js';
import Cellular from 'rot-js/lib/map/cellular';

// Define a class for world generation
export class WorldGenerator {
    private map: Cellular;
    private rooms: { x: number; y: number; width: number; height: number }[] = [];

    constructor(private width: number, private height: number) {
        this.map = new Map.Cellular(width, height);
        this.map.randomize(0.5); // Randomize tiles
        this.map.create(); // Generate the cellular automaton map
    }

    generateWorld(): { world: string[][]; playerStartingX: number; playerStartingY: number } {
        const world: string[][] = [];
        let playerStartingX = -1;
        let playerStartingY = -1;

        for (let x = 0; x < this.width; x++) {
            const column: string[] = [];
            for (let y = 0; y < this.height; y++) {
                // Check if the current position is the player's starting position
                if (playerStartingX === -1 && playerStartingY === -1 && Math.random() < 0.05) {
                    playerStartingX = x;
                    playerStartingY = y;
                    column.push('P'); // 'P' represents the player
                } else {
                    // You can add other content to the room here
                    column.push(this.map._map[x][y] === 1 ? '#' : '.'); // Customize tile characters as needed
                }
            }
            world.push(column);
        }

        // Randomly shuffle the player's starting position within the world map
        const shuffledX = Math.floor(Math.random() * this.width);
        const shuffledY = Math.floor(Math.random() * this.height);

        // Swap the player's starting position with the shuffled position
        const temp = world[playerStartingX][playerStartingY];
        world[playerStartingX][playerStartingY] = world[shuffledX][shuffledY];
        world[shuffledX][shuffledY] = temp;

        return { world, playerStartingX: shuffledX, playerStartingY: shuffledY };
    }
}
