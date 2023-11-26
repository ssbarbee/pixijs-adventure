// Main function to check if the player's square is hitting a wall
import { Dungeon } from '../types';
import { getRoomAt } from './getRoomAt';

export function isWallAt(x: number, y: number, dungeon: Dungeon): boolean {
  const roomOrConnection = getRoomAt(x, y, dungeon);
  if (!roomOrConnection) {
    // If no room or connection is found at the position, it's likely a wall or empty space
    return true;
  }

  // Additional logic here if needed, to determine if the point is on the wall of the room
  // This part depends on how you define the walls in your rooms and connections

  return false; // Modify as needed based on your game's logic
}
