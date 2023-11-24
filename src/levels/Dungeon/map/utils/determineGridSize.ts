export function determineGridSize(dungeonWidth: number, dungeonHeight: number): number {
  // Example: Use a fraction of the dungeon's width or height, or a fixed value
  // Adjust this logic based on your game's requirements
  return Math.max(1, Math.min(dungeonWidth, dungeonHeight) / 10);
}
