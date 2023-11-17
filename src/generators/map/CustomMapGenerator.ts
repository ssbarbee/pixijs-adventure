import { GRASS0 } from '../../constants';

type MapParams = {
  width: number;
  height: number;
  waterPercentage: number;
  mountPercentage: number;
};

export function generateMap(params: MapParams): string[][] {
  const { width, height, waterPercentage, mountPercentage } = params;
  const totalCells = width * height;
  const waterCells = Math.floor((totalCells * waterPercentage) / 100);
  const mountCells = Math.floor((totalCells * mountPercentage) / 100);

  const map: string[][] = Array.from({ length: height }, () => Array<string>(width).fill(GRASS0));

  function spreadElement(startX: number, startY: number, element: string, maxCells: number) {
    let x = startX,
      y = startY,
      count = 0;

    while (count < maxCells) {
      if (x >= 0 && x < width && y >= 0 && y < height && map[y][x] === 'grass') {
        map[y][x] = element;
        count++;
      }
      const direction = Math.floor(Math.random() * 4);
      if (direction === 0) y--;
      else if (direction === 1) x++;
      else if (direction === 2) y++;
      else if (direction === 3) x--;

      // Boundary checks
      x = Math.max(0, Math.min(x, width - 1));
      y = Math.max(0, Math.min(y, height - 1));
    }
  }

  // Spread water
  let waterSpread = 0;
  while (waterSpread < waterCells) {
    const waterStartX = Math.floor(Math.random() * width);
    const waterStartY = Math.floor(Math.random() * height);
    spreadElement(waterStartX, waterStartY, 'water', waterCells - waterSpread);
    waterSpread = map.flat().filter((cell) => cell === 'water').length;
  }

  // Spread mountains
  let mountSpread = 0;
  while (mountSpread < mountCells) {
    const mountStartX = Math.floor(Math.random() * width);
    const mountStartY = Math.floor(Math.random() * height);
    spreadElement(mountStartX, mountStartY, 'wall', mountCells - mountSpread);
    mountSpread = map.flat().filter((cell) => cell === 'wall').length;
  }

  return map;
}
