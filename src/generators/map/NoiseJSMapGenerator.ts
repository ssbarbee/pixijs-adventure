import Noise from 'noisejs';

type MapParams = {
    width: number;
    height: number;
    waterThreshold: number;  // Upper limit for water
    mountainThreshold: number;  // Lower limit for mountains
};

export function generateMap(params: MapParams): string[][] {
    const { width, height, waterThreshold, mountainThreshold } = params;
    const map: string[][] = Array.from({ length: height }, () => Array(width).fill('grass'));
    const noise = new Noise();
    noise.seed(Math.random()); // Seed the noise function

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = noise.perlin2(x / 100, y / 100); // Adjust scale factor as needed

            if (value < waterThreshold) {
                map[y][x] = 'water';
            } else if (value > mountainThreshold) {
                map[y][x] = 'wall';
            } else {
                map[y][x] = 'grass';
            }
        }
    }

    return map;
}