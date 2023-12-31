import { isGrass } from './isGrass';
export function findPlayerStartingPosition(world: string[][]): { x: number; y: number } {
  const dots: { x: number; y: number }[] = [];

  for (let x = 0; x < world.length; x++) {
    for (let y = 0; y < world[x].length; y++) {
      if (isGrass(world[x][y])) {
        dots.push({ x, y });
      }
    }
  }

  if (dots.length === 0) return { x: 0, y: 0 };
  const randomIndex = Math.floor(Math.random() * dots.length);
  return dots[randomIndex];
}
