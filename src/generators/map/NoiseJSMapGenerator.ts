import { createNoise2D } from 'simplex-noise';
import { GRASS0, WALL0, WATER0 } from '../../constants';
import { findPlayerStartingPosition } from '../../utils/findPlayerStartingPosition';

type MapParams = {
    width: number;
    height: number;
    waterThreshold: number;  // Upper limit for water
    mountainThreshold: number;  // Lower limit for mountains
};

export function generateMap(params: MapParams): { world: string[][]; playerStartingX: number; playerStartingY: number } {
    const { width, height, waterThreshold, mountainThreshold } = params;
    const map: string[][] = Array.from({ length: height }, () => Array(width).fill('grass'));
    const noise = createNoise2D();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = noise(x / 100, y / 100); // Adjust scale factor as needed

            if (value < waterThreshold) {
                map[y][x] = WATER0;
            } else if (value > mountainThreshold) {
                map[y][x] = WALL0;
            } else {
                map[y][x] = GRASS0;
            }
        }
    }

    const { x: playerStartingX, y: playerStartingY } = findPlayerStartingPosition(map);


    return { world: map, playerStartingX, playerStartingY  };
}