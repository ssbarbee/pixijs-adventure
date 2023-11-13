import { Map } from 'rot-js';
import Cellular from 'rot-js/lib/map/cellular';
import { getRandomString } from './utils/getRandomString';
import { GRASS0, GRASS1, GRASS2, WALL0, WALL1 } from './constants';

// Define a class for world generation
export class CellularMapGenerator {
    private map: Cellular;

    constructor(private width: number, private height: number) {
        this.map = new Map.Cellular(width, height);
        this.map.randomize(0.5); // Randomize tiles
        this.map.create(); // Generate the cellular automaton map
        /* now connect the maze so the player can reach all non-wall sections */
        this.map.connect(() => {}, 1);
    }

    private findPlayerStartingPosition(world: string[][]): { x: number, y: number } {
        const dots: { x: number, y: number }[] = [];

        // Collect all coordinates with value '.'
        for (let x = 0; x < world.length; x++) {
            for (let y = 0; y < world[x].length; y++) {
                if (world[x][y] === '.') {
                    dots.push({ x, y });
                }
            }
        }

        // Choose a random coordinate
        if (dots.length === 0) return { x: 0, y: 0 };
        const randomIndex = Math.floor(Math.random() * dots.length);
        return dots[randomIndex];
    }

    generateWorld(): { world: string[][]; playerStartingX: number; playerStartingY: number } {
        const world: string[][] = Array.from({ length: this.width }).map((_, x) =>
            Array.from({ length: this.height }).map((__, y) =>
                this.map._map[x][y] === 1 ? getRandomString([WALL0, WALL1]) : getRandomString([GRASS0, GRASS1, GRASS2])
            )
        );

        const {x: playerStartingX, y: playerStartingY} = this.findPlayerStartingPosition(world);
        return { world, playerStartingX, playerStartingY };
    }
}
