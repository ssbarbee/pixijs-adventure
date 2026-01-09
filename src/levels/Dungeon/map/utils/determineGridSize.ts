export function determineGridSize(dungeonWidth: number, dungeonHeight: number): number {
  // Use a fraction of the dungeon's smallest dimension, ensuring we return an integer >= 1
  // This prevents floating-point precision issues in grid calculations
  const size = Math.min(dungeonWidth, dungeonHeight) / 10;
  return Math.max(1, Math.floor(size));
}
