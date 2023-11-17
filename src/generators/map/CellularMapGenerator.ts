import { Map } from 'rot-js';
import Cellular from 'rot-js/lib/map/cellular';

import { GRASS0, GRASS1, GRASS2, WALL0, WALL1 } from '../../constants';
import { findPlayerStartingPosition } from '../../utils/findPlayerStartingPosition';
import { getRandomString } from '../../utils/getRandomString';

function initializeMap(width: number, height: number): Cellular {
  const map = new Map.Cellular(width, height);
  map.randomize(0.5);
  for (let i = 0; i < 4; i++) map.create();
  map.connect(() => {}, 1);
  return map;
}

export function generateWorld(
  width: number,
  height: number,
): { world: string[][]; playerStartingX: number; playerStartingY: number } {
  const map = initializeMap(width, height);

  const world: string[][] = Array.from({ length: width }).map((_, x) =>
    Array.from({ length: height }).map((__, y) =>
      map._map[x][y] === 1
        ? getRandomString([WALL0, WALL1])
        : getRandomString([GRASS0, GRASS1, GRASS2]),
    ),
  );

  const { x: playerStartingX, y: playerStartingY } = findPlayerStartingPosition(world);
  return { world, playerStartingX, playerStartingY };
}
