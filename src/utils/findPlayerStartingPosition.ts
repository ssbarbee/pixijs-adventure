import { GRASS0, GRASS1, GRASS2 } from '../constants';
export function findPlayerStartingPosition(world: string[][]): { x: number, y: number } {
    const dots: { x: number, y: number }[] = [];

    for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
            if (world[x][y] === GRASS0 || world[x][y] === GRASS1 || world[x][y] === GRASS2) {
                dots.push({ x, y });
            }
        }
    }

    if (dots.length === 0) return { x: 0, y: 0 };
    const randomIndex = Math.floor(Math.random() * dots.length);
    return dots[randomIndex];
}